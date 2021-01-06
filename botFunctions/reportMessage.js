import Telegraf from "telegraf";
const bot = new Telegraf(process.env.TELEGRAM_TOKEN);

export const reportMessage = async (ctx) => {
  const startMessage = `<pre><b>ДАННЫЕ О ПРОБЛЕМЕ:</b></pre>
       <pre>Тип проблемы: ${
         ctx.wizard.state.type ? ctx.wizard.state.type : "✘"
       }</pre>
       <pre>Проблема: ${
         ctx.wizard.state.problem ? ctx.wizard.state.problem : "✘"
       }</pre>
       <pre>Дата: ${ctx.wizard.state.date ? "✔" : "✘"}</pre>
       <pre>Геолокация: ${ctx.wizard.state.location ? "✔" : "✘"}</pre>
       <pre>Фото: ${ctx.wizard.state.image ? "✔" : "✘"}</pre>
       <pre>Комментарий: ${
         ctx.wizard.state.userComment ? ctx.wizard.state.userComment : "✘"
       }</pre>
       
       `;

   await bot.telegram
    .sendMessage(ctx.chat.id, startMessage, { parse_mode: "HTML" })
    .then(({ message_id }) => {
      ctx.wizard.state.userMessages.push(message_id);
    });
};
