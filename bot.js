import colors from "colors";
import Telegraf from "telegraf";
import session from "telegraf/session.js";
import Stage from "telegraf/stage.js";
import WizardScene from "telegraf/scenes/wizard/index.js";
import { botMenu } from "./botFunctions/botMenu.js";
import { reportScene } from "./botFunctions/botReport.js";
import { reportData, menuData, helpData } from "./botFunctions/botData.js";
const { URL } = process.env;
const PORT = process.env.PORT || 5000;

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

  // if (process.env.NODE_ENV === "production") {
  //   bot.telegram.setWebhook(`${URL}/antimusor_bot`);
  //   bot.startWebhook(`${URL}/antimusor_bot`, null, PORT);
  // } else {
  //   bot.launch();
  // }
  //!

  if (process.env.NODE_ENV === "production") {
    bot.telegram.setWebhook(`${URL}/bot${process.env.TELEGRAM_TOKEN}`);
    bot.startWebhook(`/bot${process.env.TELEGRAM_TOKEN}`, null, PORT);
  } else {
    bot.launch();
  }

  //!
};
