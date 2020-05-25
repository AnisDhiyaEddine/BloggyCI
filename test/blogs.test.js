const Page = require("./helpers/page");

let page;

beforeEach(async () => {
  page = await Page.build();
  await page.goto("http://localhost:3000");
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
    /*
    //Test require greater performance .. setTimeout err
    test.only("blog appears in main page", async () => {
      await page.click("button.green");
      await page.waitFor(".btn-floating");
      const title = await page.getContentOf(".card-title");
      const content = await page.getContentOf("p");

      expect(title).toEqual("Test title");
      expect(content).toEqual("Test content");
    }); 
    */
  });
});

describe("when not logged in", async () => {
  const actions = [
    {
      method: "get",
      path: "api/blogs",
    },
    {
      method: "post",
      path: "api/blogs",
      data: {
        title: "my title",
        content: "mt content",
      },
    },
  ];

  test("relative actions are prohibited", async () => {
    const results = await page.execRequests(actions);
    console.log(results);
    for (let result of results) {
      expect(result).toEqual({ error: "You must log in!" });
    }
  });
});
