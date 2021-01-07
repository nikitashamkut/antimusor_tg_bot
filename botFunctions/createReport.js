import dotenv from "dotenv";
import colors from "colors";
import reportModel from "../model/reportModel.js";

dotenv.config();

export const createReport = async function (data) {
  try {
    const report = new reportModel(data);
    await report.save();
  } catch (error) {
    console.error(`${error}`.red.inverse);
    throw new Error();
  }
};
