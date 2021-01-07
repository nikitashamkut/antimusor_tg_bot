import Telegraf from "telegraf";
const bot = new Telegraf(process.env.TELEGRAM_TOKEN);
import { menuData } from "./botData.js";
export const botMenu = (ctx) => {
  bot.telegram.sendMessage(ctx.chat.id, menuData.greeting, {
    reply_markup: {
      keyboard: [
        [
          {
            text: menuData.report,
          },
        ],
        [{ text: menuData.help }],
      ],

      one_time_keyboard: true,
    },
  });
};
