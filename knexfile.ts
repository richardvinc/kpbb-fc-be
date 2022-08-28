import dotenv from "dotenv";

dotenv.config();

module.exports = {
  client: "postgresql",
  connection: process.env.PG_DATABASE_URL,
  migrations: {
    tableName: "migrations",
    directory: "./apps/migrations",
  },
};
