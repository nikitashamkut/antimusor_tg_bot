// Dependencies
import colors from "colors";
import { telegramBot } from "./bot.js";
import dotenv from "dotenv";
import connectDB from "./config/db.js";

dotenv.config();

connectDB();

telegramBot();
