import process from "node:process";
const required = ["DATABASE_URL","REDIS_URL","OPENAI_API_KEY","AUTH_SECRET"];
const missing = required.filter(k => !process.env[k]);
if (missing.length) {
  console.error("Missing env vars:", missing.join(", "));
  process.exit(1);
}
console.log("OK");
