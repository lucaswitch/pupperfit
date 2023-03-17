import express from "express";
import { URL } from "url";
import createHttpError from "http-error";
import { createPdfFromPageUrl, getConfiguration } from "./pdf.js";

/**
 * Verify is url is valid.
 * @param url
 * @returns {boolean}
 */
function getIsValidUrl(url) {
  try {
    const urlObj = new URL(url);
    return urlObj.protocol === "http:" || urlObj.protocol === "https:";
  } catch (err) {
    console.error(err);
    return false;
  }
}

/**
 * Deal with posts requests.
 * @param req
 * @param res
 * @param next
 * @param browser
 * @param targetDir
 */
async function handleOnPost(req, res, next, browser, targetDir) {
  const url = req?.query?.url?.toString();
  console.info(`Received print request with url ${url}`);
  // Validates the url.
  if (!getIsValidUrl(url)) {
    const error = new createHttpError.BadRequest(
      `The url supplied must be a valid url.`
    );
    return next(error);
  }
  try {
    const page = await browser.newPage();
    const path = await createPdfFromPageUrl(url, page, targetDir);

    page.close();
    return res.json(path);
  } catch (err) {
    const error = new createHttpError.InternalServerError(
      `A internal error has occurred.`
    );
    return next(error);
  }
}

let app,
  browser,
  targetDir = null;

/**
 * Starts http server.
 * @param port
 * @returns {*}
 */
export async function startHttpServer(port = 3001) {
  app = express({ port });
  console.info("Loading configuration...");
  const config = await getConfiguration();
  const version = await config.browser.version();
  console.info("Browser created, using " + version.toString());

  browser = config.browser;
  targetDir = config.targetDir;
  app.post("/print", async (req, res, next) => {
    return await handleOnPost(req, res, next, config.browser, config.targetDir);
  });
  app.listen(port, "localhost");
  console.info("Http server is ready");
  return app;
}

/**
 * Stops http server.
 * @param app
 */
export function stopHttpServer(app) {
  app.close();
  app = null;
  if (browser) {
    browser.close();
    browser = null;
  }
}
