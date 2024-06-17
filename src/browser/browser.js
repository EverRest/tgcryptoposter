const randomUseragent = require('random-useragent');
const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
const {puppeteerExecutablePath} = require('../config/config');

class Browser {
    constructor() {
        this.browser = null;
        puppeteer.use(StealthPlugin());
    }

    async getPageMarkup(url) {
        const {page} = await this.createPage(url);
        const content = await page.content();
        await page.close();
        return content;
    }

    async launchBrowser() {
        const arg = [
            '--disable-gpu',
            '--disable-setuid-sandbox',
            '--no-sandbox',
            '--no-zygote'
        ];
        this.browser = await puppeteer.launch({
            executablePath: puppeteerExecutablePath,
            args: arg,
        });
    }

    async closeBrowser() {
        await this.browser.close();
    }

    async createPage(url) {
        const USER_AGENT = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/73.0.3683.75 Safari/537.36';
        const userAgent = randomUseragent.getRandom();
        const UA = userAgent || USER_AGENT;
        const page = await this.browser.newPage();
        await page.setDefaultNavigationTimeout(30000);
        await page.setViewport({
            width: 1920 + Math.floor(Math.random() * 100),
            height: 1280 + Math.floor(Math.random() * 100),
            deviceScaleFactor: 1,
            hasTouch: false,
            isLandscape: false,
            isMobile: false,
        });
        await page.setUserAgent(UA);
        await page.setJavaScriptEnabled(true);
        await page.setDefaultNavigationTimeout(0);
        await this.passChecks(page);
        let screenshot = await this.captureScreenshot(page, url);
        return {page, screenshot};
    }

    async passChecks(page) {
        await page.evaluateOnNewDocument(() => {
            Object.defineProperty(navigator, 'webdriver', {get: () => false});
            window.chrome = {runtime: {}};
            const originalQuery = window.navigator.permissions.query;
            window.navigator.permissions.query = (parameters) => (
                parameters.name === 'notifications' ? Promise.resolve({state: Notification.permission}) : originalQuery(parameters)
            );
            Object.defineProperty(navigator, 'plugins', {get: () => [1, 2, 3, 4, 5]});
            Object.defineProperty(navigator, 'languages', {get: () => ['en-US', 'en']});
        });
    }

    async captureScreenshot(page, url) {
        let screenshot;
        try {
            await page.goto(url, {waitUntil: 'networkidle0', timeout: 60000});
            screenshot = await page.screenshot({omitBackground: true, encoding: 'binary'})
        } catch (error) {
            if (error.name === "TimeoutError") {
                screenshot = await page.screenshot({omitBackground: true, encoding: 'binary'});
            }
        }
        return screenshot;
    }
}

module.exports = Browser;