const userRegisterLevel = [];

const isValidLevelCode = (levelCode) => {
  return (
      (typeof levelCode === 'string')
      && levelCode.match(/^[0-9A-Z]{3}-[0-9A-Z]{3}-[0-9A-Z]{3}$/i)
      && ['I', 'O', 'Z'].every((char) => levelCode.toUpperCase().indexOf(char) === -1)
  );
};

export const initSMM2 = (bot) => {
  /*
   * !add level-code command
   */
  bot.registerCommand({
    name: 'add',
    handler: ({say, context: {username}, args: [levelCode]}) => {
      // Level Code 확인하기
      if (!isValidLevelCode(levelCode)) {
        say(`Incorrect level code. Use !add {level-code}`);
        return;
      }

      // 이전에 코드를 등록한 적 있는지 확인하기
      const registerLevel = userRegisterLevel.find((m) => m.username === username);
      if (registerLevel !== undefined) {
        say(`You already added ${registerLevel.levelCode}`);
        return;
      }

      // 맵 코드 등록하기
      levelCode = levelCode.toUpperCase();
      userRegisterLevel.push({username, levelCode});
      say(`Thx for adding. Your level code : ${levelCode}`);
    },
    doc: "!add xxx-xxx-xxx",
  });

  bot.registerCommand({
    name: 'remove',
    handler: ({say, context: {username}, args: [levelCode]}) => {
      const registerLevelIndex = userRegisterLevel.findIndex((m) => m.username === username);
      if (registerLevelIndex === -1) {
        say(`You didn't registry any level.`);
      } else {
        const removedLevel = userRegisterLevel.splice(registerLevelIndex, 1)[0];
        say(`Your level ${removedLevel.levelCode} is removed`);
      }
    },
    doc: "remove your level from queue",
  });

  bot.registerCommand({
    name: 'me',
    handler: ({say, context: {username}, args: [levelCode]}) => {
      const registerLevel = userRegisterLevel.map((level, index) => {
        return {level, index};
      }).find((m) => {
        return m.level.username === username;
      });
      if (registerLevel === undefined) {
        say(`You didn't registry any level.`);
      } else {
        say(`Your level is ${registerLevel.level.levelCode}. Your position is ${registerLevel.index + 1}.`);
      }
    },
    doc: "check your level in the queue",
  });

  bot.registerCommand({
    name: 'next',
    handler: ({say, context: {badges: {broadcaster}}}) => {
      // 스트리머만 사용 가능
      if (broadcaster === '1') {
        if (userRegisterLevel.length === 0) {
          say('No level code found');
        } else {
          const firstLevel = userRegisterLevel.shift();
          say(`@${firstLevel.username}, It's time to play this level! : ${firstLevel.levelCode}`);
        }
      }
    },
  });
};
