require("dotenv").config();

const { DB_HOST, PORT, BASE_URL, JWT_SECRET, SENDGRID_API_KEY } = process.env;

module.exports = {
  port: PORT,
  baseUrl: BASE_URL,
  dbHost: DB_HOST,
  jwtSecret: JWT_SECRET,
  sendGridApiKey: SENDGRID_API_KEY,
};
