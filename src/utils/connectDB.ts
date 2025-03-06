import { Sequelize } from "sequelize";
const { POSTGRES_PASS, POSTGRES_USER, POSTGRES_DB } = process.env;

export const sequelize = new Sequelize(`${POSTGRES_DB}`, `${POSTGRES_USER}`, `${POSTGRES_PASS}`, {
  host: "localhost",
  dialect: "postgres",
  port: 5432,
  logging: false,
});

export const connectDB = async function () {
  try {
    await sequelize.authenticate();
    console.log("Connection has been established successfully.");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
    throw error;
  }
};
