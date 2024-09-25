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
// const protobuf = require('protocol-buffers')
const dict_1 = require("./dict");
// import { Dictionary } from "./dictionary"; // Requires Closure compiler :/
const https_1 = require("firebase-functions/v2/https");
const { logger } = require("firebase-functions");
const express = require('express');
const express_handlebars_1 = require("express-handlebars");
// const DICT_PATH_OLD = path.join(__dirname, 'cedict_parsed.csv');
// const DICT_PROTO_PATH = path.join(__dirname, 'dictionary.proto');
const DICT_PATH = path.join(__dirname, 'full_dict_raw.json');
const app = express();
app.engine('handlebars', (0, express_handlebars_1.engine)({ extname: '.hbs' }));
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, '..', 'views'));
function cacheIt(req, res, next) {
    // Cache for 7d.
    res.set('Cache-Control', 'public, max-age=604800');
    next();
}
function loadDictionary() {
    // TODO: Read raw proto file from disk to improve startup time.
    // Or use CSV or TSV to skip the proto dependency.
    const rawDict = JSON.parse(fs.readFileSync(DICT_PATH, 'utf8'));
    logger.log('COLD START - DICT STATS');
    logger.log('ENTRIES = ', rawDict.length);
    return rawDict;
}
const dict = new dict_1.Dict(loadDictionary());
//export const wordpage = onRequest(async (req, res) => {
app.get('/word/:word', cacheIt, (req, res) => {
    const entry = dict.findWord(req.params.word);
    if (entry) {
        try {
            const chars = [];
            for (const simpChar of entry.simplified.split('')) {
                chars.push({
                    simplified: simpChar,
                });
            }
            entry.pinyin.split(' ').forEach((pinyinChar, i) => {
                chars[i].pinyin = pinyinChar;
            });
            entry.tags = entry.tags.filter((t) => t != 'cedict');
            res.render('word', {
                title: entry.simplified,
                chars: chars,
                entry: entry,
            });
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
// TODO should this be its own page or just a /results page with #HSK1?
app.get('/tag/:tag', cacheIt, (req, res) => {
    const entries = dict.findTag(req.params.tag);
    logger.log('ENTRIES LEN', entries.length);
    res.render('results', {
        entries: entries,
    });
});
app.get('/random', (req, res) => {
    const entry = dict.randomEntry();
    res.redirect(302, `/word/${entry.simplified}`);
});
app.get('/about', cacheIt, (req, res) => {
    res.render('about');
});
exports.app = (0, https_1.onRequest)(app);
//# sourceMappingURL=index.js.map