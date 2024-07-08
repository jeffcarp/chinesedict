/**
 * Import function triggers from their respective submodules:
 *
 * import {onCall} from "firebase-functions/v2/https";
 * import {onDocumentWritten} from "firebase-functions/v2/firestore";
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

const path = require('path');
const fs  = require('fs');

// const protobuf = require('protocol-buffers')

import { Dict, Entry } from "./dict";
// import { Dictionary } from "./dictionary"; // Requires Closure compiler :/

import {onRequest} from "firebase-functions/v2/https";
const {logger} = require("firebase-functions");
const express = require('express');
import { engine } from 'express-handlebars';

// const DICT_PATH_OLD = path.join(__dirname, 'cedict_parsed.csv');
// const DICT_PROTO_PATH = path.join(__dirname, 'dictionary.proto');
const DICT_PATH = path.join(__dirname, 'full_dict_raw.json');

const app = express();

app.engine('handlebars', engine({extname: '.hbs'}));
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, '..', 'views'));

function cacheControlMiddleware(req: any, res: any, next: any) {
   // Cache for 7d.
  res.set('Cache-Control', 'public, max-age=604800');
  next();
}
app.use(cacheControlMiddleware);

function loadDictionary() {
  logger.log('COLD START - REINITIALIZING DICTIONARY')

  // const messages = protobuf(fs.readFileSync(DICT_PROTO_PATH));
  // TODO: Read raw proto file from disk to improve startup time.
  // Or use CSV or TSV to skip the proto dependency.
  const rawDict = JSON.parse(fs.readFileSync(DICT_PATH, 'utf8'));
  // const dictionary = messages.Dictionary.decode(rawDict);
  //
  logger.log('DICT STATS')
  logger.log('ENTRIES = ', rawDict.entries.length)

  const fakeRawEntries = rawDict.entries.map((entry: Entry) => {
    return {
      simplified: entry.simplified,
      pinyin: entry.pinyin,
      // searchablePinyin: "",
      definitions: entry.definitions,
      //percentile: Number(percentile),
    };
  });

  // const rawCsv = fs.readFileSync(DICT_PATH_OLD, 'utf-8');
  // return processRawTextToDict(rawCsv)
  return fakeRawEntries
}

const dict = new Dict(loadDictionary());

//export const wordpage = onRequest(async (req, res) => {
app.get('/word/:word', (req: any, res: any) => {
  let foundEntry = dict.findWord(req.params.word);

  if (foundEntry) {
    try {
      const data = {
          entry: foundEntry,
      };
      res.render('word', data);
    } catch (error) {
        console.error("Error rendering email:", error);
        res.status(500).send("Internal Server Error");
    }
  } else{
    res.send('Word not found.')
  }
});

exports.app = onRequest(app);
