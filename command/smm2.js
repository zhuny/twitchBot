const userRegisterLevel = [];

const isValidLevelCode = (levelCode) => {
  return (
      (typeof levelCode === 'string')
      && levelCode.match(/^[0-9A-Z]{3}-[0-9A-Z]{3}-[0-9A-Z]{3}$/i)  // FIXME: 'IOZ' are invalid alphabet for level code
  );
};

export const initSMM2 = (commandMap) => {
  /*
   * !add level-code command
   */
  commandMap.add = ({say, context: {username}, args: [levelCode]}) => {
    // Level Code 확인하기
    if (!isValidLevelCode(levelCode)) {
      say(`@${username}, Incorrect level code. Use !add {level-code}`);
      return;
    }

    // 이전에 코드를 등록한 적 있는지 확인하기
    const registerLevel = userRegisterLevel.find((m) => m.username === username);
    if (registerLevel !== undefined) {
      say(`@${username}, You already added ${registerLevel.levelCode}`);
      return;
    }

    // 맵 코드 등록하기
    levelCode = levelCode.toUpperCase();
    userRegisterLevel.push({username, levelCode});
    say(`@${username}, Thx for adding. Your level code : ${levelCode}`);
  };

  commandMap.remove = ({say, context: {username}, args: [levelCode]}) => {
    const registerLevelIndex = userRegisterLevel.findIndex((m) => m.username === username);
    if (registerLevelIndex === -1) {
      say(`@${username}, You didn't registry any level.`);
    } else {
      const removedLevel = userRegisterLevel.splice(registerLevelIndex, 1)[0];
      say(`@${username}, Your level ${removedLevel.levelCode} is removed`)
    }
  };
};
