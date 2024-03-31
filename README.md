# Web Scrapping with Puppeteer and TypeScript

This project, `scrapper-basic-flipkart`, is a minor web scraper that uses [Puppeteer](https://pptr.dev/) to scrape data from Flipkart listings. The project is written in [TypeScript](https://www.typescriptlang.org/), a statically typed superset of JavaScript that adds optional types.

## Usage

The main entry point of the application is [`index.ts`](index.ts). This script launches a Puppeteer browser instance, navigates to the Flipkart website, and scrapes product data from the listings. The scraped data is then saved to a JSON file named `parsed_flipkart_data.json`.

## Puppeteer

Puppeteer is a Node library which provides a high-level API to control Chrome or Chromium over the DevTools Protocol. Puppeteer runs headless by default but can be configured to run full (non-headless) Chrome or Chromium.

In this project, Puppeteer is used to navigate to the Flipkart website and interact with the webpage as if a real user were browsing the site. It fetches product details such as title, rating, price, and specifications.

## TypeScript

TypeScript is used in this project to ensure type safety and improve the development experience with features like autocompletion, type inference, and type checking.

## Bun.js

The project uses [Bun.js](https://github.com/bunjs/bun) as a development dependency. Bun.js is a minimalistic build tool for JavaScript and TypeScript projects. It's used in this project to run the `index.ts` script. You can start the script by running the following command in your terminal:

```sh
bun install
```

```sh
npm run start
```