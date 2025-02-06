const express = require('express');
const serverless = require('serverless-http');
const chromium = require('chromium');
const puppeteer = require('puppeteer-core');
require("dotenv").config();
const cors = require('cors');

const app = express();
const router = express.Router();

const isValidHttpUrl = (url) => {
    try {
        const newUrl = new URL(url);
        return newUrl.protocol === 'http:' || newUrl.protocol === 'https:';
    }
    catch {
        return false;
    }
};

// show msg
router.get('/', (req, res) => {
    res.send('Hola, you are not in the correct route');
});

// response 
router.get('/gettitle', async (req, res) => {
    const url = req.query.url;
    try {
        if (!isValidHttpUrl(url)) {
            return res.status(400).json({ error: 'Invalid URL' });
        }

        const browser = await puppeteer.launch({
            args: [
                "--disable-setuid-sandbox",
                "--no-sandbox",
                "--single-process",
                "--no-zygote",
            ],
            headless: true,
            ignoreDefaultArgs: ['--disable-extensions'],
            executablePath: chromium.path,
        });

        const page = await browser.newPage();
        await page.goto(url);
        const pageTitle = await page.evaluate(() => {
            return document.title;
        });

        await browser.close();

        return res.status(200).json({ title: pageTitle });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: error.message });
    }
});

app.use(cors({
    origin: '*'
}));

app.use('/.netlify/functions/api', router);
module.exports.handler = serverless(app);

// netlify env:set PUPPETEER_SKIP_CHROMIUM_DOWNLOAD true
// netlify env:set  \PUPPETEER_EXECUTABLE_PATH /usr/bin/google-chrome-stable