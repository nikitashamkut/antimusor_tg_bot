import mongoose from "mongoose";
import dotenv from "dotenv";
import colors from "colors";
import connectDB from "./config/db.js";
import reportModel from "./model/reportModel.js";

dotenv.config();

export const createReport = async function (data) {
  const report = new reportModel(data);
  await report.save();
};
