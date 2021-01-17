import Telegraf from "telegraf";
const { Extra } = Telegraf;
import WizardScene from "telegraf/scenes/wizard/index.js";
import { botMenu } from "./botMenu.js";
import { createReport } from "./createReport.js";
import { reportMessage } from "./reportMessage.js";
import { getFileId } from "./getFileId.js";
import { getLocation } from "./getLocation.js";
import { deletePreviousBotMessages } from "./deletePreviousBotMessages.js";
import { reportData } from "./botData.js";
import { getBotAnswers } from "./getBotAnswers.js";
import { getPath } from "./getPath.js";
import fetch from "node-fetch";

const bot = new Telegraf(process.env.TELEGRAM_TOKEN);

export const reportScene = new WizardScene(
  reportData.reportTrigger,
  (ctx) => {
    // First question

    ctx.wizard.state.userMessages = [];

    reportMessage(ctx).then(() => {
      bot.telegram
        .sendMessage(ctx.chat.id, reportData.types.question, {
          reply_markup: {
            keyboard: [...getBotAnswers(reportData.types.answers, 2)],
            force_reply: true,
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
      case reportData.types.typeOne.title:
        reportMessage(ctx).then(() => {
          bot.telegram
            .sendMessage(ctx.chat.id, reportData.types.typeOne.question, {
              reply_markup: {
                keyboard: [...getBotAnswers(reportData.types.typeOne.answers)],
              },
            })
            .then(({ message_id }) => {
              ctx.wizard.state.userMessages.push(message_id);
            });
        });

        return ctx.wizard.next(ctx.chat);

      case reportData.types.typeTwo.title:
        reportMessage(ctx).then(() => {
          bot.telegram
            .sendMessage(ctx.chat.id, reportData.types.typeTwo.question, {
              reply_markup: {
                keyboard: [...getBotAnswers(reportData.types.typeTwo.answers)],
              },
            })
            .then(({ message_id }) => {
              ctx.wizard.state.userMessages.push(message_id);
            });
        });

        return ctx.wizard.next(ctx.chat);

      case reportData.types.typeThree.title:
        reportMessage(ctx).then(() => {
          bot.telegram
            .sendMessage(ctx.chat.id, reportData.types.typeThree.question, {
              reply_markup: {
                keyboard: [
                  ...getBotAnswers(reportData.types.typeThree.answers),
                ],
              },
            })
            .then(({ message_id }) => {
              ctx.wizard.state.userMessages.push(message_id);
            });
        });

        return ctx.wizard.next(ctx.chat);

      case reportData.types.typeFour.title:
        reportMessage(ctx).then(() => {
          bot.telegram
            .sendMessage(ctx.chat.id, reportData.types.typeFour.question, {
              reply_markup: {
                keyboard: [...getBotAnswers(reportData.types.typeFour.answers)],
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
            keyboard: [...getBotAnswers(reportData.date.answers, 2)],
          },
        })
        .then(({ message_id }) => {
          ctx.wizard.state.userMessages.push(message_id);
        });
    });

    return ctx.wizard.next();
  },

  (ctx) => {
    // Fourth question

    let date = new Date();
    switch (ctx.message.text) {
      case reportData.date.answers[0]:
        ctx.wizard.state.date = date.toString();
        break;
      case reportData.date.answers[1]:
        date.setDate(date.getDate() - 1);
        ctx.wizard.state.date = date.toString();
        break;
      case reportData.date.answers[2]:
        date.setDate(date.getDate() - 7);
        ctx.wizard.state.date = date.toString();
        break;
      case reportData.date.answers[3]:
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
              .keyboard([
                markup.locationRequestButton(reportData.location.answers[0]),
              ]);
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
            keyboard: [...getBotAnswers(reportData.photo.answers)],
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

    ctx.wizard.state.photo = { id: null, path: null };
    ctx.wizard.state.photo.id = getFileId(ctx.message, ctx.updateSubTypes[0]);
    ctx.replyWithPhoto(ctx.wizard.state.photo.id);
    getPath(ctx.wizard.state.photo.id, ctx);

    deletePreviousBotMessages(ctx);
    ctx.deleteMessage();

    reportMessage(ctx).then(() => {
      bot.telegram
        .sendMessage(ctx.chat.id, reportData.comment.question, {
          reply_markup: {
            keyboard: [...getBotAnswers(reportData.comment.answers)],
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

    reportMessage(ctx)
      .then(createReport(ctx.wizard.state))
      .then(() => ctx.reply(reportData.finalText))
      .catch(() => ctx.reply(reportData.errorText));

    return ctx.scene.leave().then(botMenu(ctx));
  }
);
