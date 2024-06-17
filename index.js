const dotenv = require('dotenv');
dotenv.config({path: './.env'});
const {applicationPort, environment} = require("./src/config/config");
const config = require('./src/config/config');
// const bot = require('./bot/telegram');
const cron = require('node-cron');
const winston = require('winston');
// const utils = require('./utils/utils');
const express = require('express');
const FinAmRuService = require('./src/services/FinAmRuService');
const fInAmRuService = new FinAmRuService();

const logger = winston.createLogger({
    level: 'info',
    format: winston.format.json(),
    transports: [
        new winston.transports.Console(),
        new winston.transports.File({filename: 'error.log', level: 'error'}),
        new winston.transports.File({filename: 'combined.log'}),
    ],
});

if (environment !== 'production') {
    logger.add(new winston.transports.Console({
        format: winston.format.simple(),
    }));
}

const app = express();
const port = applicationPort || 8080;

app.get('/', (req, res) => {
    res.send('Hello my boy!');
});

app.listen(port, () => {
    logger.info(`Server is running on port ${port}`);
});

cron.schedule('* *  * * *', async () => {
    try {
        const news = await fInAmRuService.fetchNews();
        await fInAmRuService.saveNews(news);

        // await bot.sendMessage(chatId, messageOptions.text, {
        //     reply_markup: messageOptions.reply_markup ,
        //     parse_mode: messageOptions.parse_mode,
        // });
    } catch (error) {
        logger.error('Error while fetching finam.ru data', error);
    }
});