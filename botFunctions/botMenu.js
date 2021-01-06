import Telegraf from "telegraf";
const bot = new Telegraf(process.env.TELEGRAM_TOKEN);

export const botMenu = (ctx) => {
  bot.telegram.sendMessage(ctx.chat.id, "Антимусор Бот", {
    reply_markup: {
      keyboard: [
        [
          {
            text: "Информировать о проблеме в городе",
          },
        ],
        [{ text: "Как пользоваться ботом" }],
      ],

      one_time_keyboard: true,
    },
  });
};
