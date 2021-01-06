import Telegraf from "telegraf";
const { Extra } = Telegraf;
import WizardScene from "telegraf/scenes/wizard/index.js";
import { botMenu } from "./botMenu.js";

import { createReport } from "../seeder.js";

const bot = new Telegraf(process.env.TELEGRAM_TOKEN);

const reportMessage = (ctx) => {
  const startMessage = `<b>Данные о проблеме:</b>
     <pre>Тип проблемы: ${
       ctx.wizard.state.type ? ctx.wizard.state.type : ""
     }</pre>
     <pre>Проблема: ${
       ctx.wizard.state.problem ? ctx.wizard.state.problem : ""
     }</pre>
     <pre>Дата: ${ctx.wizard.state.date ? "✔" : "x"}</pre>
     <pre>Геолокация: ${ctx.wizard.state.location ? "✔" : "x"}</pre>
     <pre>Фото: ${ctx.wizard.state.image ? "✔" : "x"}</pre>
     <pre>Комментарий: ${
       ctx.wizard.state.userComment ? ctx.wizard.state.userComment : ""
     }</pre>
     
     `;

  bot.telegram
    .sendMessage(ctx.chat.id, startMessage, { parse_mode: "HTML" })
    .then(({ message_id }) => {
      ctx.wizard.state.userMessages.push(message_id);
    });
};

const getFileId = (message, type) => {
  switch (type) {
    case "photo":
      return message[type][message.photo.length - 1].file_id;
    case "document":
      return message[type].file_id;
    default:
      return false;
  }
};

const getLocation = (message, type) => {
  switch (type) {
    case "location":

    default:
      return false;
  }
};

const deletePreviousBotMessages = (ctx) => {
  if (ctx.wizard.state.userMessages.length != 0) {
    ctx.wizard.state.userMessages.map((msg) => {
      ctx.deleteMessage(msg);
    });
    ctx.wizard.state.userMessages.length = 0;
  }
};

export const reportScene = new WizardScene(
  "report",
  // First question
  (ctx) => {
    ctx.wizard.state.userMessages = [];
    reportMessage(ctx);

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

    return ctx.wizard.next(ctx.chat);
  },
  // Second question
  (ctx) => {
    ctx.wizard.state.type = ctx.message.text;
    deletePreviousBotMessages(ctx);
    ctx.deleteMessage();

    switch (ctx.message.text) {
      case "незаконная свалка":
        reportMessage(ctx);

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

        return ctx.wizard.next(ctx.chat);

      case "мусорный контейнер":
        reportMessage(ctx);

        bot.telegram
          .sendMessage(ctx.chat.id, "Какая проблема с контейнером?", {
            reply_markup: {
              keyboard: [[{ text: "переполенный" }], [{ text: "сломанный" }]],
            },
          })
          .then(({ message_id }) => {
            ctx.wizard.state.userMessages.push(message_id);
          });

        return ctx.wizard.next(ctx.chat);

      case "автотранспорт":
        reportMessage(ctx);

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

        return ctx.wizard.next(ctx.chat);

      case "деревья":
        reportMessage(ctx);

        bot.telegram
          .sendMessage(ctx.chat.id, "Какая проблема с деревьями?", {
            reply_markup: {
              keyboard: [[{ text: "спиленные" }], [{ text: "поваленные" }]],
            },
          })
          .then(({ message_id }) => {
            ctx.wizard.state.userMessages.push(message_id);
          });

        return ctx.wizard.next(ctx.chat);

      default:
        break;
    }
  },

  (ctx) => {
    // Third question

    ctx.wizard.state.problem = ctx.message.text;
    //!
    deletePreviousBotMessages(ctx);
    ctx.deleteMessage();
    //!

    reportMessage(ctx);

    bot.telegram
      .sendMessage(ctx.chat.id, "Когда примерно это произошло?", {
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
    return ctx.wizard.next();
  },

  (ctx) => {
    // Fourth question

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

    //deletePreviousBotMessages(ctx);
    ctx.deleteMessage();

    ctx
      .reply(
        "Взять геолокацию проблемы (ваше текущее местоположение)",
        Extra.markup((markup) => {
          return markup
            .resize()
            .keyboard([markup.locationRequestButton("Отправить геолокацию")]);
        })
      )
      .then(({ message_id }) => {
        ctx.wizard.state.userMessages.push(message_id);
      });

    return ctx.wizard.next();
  },
  (ctx) => {
    // Fifth question
    getLocation(ctx.message, ctx.updateSubTypes[0]);
    ctx.wizard.state.location = ctx.message.location;
    //console.log(ctx.message.location);
    bot.telegram.sendLocation(
      ctx.chat.id,
      ctx.message.location.latitude,
      ctx.message.location.longitude
    );

    reportMessage(ctx);
    ctx.deleteMessage();
    bot.telegram
      .sendMessage(ctx.chat.id, "Добавьте фото проблемы и нажмите 'Далее'", {
        reply_markup: {
          keyboard: [[{ text: "Далее" }]],
          //resize_keyboard: true,
        },
      })
      .then(({ message_id }) => {
        ctx.wizard.state.userMessages.push(message_id);
      });
    return ctx.wizard.next();
  },
  (ctx) => {
    // Sixth question
    ctx.wizard.state.photo = getFileId(ctx.message, ctx.updateSubTypes[0]);
    //ctx.wizard.state.photo=fileId
    ctx.replyWithPhoto(ctx.wizard.state.photo);
    reportMessage(ctx);
    ctx.deleteMessage();
    bot.telegram
      .sendMessage(
        ctx.chat.id,
        "Хотите оставить свой комментарий о проблеме?",
        {
          reply_markup: {
            keyboard: [[{ text: "Без комментариев!" }]],

            one_time_keyboard: true,
          },
        }
      )
      .then(({ message_id }) => {
        ctx.wizard.state.userMessages.push(message_id);
      });
    return ctx.wizard.next();
  },

  (ctx) => {
    // Final scene

    ctx.wizard.state.userComment = ctx.message.text;
    ctx.deleteMessage();
    ctx.wizard.state.chatId = ctx.chat.id;

    reportMessage(ctx);
    console.log(ctx.wizard.state);
    ctx.reply("Данные успешно переданы.\nСпасибо за Вашу гражданскую позицию!");

    return ctx.scene.leave().then(botMenu(ctx));
  }
);
