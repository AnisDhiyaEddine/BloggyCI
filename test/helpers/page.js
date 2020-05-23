const puppeteer = require("puppeteer");
const { githubUserID, githubUser } = require("../factory/userFactory");
const sessionFactory = require("../factory/sessionFactroy");

class CustomPage {
  static async build() {
    const browser = await puppeteer.launch({
      headless: false,
    });

    const page = await browser.newPage();
    const customPage = new CustomPage(page);
    return new Proxy(customPage, {
      get: function (target, property) {
        return customPage[property] || browser[property] || page[property];
      },
    });
  }

  constructor(page) {
    this.page = page;
  }

  async login() {
    const { session, sig } = sessionFactory(githubUser);
    await this.page.setCookie({ name: "session", value: session });
    await this.page.setCookie({ name: "session.sig", value: sig });
    await this.page.goto("http://localhost:3000/");
  }
}

module.exports = CustomPage;
