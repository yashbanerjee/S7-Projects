import app from "./app.js";
import { env } from "./config/env.js";

app.listen(env.port, () => {
  console.log(`\n  Project S7 API running on http://localhost:${env.port}`);
  console.log(`  Environment: ${env.nodeEnv}\n`);
});
