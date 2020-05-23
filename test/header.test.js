const { setupDatabaseOAuth } = require("./factory/userFactory");
const Page = require("./helpers/page");
let page;
beforeEach(async () => {
  setupDatabaseOAuth();
  page = await Page.build();
  await page.goto("http://localhost:3000/");
});

afterEach(async () => {
  await page.close();
});

test("header loaded", async () => {
  const text = await page.getContentOf("a.brand-logo");
  expect(text).toEqual("Blogster");
});

//Needs an internet connection
test("OAuth flow redirected", async () => {
  await page.click(".right a");
  const url = page.url();
  expect(url).toMatch(/github\.com\/login/);
});

test("signed in", async () => {
  await page.login();
  await page.waitFor('a[href="/auth/logout"]');
  const text = await page.$eval('a[href="/auth/logout"]', (el) => el.innerHTML);
  expect(text).toEqual("Logout");
});
