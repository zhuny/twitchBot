export const initWelcome = (bot) => {
  const firstMessageTime = {};

  bot.registerHandler({
    handler: ({say, context: {badges: {broadcaster}, username}}) => {
      if (!firstMessageTime[username]) {
        say("Welcome!!! to zhuny's stream!");
        firstMessageTime[username] = new Date();
        console.log(`New user chat: '${username}'`)
      }
    }
  })
};
