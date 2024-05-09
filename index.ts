import { launch } from "puppeteer";
import { appendFile } from "fs";

(async () => {
  const browser = await launch({
    headless: false,
    defaultViewport: null,
    userDataDir: "./tmp",
  });
  const page = await browser.newPage();
  await page.goto("https://www.flipkart.com/search?q=laptop", {
    waitUntil: "load",
  });

  const productData: any = [];

  async function fetchData() {
    const fetchElements = await page.evaluate(productsDataEval);
    console.log(fetchElements)
    productData.push(...fetchElements);
  }

  let isNextBtnPresent = true;
  let currentPage = 1;

  while (currentPage < 20) {
    await fetchData();
    const nextBtn = (await page.$$("._9QVEpD")).pop();
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
    const title = node.querySelector(".KzDlHZ")?.textContent;
    const rating = node.querySelector(".XQDdHH")?.textContent;
    const price = node.querySelector("._4b5DiR")?.textContent;
    const product_img = node.querySelector(".DByuf4")?.getAttribute("src");
    const specifications = Array.from(
      node.querySelectorAll(".G4BRas"),
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
    document.getElementsByClassName("tUxRFH"),
    (node) => {
      return getProductDetails(node as HTMLElement);
    }
  );
  return fetchElements;
}
