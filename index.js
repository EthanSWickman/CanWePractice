// report missing secrets file
import { readdirSync, existsSync } from 'fs'
if (!existsSync('./secrets.js')) {
    console.log('secrets file must be present in project root, ask Ethan for his secrets')
    process.exit()
}

import secrets from './secrets.js' 

import { join } from 'path'

import { Client, Collection, Events, GatewayIntentBits } from 'discord.js'

import cron from 'cron'

import { fileURLToPath } from 'url';
import { dirname } from 'path';

import { createDbConnection, newGuild }  from './db/db.js'

await createDbConnection()

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const client = new Client({intents: [GatewayIntentBits.Guilds]});

client.on('ready', () => {
    console.log('bot started successfully')
})

client.commands = new Collection()

const foldersPath = join(__dirname, 'commands')
const commandFolders = readdirSync(foldersPath)

// collect commands
for (const folder of commandFolders) { 
    const commandsPath = join(foldersPath, folder)
    const commandFiles = readdirSync(commandsPath).filter(file => file.endsWith('.js'))

    for (const file of commandFiles) {
        const filePath = join(commandsPath, file)
        const { default: command } = await import(filePath)

        if (command && 'data' in command && 'execute' in command) {
            client.commands.set(command.data.name, command)
        } 
        else {
            console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property, or it is otherwised malformed`)
        }
    }
}

client.on(Events.GuildCreate, async guild => {
    newGuild(guild.id)
})


// respond to commands
client.on(Events.InteractionCreate, async interaction => {
    if (!interaction.isChatInputCommand()) return

    newGuild(interaction.guildId)

    const command = client.commands.get(interaction.commandName)

    if (!command) {
        console.error(`No command matching ${interaction.commandName} was found`)
        return
    }

    try {
        await command.execute(interaction)
    }
    catch (err) {
        console.log(err)
        if (interaction.replied) {
            await interaction.followUp({content: 'There was an error while executing this command!', ephemeral: true})
        }
        else {
            await interaction.reply({content: 'There was an error while executing this command!', ephemeral: true})
        }
    }
})

client.login(secrets.DISCORD_BOT_TOKEN)