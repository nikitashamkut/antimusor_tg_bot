export const deletePreviousBotMessages = (ctx) => {
  if (ctx.wizard.state.userMessages.length != 0) {
    ctx.wizard.state.userMessages.map((msg) => {
      ctx.deleteMessage(msg);
    });
    ctx.wizard.state.userMessages.length = 0;
  }
};
