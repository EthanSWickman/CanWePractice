import config from '../../db/config.js'
import { EmbedBuilder, SlashCommandBuilder } from 'discord.js'
import GetWeatherData from '../../apis/openweathermap.js'
import MphToKnots from '../../util/util.js';


// need temp, uv index, wind speed, wind gust, wind direction, and icon
function CurrentWeatherDataEmbed(data, alerts) {
    // fix units, formatting
    data.wind_gust = Math.max(data.wind_gust, data.wind_speed)
    data.wind_gust = MphToKnots(data.wind_gust)
    data.wind_speed = MphToKnots(data.wind_speed)

    data.weather[0].description = data.weather[0].description.replace(/(^\w{1})|(\s+\w{1})/g, letter => letter.toUpperCase())

    const currentWeatherEmbed = new EmbedBuilder()
	.setColor('black')
	.setTitle(`Current Weather at ${config.location.name}`.toUpperCase())
	.setURL('https://www.windfinder.com/weatherforecast/fern_ridge_reservoir_eugene')
	.setDescription(data.weather[0].description)
    .setThumbnail(`https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`)
	.addFields(
        { name: 'Temp', value: `${data.temp}° F` },
        { name: 'Wind', value: `${data.wind_speed}-${data.wind_gust} knots` },
        { name: 'UVI', value: '5', inline: true },
	)
	.setImage(`https://images.webcamgalore.com/35385-current-webcam-Eugene-Oregon.jpg?${Date.now()}`)
	.setTimestamp()

    console.log(alerts)
    if (alerts) {
        alerts.forEach((a) => {
            currentWeatherEmbed.addFields(
                { name: `[ALERT] ${a.event}`, value: a.description }
            )
        })
    }

    return [currentWeatherEmbed]
}

export default {
    data: new SlashCommandBuilder()
        .setName('weathernow')
        .setDescription(`displays current weather at the yacht club`),
    async execute(interaction) {
        const data = await GetWeatherData(['current'])
        await interaction.reply({ embeds: CurrentWeatherDataEmbed(data.current, data.alerts) })
    },
}