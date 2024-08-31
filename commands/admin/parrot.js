import { SlashCommandBuilder, ChannelType } from 'discord.js'

export default {
    data: new SlashCommandBuilder()
        .setName('parrot')
        .setDescription('forces bot to say something in the specified channel')
        .addChannelOption(option => 
            option.setName('channel')
                .setDescription('the channel to echo into')
                .setRequired(true)
                .addChannelTypes(ChannelType.GuildText))
        .addStringOption(option => 
            option.setName('text')
                .setDescription('the text to parrot')
                .setRequired(true)),
    async execute(interaction) {
        const channel = interaction.options.getChannel('channel')
        const text = interaction.options.getString('text')

        channel.send(text)

        await interaction.reply('Parrot sent!')
    },
}