import { startHttpServer } from "./src/index.js";

(async () => {
  try {
    await startHttpServer(3001);
  } catch (err) {
    console.error(err);
  }
})();
