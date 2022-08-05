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

const cron = require("cron");
const { channelLink } = require("discord.js");

bot.on("ready", () => {
  console.log("bot is ready")
})

// TODO
// change to comma seperated days of week for practices at some point
let practiceDaysDelimited = "*"

bot.once("ready", () => {
  bot.channels.fetch("1004931421791600690")
  new cron.CronJob("00 00 00 * * " + practiceDaysDelimited,() => {
    let channel = bot.channels.cache.get("1004931421791600690")
    channel.send("THIS WILL BE THE WEATHER REPORT FOR TODAY EVENTUALLY")
    // TODO
    // send today's weather conditions over the practice period if and only if tbere is a scheduled practice today
  }).start()
})

bot.on("interactionCreate", async interaction => {
  if (!interaction.isChatInputCommand()) {
    return
  }

  const {commandName} = interaction;

  if (commandName === "weathernow") {
    await interaction.reply(await apiCall.GetCurrentConditions())
  }
  else if (commandName === "nextpractices") {
    await interaction.reply(await apiCall.GetNextPractices())
  }
  else if (commandName === "weathertoday") {
    await interaction.reply(await apiCall.GetTodaysWeather())
  }
  else if (commandName === "weathertomorrow") {
    await interaction.reply(await apiCall.GetTomorrowsWeather())
  }
})

bot.login(SECRETS.DISCORD_BOT_TOKEN)