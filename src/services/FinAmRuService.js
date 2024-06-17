const cheerio = require('cheerio');
const Browser = require('../browser/browser');
const {finAmRuUrl} = require("../config/config");
const ArticleRepository = require('../db/ArticleRepository');

class FinAmService {
    constructor() {
        this.browser = new Browser();
        this.articleRepository = new ArticleRepository();
    }

    async fetchNews() {
        await this.browser.launchBrowser();
        const html = await this.browser.getPageMarkup(finAmRuUrl);
        await this.browser.closeBrowser();
        const $ = cheerio.load(html);
        let articles = [];
        $('.publication-list-item').each((index, element) => {
            let time = $(element).find('.cl-grey span:first-child').text().trim();
            let source = $(element).find('.cl-grey span:last-child').text().trim();
            let title = $(element).find('.font-l.bold').text().trim();
            let description = $(element).find('p.cl-black').text().trim();
            let link = $(element).attr('href');
            articles.push({time, source, title, description, link});
        });
        return articles;
    }

    async saveNews(articles){
        // for (let article of articles) {
        //     await this.articleRepository.createArticle(article);
        // }
        return articles;
    }
}

module.exports = FinAmService;