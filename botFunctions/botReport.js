import Telegraf from "telegraf";
const { Extra } = Telegraf;
import WizardScene from "telegraf/scenes/wizard/index.js";
import { botMenu } from "./botMenu.js";
import { createReport } from "../seeder.js";
import { reportMessage } from "./reportMessage.js";
import { getFileId } from "./getFileId.js";
import { getLocation } from "./getLocation.js";
import { deletePreviousBotMessages } from "./deletePreviousBotMessages.js";
import { reportData } from "./botData.js";

const bot = new Telegraf(process.env.TELEGRAM_TOKEN);

export const reportScene = new WizardScene(
  reportData.reportTrigger,
  (ctx) => {
    // First question

    ctx.wizard.state.userMessages = [];

    reportMessage(ctx).then(() => {
      bot.telegram
        .sendMessage(ctx.chat.id, "Какого типа проблема?", {
          reply_markup: {
            keyboard: [
              [{ text: "незаконная свалка" }, { text: "мусорный контейнер" }],
              [{ text: "автотранспорт" }, { text: "деревья" }],
            ],
          },
        })
        .then(({ message_id }) => {
          ctx.wizard.state.userMessages.push(message_id);
        });
    });

    return ctx.wizard.next(ctx.chat);
  },
  (ctx) => {
    // Second question

    ctx.wizard.state.type = ctx.message.text;

    deletePreviousBotMessages(ctx);
    ctx.deleteMessage();

    switch (ctx.message.text) {
      case "незаконная свалка":
        reportMessage(ctx).then(() => {
          bot.telegram
            .sendMessage(ctx.chat.id, "Свалка отходов какого типа?", {
              reply_markup: {
                keyboard: [
                  [{ text: "строительный мусор" }],
                  [{ text: "бытовой мусор" }],
                  [{ text: "коммерческий мусор" }],
                ],
              },
            })
            .then(({ message_id }) => {
              ctx.wizard.state.userMessages.push(message_id);
            });
        });

        return ctx.wizard.next(ctx.chat);

      case "мусорный контейнер":
        reportMessage(ctx).then(() => {
          bot.telegram
            .sendMessage(ctx.chat.id, "Какая проблема с контейнером?", {
              reply_markup: {
                keyboard: [[{ text: "переполенный" }], [{ text: "сломанный" }]],
              },
            })
            .then(({ message_id }) => {
              ctx.wizard.state.userMessages.push(message_id);
            });
        });

        return ctx.wizard.next(ctx.chat);

      case "автотранспорт":
        reportMessage(ctx).then(() => {
          bot.telegram
            .sendMessage(ctx.chat.id, "Какая проблема с авто?", {
              reply_markup: {
                keyboard: [
                  [{ text: "брошенный  авто" }],
                  [{ text: "сгоревший авто" }],
                ],
              },
            })
            .then(({ message_id }) => {
              ctx.wizard.state.userMessages.push(message_id);
            });
        });

        return ctx.wizard.next(ctx.chat);

      case "деревья":
        reportMessage(ctx).then(() => {
          bot.telegram
            .sendMessage(ctx.chat.id, "Какая проблема с деревьями?", {
              reply_markup: {
                keyboard: [[{ text: "спиленные" }], [{ text: "поваленные" }]],
              },
            })
            .then(({ message_id }) => {
              ctx.wizard.state.userMessages.push(message_id);
            });
        });

        return ctx.wizard.next(ctx.chat);

      default:
        break;
    }
  },

  (ctx) => {
    // Third question

    ctx.wizard.state.problem = ctx.message.text;

    deletePreviousBotMessages(ctx);
    ctx.deleteMessage();

    reportMessage(ctx).then(() => {
      bot.telegram
        .sendMessage(ctx.chat.id, reportData.date.question, {
          reply_markup: {
            keyboard: [
              [{ text: "Сегодня" }],
              [{ text: "Вчера" }],
              [{ text: "Около недели назад" }],
              [{ text: "Около месяца назад" }],
            ],
          },
        })
        .then(({ message_id }) => {
          ctx.wizard.state.userMessages.push(message_id);
        });
    });

    return ctx.wizard.next();
  },

  (ctx) => {
    // Fourth questionh

    let date = new Date();
    switch (ctx.message.text) {
      case "Сегодня":
        ctx.wizard.state.date = date.toString();
        break;
      case "Вчера":
        date.setDate(date.getDate() - 1);
        ctx.wizard.state.date = date.toString();
        break;
      case "Около недели назад":
        date.setDate(date.getDate() - 7);
        ctx.wizard.state.date = date.toString();
        break;
      case "Около месяца назад":
        date.setDate(date.getDate() - 30);
        ctx.wizard.state.date = date.toString();
        break;

      default:
        break;
    }

    deletePreviousBotMessages(ctx);
    ctx.deleteMessage();

    reportMessage(ctx).then(() => {
      ctx
        .reply(
          reportData.location.question,
          Extra.markup((markup) => {
            return markup
              .resize()
              .keyboard([markup.locationRequestButton("Отправить геолокацию")]);
          })
        )
        .then(({ message_id }) => {
          ctx.wizard.state.userMessages.push(message_id);
        });
    });

    return ctx.wizard.next();
  },

  (ctx) => {
    // Fifth question

    getLocation(ctx.message, ctx.updateSubTypes[0]);
    ctx.wizard.state.location = ctx.message.location;

    bot.telegram.sendLocation(
      ctx.chat.id,
      ctx.message.location.latitude,
      ctx.message.location.longitude
    );

    deletePreviousBotMessages(ctx);
    ctx.deleteMessage();

    reportMessage(ctx).then(() => {
      bot.telegram
        .sendMessage(ctx.chat.id, reportData.photo.question, {
          reply_markup: {
            keyboard: [[{ text: "Далее" }]],
          },
        })
        .then(({ message_id }) => {
          ctx.wizard.state.userMessages.push(message_id);
        });
    });

    return ctx.wizard.next();
  },

  (ctx) => {
    // Sixth question

    ctx.wizard.state.photo = getFileId(ctx.message, ctx.updateSubTypes[0]);
    ctx.replyWithPhoto(ctx.wizard.state.photo);

    deletePreviousBotMessages(ctx);
    ctx.deleteMessage();

    reportMessage(ctx).then(() => {
      bot.telegram
        .sendMessage(ctx.chat.id, reportData.comment.question, {
          reply_markup: {
            keyboard: [[{ text: "Без комментариев!" }]],

            one_time_keyboard: true,
          },
        })
        .then(({ message_id }) => {
          ctx.wizard.state.userMessages.push(message_id);
        });
    });

    return ctx.wizard.next();
  },

  (ctx) => {
    // Final scene

    ctx.wizard.state.userComment = ctx.message.text;
    ctx.wizard.state.chatId = ctx.chat.id;

    deletePreviousBotMessages(ctx);
    ctx.deleteMessage();

    reportMessage(ctx).then(() => ctx.reply(reportData.finalText));

    console.log(ctx.wizard.state);

    return ctx.scene.leave().then(botMenu(ctx));
  }
);
