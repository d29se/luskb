const dotenv = require("dotenv");
const loadEnv = dotenv.config();
if (loadEnv.error) {
  throw loadEnv.error;
}
const { parsed: envs } = loadEnv;

module.exports = envs;
