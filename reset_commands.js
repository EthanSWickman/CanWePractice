import { REST, Routes } from 'discord.js'
import secrets from './secrets.js'

const rest = new REST().setToken(secrets.DISCORD_BOT_TOKEN)

// for guild-based commands
rest.put(Routes.applicationGuildCommands(secrets.DISCORD_APP_ID, '839581698328625162'), { body: [] })
	.then(() => console.log('Successfully deleted all guild commands.'))
	.catch(console.error);


// for global commands
rest.put(Routes.applicationCommands(secrets.DISCORD_APP_ID), { body: [] })
	.then(() => console.log('Successfully deleted all guild commands.'))
	.catch(console.error);