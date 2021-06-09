import {initSMM2} from "./command/smm2.js";
import tmi from 'tmi.js';


// Define configuration options
const opts = {
  identity: {
    username: "zhunyBot",
    password: "oauth:abcdefghijklmnopqrstuvwxyz",
  },
  channels: [
    "zhuny"
  ]
};

// Create a client with our options
const client = new tmi.client(opts);

const commandMap = {};

initSMM2(commandMap);

// Register our event handlers (defined below)
client.on('message', onMessageHandler);
client.on('connected', onConnectedHandler);

// Connect to Twitch:
client.connect();

// Called every time a message comes in
function onMessageHandler (target, context, msg, self) {
  if (self) { return; } // Ignore messages from the bot

  // Remove whitespace from chat message
  const commandList = msg.split(' ').filter((c) => c.length > 0);

  // If the command is known, let's execute it
  if (commandList.length > 0 && commandList[0]) {
    let commandName = commandList[0];
    if (commandName.startsWith('!')) {
      commandName = commandName.substring(1, commandName.length);
      const commandFunc = commandMap[commandName];
      if (typeof commandFunc === "function") {
        console.log(`* Executed '${commandName}'`);
        commandFunc({
          say: (botMsg) => {
            client.say(target, `@${context.username}, ${botMsg}`);
          }, context,
          args: commandList.filter((e, i) => i > 0),
        });
      } else {
        console.log(`* Unknown command '${commandName}'`)
      }
    }
  }
}

// Called every time the bot connects to Twitch chat
function onConnectedHandler (addr, port) {
  console.log(`* Connected to ${addr}:${port}`);
}
