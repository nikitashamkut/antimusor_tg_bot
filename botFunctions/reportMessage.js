import Telegraf from "telegraf";
import { reportMessageData as text } from "./botData.js";

const bot = new Telegraf(process.env.TELEGRAM_TOKEN);

export const reportMessage = async (ctx) => {
  const startMessage = `<pre><b>${text.title}</b></pre>
       <pre>${text.typeOfProblem}${
    ctx.wizard.state.type ? ctx.wizard.state.type : text.emptySign
  }</pre>
       <pre>${text.problem}${
    ctx.wizard.state.problem ? ctx.wizard.state.problem : text.emptySign
  }</pre>
       <pre>${text.date}${
    ctx.wizard.state.date ? text.filledSign : text.emptySign
  }</pre>
       <pre>${text.location}${
    ctx.wizard.state.location ? text.filledSign : text.emptySign
  }</pre>
       <pre>${text.photo}${
    ctx.wizard.state.photo ? text.filledSign : text.emptySign
  }</pre>
       <pre>${text.comment}${
    ctx.wizard.state.userComment ? ctx.wizard.state.userComment : text.emptySign
  }</pre>
       
       `;

  await bot.telegram
    .sendMessage(ctx.chat.id, startMessage, { parse_mode: "HTML" })
    .then(({ message_id }) => {
      ctx.wizard.state.userMessages.push(message_id);
    });
};
