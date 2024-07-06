"use strict";
/**
 * Import function triggers from their respective submodules:
 *
 * import {onCall} from "firebase-functions/v2/https";
 * import {onDocumentWritten} from "firebase-functions/v2/firestore";
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */
Object.defineProperty(exports, "__esModule", { value: true });
const path = require('path');
const fs = require('fs');
const dictionary_1 = require("./dictionary");
const https_1 = require("firebase-functions/v2/https");
// const {logger} = require("firebase-functions");
const express = require('express');
const express_handlebars_1 = require("express-handlebars");
const DICT_PATH = path.join(__dirname, 'cedict_parsed.csv');
const app = express();
app.engine('handlebars', (0, express_handlebars_1.engine)({ extname: '.hbs' }));
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, '..', 'views'));
function loadDictionary() {
    const rawCsv = fs.readFileSync(DICT_PATH, 'utf-8');
    return (0, dictionary_1.processRawTextToDict)(rawCsv);
}
const dict = new dictionary_1.Dictionary(loadDictionary());
//export const wordpage = onRequest(async (req, res) => {
app.get('/word/:word', (req, res) => {
    let foundEntry = dict.findWord(req.params.word);
    if (foundEntry) {
        try {
            const data = {
                entry: foundEntry,
            };
            res.render('word', data);
        }
        catch (error) {
            console.error("Error rendering email:", error);
            res.status(500).send("Internal Server Error");
        }
    }
    else {
        res.send('Word not found.');
    }
});
exports.app = (0, https_1.onRequest)(app);
//# sourceMappingURL=index.js.map