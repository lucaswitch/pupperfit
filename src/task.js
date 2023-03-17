import { createPdfFromPageUrl } from "./pdf.js";
import * as url from "url";

const STATUS_TASK_RUNNING = 1;
const STATUS_TASK_CANCELLED = 0;
const STATUS_TASK_DONE = 2;
const STATUS_TASK_PAUSED = 3;
const STATUS_TASK_ERROR = 4;

export class PdfJob {
  constructor(id, url, browser, targetDir) {
    this.status = STATUS_TASK_PAUSED;
    this.id = id;
    this.url = url;
    this.browser = browser;
    this.targetDir = targetDir;
  }

  /**
   * Runs tasks.
   * @returns {Promise<boolean>}
   */
  async run() {
    if (!this.status === STATUS_TASK_RUNNING) {
      return -1; // Already running.
    }

    try {
      const page = await this.browser.newPage();
      this.status = STATUS_TASK_RUNNING;
      const pdfPath = await createPdfFromPageUrl(
        this.url,
        page,
        this.targetDir
      );
      if (pdfPath) {
        this.status = STATUS_TASK_DONE;
        return pdfPath;
      }
    } catch (err) {
      this.status = STATUS_TASK_ERROR;
      console.error(
        `Task ${this.id} could not be completed, ${err.toString()}`
      );
    }

    return 0;
  }

  /**
   * Checks ifs runnning.
   * @returns {boolean}
   */
  getIsRunning() {
    return this.status === STATUS_TASK_RUNNING;
  }

  /**
   * Checks if is finished.
   */
  getIsFinished() {
    return (
      !this.getIsRunning() &&
      (this.status === STATUS_TASK_ERROR || this.status === STATUS_TASK_DONE)
    );
  }
}
