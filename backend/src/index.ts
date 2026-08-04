import app from "./app.js";
import { env } from "./config/env.js";
import { bootstrap } from "./bootstrap.js";

const host = process.env.HOST || "0.0.0.0";

async function main() {
  try {
    await bootstrap();
  } catch (err) {
    console.error("[fatal] bootstrap failed — API will still start for diagnostics", err);
  }

  app.listen(env.port, host, () => {
    console.log(`\n  Project S7 API listening on ${host}:${env.port}`);
    console.log(`  Environment: ${env.nodeEnv}`);
    console.log(`  Admin email: ${env.adminEmail}\n`);
  });
}

main();
