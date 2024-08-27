import express from "express";
import createHttpError from "http-error";
import { createPdfFromHtml } from "./pdf.js";
import bodyParser from "express";

let app = null;

/**
 * Starts http server.
 * @param port
 * @returns {*}
 */
export async function startHttpServer(port = 3001) {
  const host = "0.0.0.0";
  app = express();

  app.use(bodyParser.json());
  app.use(
    bodyParser.urlencoded({
      extended: true,
    })
  );
  app.use(bodyParser.text());

  console.info("Initializing pdf http server...");

  app.post("/create-pdf", async function (req, res, next) {
    const html = req.body;
    if (typeof html === "string" && html.length > 0) {
      const pdfPath = await createPdfFromHtml(html);
      if (pdfPath) {
        return res.sendFile(pdfPath);
      }

      return next(
        new createHttpError.InternalError(
          "It was not possible to generate this pdf."
        )
      );
    }
    return next(
      new createHttpError.BadRequest(
        "Parameter html must be a string and not empty."
      )
    );
  });

  app.listen(port, host);
  console.info(`Listening on ${host}:${port}`);
  console.info("Http server is ready");
  return app;
}

/**
 * Stops http server.
 * @param app
 */
export async function stopHttpServer(app) {
  app.close();
  app = null;
}
