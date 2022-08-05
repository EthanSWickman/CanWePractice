const { SlashCommandBuilder, Routes } = require('discord.js');
const { REST } = require('@discordjs/rest');
const { DISCORD_APP_ID, DISCORD_BOT_TOKEN } = require('./secrets.json');

const commands = [
	new SlashCommandBuilder().setName('weathernow').setDescription('Reports the current weather conditions at Eugene Yacht Club'),
  new SlashCommandBuilder().setName('nextpractices').setDescription('Reports the weather conditions for our next three scheduled practices at Eugene Yacht Club'),
  new SlashCommandBuilder().setName('weathertoday').setDescription('Reports the weather conditions for the rest of today at Eugene Yacht Club'),
  new SlashCommandBuilder().setName('weathertomorrow').setDescription('Reports the weather conditions for tomorrow at Eugene Yacht Club')
]
	.map(command => command.toJSON());

const rest = new REST({ version: '10' }).setToken(DISCORD_BOT_TOKEN);

rest.put(
	Routes.applicationCommands(DISCORD_APP_ID),
	{ body: commands },
);