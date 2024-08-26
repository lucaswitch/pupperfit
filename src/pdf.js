import puppeteer from "puppeteer";
import os from "os";
import { randomBytes } from "node:crypto";
import { nanoid } from "nanoid";

const tmpDir = os.tmpdir();

let browser = null;

/**
 * Gets the current browser instance.
 * @return {Promise<null|Browser>}
 */
async function getBrowserInstance() {
  if (!browser) {
    try {
      browser = await puppeteer.launch();
    } catch (err) {
      console.error(`It was not possible to create puppeteer instance. ${err}`);
      browser = null;
    }
  }
  return browser;
}

/**
 * Creates a pdf from a html string
 * @param browser {Browser} The chromium headless browser launched instance.
 * @param html {string} The full html page as string.
 * @return {Promise<null|string>} Null or the path containg the generated pdf.
 */
export async function createPdfFromHtml(html) {
  console.info(`Creating pdf with html...`);

  const browser = await getBrowserInstance();
  if (!browser) {
    throw new Error("It was not possible to create the browser instance.");
  }

  const page = await browser.newPage();
  const id = nanoid();

  const name = `${id}.pdf`;
  const path = `${tmpDir}/${name}`;

  try {
    await page.setContent(html);

    console.info("Waiting resources to be downloaded...");
    // await page.waitForNavigation({ waitUntil: "networkidle2" });
    await page.waitForNetworkIdle();
    console.info("Html resources downloaded successfully.");

    await page.pdf({ path, format: "A4", timeout: 0, printBackground: true });
    console.info(`Pdf created at path "${path}"`);
    await page.close();
    return path;
  } catch (err) {
    await page.close();
    return null;
  }
}
