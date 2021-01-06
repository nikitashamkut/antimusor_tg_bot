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

export const telegramBot = async () => {
  const bot = new Telegraf(process.env.TELEGRAM_TOKEN);

  bot.command(["start", "menu", "exit", "again", "restart"], (ctx) => {
    ctx.deleteMessage();
    botMenu(ctx);
  });

  const stage = new Stage();
  stage.register(reportScene);
  bot.use(session());
  bot.use(stage.middleware());

  bot.hears("Как пользоваться ботом", (ctx) => {
    ctx.deleteMessage();
    ctx
      .reply(
        `Для использования бота:
    1. Выберите в меню "Информировать о проблеме в городе"
    2. Введите требуемые Данные
    3. Прикрепите фото и гео данные проблемы.
    `
      )
      .then(()=>botMenu(ctx));
  });

  bot.hears("Информировать о проблеме в городе", (ctx) => {
    ctx.deleteMessage();
    ctx.scene.enter("report");
  });

  bot.launch();
};
