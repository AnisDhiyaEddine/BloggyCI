const Page = require("./helpers/page");

let page;

beforeEach(async () => {
  page = await Page.build();
  await page.goto("localhost:3000");
});

afterEach(async () => {
  await page.close();
});

describe("when logged in", async () => {
  beforeEach(async () => {
    await page.login();
    await page.click("a.btn-floating");
  });

  test("add blog form", async () => {
    const text = await page.getContentOf("form label");
    expect(text).toBe("Blog Title");
  });

  describe("and using invalid input", async () => {
    beforeEach(async () => {
      await page.click("form button");
    });

    test("invalid input err msg", async () => {
      const titleErr = await page.getContentOf(".title .red-text");
      const contentErr = await page.getContentOf(".content .red-text");

      expect(titleErr).toEqual("You must provide a value");
      expect(contentErr).toEqual("You must provide a value");
    });
  });

  describe("and using valid inputs", async () => {
    beforeEach(async () => {
      await page.type(".title input", "Test title");
      await page.type(".content input", "Test content");
      await page.click("form button");
    });
    test("redirect user to review screen Confirmation", async () => {
      const text = await page.getContentOf("h5");
      expect(text).toEqual("Please confirm your entries");
    });

    test("blog appears in main page", async () => {
      await page.click(".green");
      await page.waitFor(".btn-floating");
      const title = await page.getContentOf(".card-title");
      const content = await page.getContentOf("p");

      expect(title).toEqual("Test title");
      expect(content).toEqual("Test content");
    });
  });
});

describe("when not logged in", async () => {
  test("can't add blog", async () => {
    const result = await page.evaluate(() => {
      return fetch("api/blogs", {
        method: "POST",
        credentials: "same-origin",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title: "My Title", content: "My Content" }),
      }).then((res) => res.json());
    });
    expect(result.error).toEqual("You must log in!");
  });

  test('can"t see posts', async () => {
    const result = await page.evaluate(() => {
      return fetch("api/blogs", {
        method: "GET",
        credentials: "same-origin",
        headers: {
          "Content-Type": "application/json",
        },
      }).then((res) => res.json());
    });
    expect(result.error).toEqual("You must log in!");
  });
});
