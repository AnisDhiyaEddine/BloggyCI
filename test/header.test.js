const puppeteer = require("puppeteer");
let browser, page;
beforeEach(async () => {
  browser = await puppeteer.launch({
    headless: false,
  });
  page = await browser.newPage();
  await page.goto("http://localhost:3000");
});

afterEach(async () => {
  await browser.close();
});

test("header loaded", async () => {
  const text = await page.$eval("a.brand-logo", (el) => el.innerHTML);
  expect(text).toEqual("Blogster");
});

test("OAuth flow redirected", async () => {
  await page.click(".right a");
  const url = page.url();
  expect(url).toMatch(/github\.com\/login/);
});

test("signed in", async () => {
  const id = "5ec2eee9ac823d25a642863a";
  const Buffer = require("safe-buffer").Buffer;
  const sessionObj = {
    passport: {
      user: id,
    },
  };
  const sessionStr = Buffer.from(JSON.stringify(sessionObj)).toString("base64");
  const Keygrip = require("keygrip");
  const keys = require("../config/keys");
  const keygrip = new Keygrip([keys.cookieKey]);
  const sig = keygrip.sign("session=" + sessionStr);
  await page.setCookie({ name: "session", value: sessionStr });
  await page.setCookie({ name: "session.sig", value: sig });
  await page.goto("localhost:3000");
  await page.waitFor('a[href="/auth/logout"]')
  const text = await page.$eval('a[href="/auth/logout"]', (el) => el.innerHTML);
  expect(text).toEqual("Logout");
});
