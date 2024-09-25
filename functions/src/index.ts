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

import { Dict } from "./dict";
// import { Dictionary } from "./dictionary"; // Requires Closure compiler :/

import {onRequest} from "firebase-functions/v2/https";
const {logger} = require("firebase-functions");
const express = require('express');
import { engine } from 'express-handlebars';
import { Request, Response } from 'express';

// const DICT_PATH_OLD = path.join(__dirname, 'cedict_parsed.csv');
// const DICT_PROTO_PATH = path.join(__dirname, 'dictionary.proto');
const DICT_PATH = path.join(__dirname, 'full_dict_raw.json');

const app = express();

app.engine('handlebars', engine({extname: '.hbs'}));
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, '..', 'views'));

function cacheIt(req: any, res: any, next: any) {
   // Cache for 7d.
  res.set('Cache-Control', 'public, max-age=604800');
  next();
}

function loadDictionary() {
  // TODO: Read raw proto file from disk to improve startup time.
  // Or use CSV or TSV to skip the proto dependency.
  const rawDict = JSON.parse(fs.readFileSync(DICT_PATH, 'utf8'));
  logger.log('COLD START - DICT STATS')
  logger.log('ENTRIES = ', rawDict.length)
  return rawDict
}

const dict = new Dict(loadDictionary());

//export const wordpage = onRequest(async (req, res) => {
app.get('/word/:word', cacheIt, (req: any, res: any) => {
  const entry = dict.findWord(req.params.word);
  if (entry) {
    try {
      const chars: { simplified?: string, pinyin?: string }[] = [];
      for (const simpChar of entry.simplified.split('')) {
        chars.push({
          simplified: simpChar,
        })
      }
      entry.pinyin.split(' ').forEach((pinyinChar, i: number) => {
        chars[i].pinyin = pinyinChar;
      })

      entry.tags = entry.tags.filter((t) => t != 'cedict')

      res.render('word', {
          title: entry.simplified,
          chars: chars,
          entry: entry,
      });
    } catch (error) {
        console.error("Error rendering email:", error);
        res.status(500).send("Internal Server Error");
    }
  } else{
    res.send('Word not found.')
  }
});

// TODO should this be its own page or just a /results page with #HSK1?
app.get('/tag/:tag', cacheIt, (req: any, res: any) => {
  const entries = dict.findTag(req.params.tag);
  logger.log('ENTRIES LEN', entries.length)
  res.render('results', {
      entries: entries,
  });
});

app.get('/random', (req: any, res: any) => {
  const entry = dict.randomEntry();
  res.redirect(302, `/word/${entry.simplified}`);
});

app.get('/about', cacheIt, (req: Request, res: Response) => {
  res.render('about');
});

exports.app = onRequest(app);
