// reports presence of secrets file
const fs = require("fs");
if (!fs.existsSync("./secrets.json")) {
  console.log("secrets file is not present, ask Ethan for his secrets")
  process.exit()
}

// script to access api calls
const apiCall = require("./api-calls.js");
const Discord = require("discord.js");
const bot = new Discord.Client({intents: [Discord.GatewayIntentBits.Guilds]});
const SECRETS = require("./secrets.json")

const cron = require("cron");

bot.on("ready", () => {
  console.log("bot is ready")
})

// TODO
// change to comma seperated days of week for practices at some point
let practiceDaysDelimited = "3,4,6,7"

bot.once("ready", () => {
  new cron.CronJob("00 00 * * " + practiceDaysDelimited, async () => {
    let channel = bot.channels.cache.get("1020471338294595635")
    channel.send(await apiCall.GetTodaysWeather())
    console.log('sending today\'s report')
  }).start()
  new cron.CronJob("00 00 * * 1", async () => {
    let channel = bot.channels.cache.get("1020471338294595635")
    channel.send(await apiCall.GetNextPractices())
    console.log('sending weekly report')
  })
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

apiCall.GetNextPractices()