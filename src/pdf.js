import path from "path";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
import { access, mkdir } from "node:fs/promises";
import puppeteer from "puppeteer";
import { v4 as uuidv4 } from "uuid";

const GENERATED_DIR = __dirname + "/../.generated";

/**
 * Cria um diretório único e retorna o caminho.
 */
async function getOrCreateGeneratedDirectory() {
  let exists = false;
  try {
    await access(GENERATED_DIR);
    exists = true;
  } catch (err) {
    exists = false;
  }

  if (!exists) {
    await mkdir(GENERATED_DIR);
  }
  return GENERATED_DIR;
}

/**
 * Obtém um arquivo com nome unico.
 * @returns {Promise<string>}
 */
async function getUniqueFileName() {
  return await uuidv4().replace(/-/g, "");
}

/**
 * Realiza print de uma página.
 * @returns {Promise<string>}
 */
export async function createPdfFromPageUrl(url, page, targetDir) {
  console.info(`Creating pdf at path "${url}"`);
  try {
    // Obter o caminho do PDF.
    const filename = await getUniqueFileName();
    console.info(`Waiting page to load... "${url}"`);
    await page.goto(url, { timeout: 0, waitUntil: "networkidle2" });
    console.info(`Page loaded "${url}"`);

    const path = `${targetDir}/${filename}.pdf`;
    await page.pdf({ path, format: "A4", timeout: 0 });
    console.info(`Pdf created at path "${path}"`);
    page.close();
    return path;
  } catch (err) {
    page.close();
    throw err;
  }
}

/**
 * Obtém a instância do browser.
 * @returns {Promise<Browser>}
 */
export async function getConfiguration() {
  return {
    browser: await puppeteer.launch(),
    targetDir: await getOrCreateGeneratedDirectory(),
  };
}
