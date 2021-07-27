export const initWelcome = (bot) => {
  const firstMessageTime = {};

  bot.registerHandler({
    handler: ({say, context: {badges: {broadcaster}, username}}) => {
      // 방장은 반응 안해주기ㅋㅋ
      if (broadcaster === '1') {
        return;
      }

      if (!firstMessageTime[username]) {
        say("Welcome!!! to zhuny's stream!");
        firstMessageTime[username] = new Date();
        console.log(`New user chat: '${username}'`)
      }
    }
  })

  bot.registerCommand({
    name: 'help',
    handler: ({say}) => {
      say(
        Object.values(bot.handlerMap).filter(({doc}) => {
          return doc;
        }).map(({name, doc}) => {
          return `!${name} : ${doc}`;
        }).join(', ')
      );
    },
    doc: 'show this message'
  });
};
