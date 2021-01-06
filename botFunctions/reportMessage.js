import Telegraf from "telegraf";
const bot = new Telegraf(process.env.TELEGRAM_TOKEN);

export const reportMessage = (ctx) => {
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
