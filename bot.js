import colors from "colors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import Telegraf from "telegraf";
import session from "telegraf/session.js";
import Stage from "telegraf/stage.js";
import WizardScene from "telegraf/scenes/wizard/index.js";
import { createReport } from "./seeder.js";
import reportModel from "./model/reportModel.js";
import { botMenu } from "./botFunctions/botMenu.js";
import { reportScene } from "./botFunctions/botReport.js";
import { reportData, menuData, helpData } from "./botFunctions/botData.js";

export const telegramBot = async () => {
  const bot = new Telegraf(process.env.TELEGRAM_TOKEN);

  bot.command(menuData.startCommands, (ctx) => {
    ctx.deleteMessage();
    botMenu(ctx);
  });

  const stage = new Stage();
  stage.register(reportScene);
  bot.use(session());
  bot.use(stage.middleware());

  bot.hears(menuData.help, (ctx) => {
    ctx.deleteMessage();
    ctx.reply(helpData.helpText).then(() => botMenu(ctx));
  });

  bot.hears(menuData.report, (ctx) => {
    ctx.deleteMessage();
    ctx.scene.enter(reportData.reportTrigger);
  });

  bot.command(reportData.reportTrigger, (ctx) => {
    ctx.deleteMessage();
    ctx.scene.enter(reportData.reportTrigger);
  });

  bot.help((ctx) => {
    ctx.deleteMessage();
    ctx.reply(helpData.helpText).then(() => botMenu(ctx));
  });

  bot.launch();
};
