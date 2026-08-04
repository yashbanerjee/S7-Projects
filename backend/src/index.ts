import app from "./app.js";
import { env } from "./config/env.js";

const host = process.env.HOST || "0.0.0.0";

app.listen(env.port, host, () => {
  console.log(`\n  Project S7 API listening on ${host}:${env.port}`);
  console.log(`  Environment: ${env.nodeEnv}\n`);
});
