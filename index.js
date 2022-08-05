// reports presence of secrets file
const fs = require("fs");
if (!fs.existsSync("./secrets.json")) {
  console.log("secrets file is not present, ask Ethan for his secrets")
  process.exit()
}

// script to access api calls
const apiCall = require("./api-calls.js");
const Discord = require("discord.js");
const bot = new Discord.Client({intents: [Discord.GatewayIntentBits.MessageContent]});
const SECRETS = require("./secrets.json")

bot.on("ready", () => {
  console.log("bot is ready")
})

bot.on("interactionCreate", async interaction => {
  if (!interaction.isChatInputCommand()) {
    return
  }

  const {commandName} = interaction;

  if (commandName === "weathernow") {
    await interaction.reply(await apiCall.GetCurrentConditions())
  }
})

bot.login(SECRETS.DISCORD_BOT_TOKEN)

// dirty way to test returned strings from API calls
apiCall.GetCurrentConditions().then(string => {
  console.log(string);
})






