import { launch } from "puppeteer";
import { appendFile } from "fs";

(async () => {
  const browser = await launch({
    headless: false,
    defaultViewport: null,
    userDataDir: "./tmp",
  });
  const page = await browser.newPage();
  await page.goto("https://www.flipkart.com/search?q=phone", {
    waitUntil: "load",
  });

  const productData: any = [];

  async function fetchData() {
    const fetchElements = await page.evaluate(productsDataEval);
    productData.push(...fetchElements);
  }

  let isNextBtnPresent = true;
  let currentPage = 1;

  while (currentPage < 43) {
    await fetchData();
    const nextBtn = (await page.$$("._1LKTO3")).pop();
    isNextBtnPresent =
      (await nextBtn?.evaluate((node) => node.textContent)) === "Next";
    await new Promise((resolve) => setTimeout(resolve, 500));
    if (nextBtn && isNextBtnPresent) {
      await nextBtn.evaluate((node: any) => node.click());
    } else {
      break;
    }
    currentPage++;
  }

  appendFile(
    "parsed_flipkart_data.json",
    JSON.stringify(productData, null, 2),
    (err) => {
      if (err) {
        console.error(err);
        return;
      }
      console.log("File has been created");
    }
  );

  await browser.close();
})();

function productsDataEval() {
  function sanitizeHTMLToData(node: HTMLElement): any {
    const title = node.querySelector("._4rR01T")?.textContent;
    const rating = node.querySelector("._3LWZlK")?.textContent;
    const price = node.querySelector("._30jeq3")?.textContent;
    const product_img = node.querySelector("._396cs4")?.getAttribute("src");
    const specifications = Array.from(
      node.querySelectorAll(".rgWa7D"),
      (node) => {
        return node.textContent;
      }
    );
    return { title, rating, price, specifications, product_img };
  }

  function getProductDetails(node: HTMLElement): any {
    return sanitizeHTMLToData(node);
  }

  const fetchElements = Array.from(
    document.getElementsByClassName("_1fQZEK"),
    (node) => {
      return getProductDetails(node as HTMLElement);
    }
  );
  return fetchElements;
}
