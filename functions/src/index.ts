/**
 * Import function triggers from their respective submodules:
 *
 * import {onCall} from "firebase-functions/v2/https";
 * import {onDocumentWritten} from "firebase-functions/v2/firestore";
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

import {onRequest} from "firebase-functions/v2/https";
const {logger} = require("firebase-functions");
const express = require('express');
import { engine } from 'express-handlebars';
const path = require('path');

const app = express();

app.engine('handlebars', engine({extname: '.hbs'}));
app.set('view engine', 'handlebars');
//app.set('views', './views');
app.set('views', path.join(__dirname, '..', 'views'));

const fakeDictionary = {
  '小狗': true,
}

//export const wordpage = onRequest(async (req, res) => {
app.get('/word/:word', async (req: any, res: any) => {
  const word = req.params.word;
  if (fakeDictionary.hasOwnProperty(word)) {
    try {
      const data = {
          name: word,
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
