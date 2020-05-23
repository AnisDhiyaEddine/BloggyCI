const puppeteer = require("puppeteer");
const sessionFactory = require("./factory/sessionFactroy");
const userFactory = require("./factory/userFactory");
const { githubUserID, githubUser, setupDatabaseOAuth } = userFactory;

let browser, page;
beforeEach(async () => {
  setupDatabaseOAuth()
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

test.only("signed in", async () => {
  console.log(githubUser);
  
  const {session , sig} = sessionFactory(githubUser)
  await page.setCookie({ name: "session", value: session});
  await page.setCookie({ name: "session.sig", value: sig });
  await page.goto("localhost:3000");
  await page.waitFor('a[href="/auth/logout"]')
  const text = await page.$eval('a[href="/auth/logout"]', (el) => el.innerHTML);
  expect(text).toEqual("Logout");
  
});
