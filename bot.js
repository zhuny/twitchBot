import {initSMM2} from "./command/smm2.js";
import tmi from 'tmi.js';
import env from "./env.js";


const bot = new (
  class BotClient {
    constructor() {
      this.handlerMap = {};
      this.client = new tmi.client({
        identity: {
          username: "zhunybot",
          password: env.BOT_API_TOKEN
        },
        channels: ["zhuny"],
      });

      // bind message
      this.client.on('message', (target, context, msg, self) => {
        if (self) { return; }

        const commandList = msg.split(' ').filter((c) => c.length > 0);

        // If the command is known, let's execute it
        if (commandList.length > 0 && commandList[0]) {
          let commandName = commandList[0];
          if (commandName.startsWith('!')) {
            commandName = commandName.substring(1, commandName.length);
            const commandFunc = this.handlerMap[commandName];
            if (typeof commandFunc?.handler === "function") {
              console.log(`* Executed '${commandFunc.name}' by ${context.username}`);
              return commandFunc.handler({
                say: (botMsg) => {
                  this.client.say(target, `@${context.username}, ${botMsg}`);
                }, context,
                args: commandList.filter((e, i) => i > 0),
              });
            } else {
              console.log(`* Unknown command '${commandName}'`)
            }
          }
        }
      });

      this.client.on('connected', (addr, port) => {
        console.log(`* Connected to ${addr}:${port}`);
      });
    }

    registerCommand({name, handler, doc}) {
      this.handlerMap[name] = {name, handler, doc};
    }

    start() {
      this.client.connect();
    }
  }
);

// init bot
initSMM2(bot);

bot.start();
