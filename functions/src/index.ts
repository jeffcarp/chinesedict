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

import { Dictionary, processRawTextToDict } from "./dictionary";

import {onRequest} from "firebase-functions/v2/https";
// const {logger} = require("firebase-functions");
const express = require('express');
import { engine } from 'express-handlebars';

const DICT_PATH = path.join(__dirname, 'cedict_parsed.csv');

const app = express();

app.engine('handlebars', engine({extname: '.hbs'}));
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, '..', 'views'));

function loadDictionary() {
  const rawCsv = fs.readFileSync(DICT_PATH, 'utf-8');
  return processRawTextToDict(rawCsv)
}

const dict = new Dictionary(loadDictionary());

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
