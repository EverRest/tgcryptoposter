require('dotenv').config();

module.exports = {
    applicationPort: process.env.APPLICATION_PORT,
    environment: process.env.NODE_ENV,
    finAmRuUrl: "https://www.finam.ru/publications/section/cryptonews/",
    puppeteerExecutablePath: "/usr/bin/chromium",
};