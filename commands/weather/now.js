import config from '../../db/config.js'
import { EmbedBuilder, SlashCommandBuilder } from 'discord.js'
import GetWeatherData from '../../apis/nws/nws.js'
import { ConvertDirection } from '../../util/unit_converter.js'
import { CalculateDistance } from '../../util/distance_calc.js'

// todo -- add arrow for wind direction
function CurrentWeatherDataEmbed(data, alerts) {
    const roundedTemp = Math.round(data.temperature)
    const roundedWindSpeed = Math.round(data.wind.speed * 10) / 10
    const distanceToStation = CalculateDistance(config.location.lat, config.location.lon, data.station.lat, data.station.lon, config.units.distance)

    const currentWeatherEmbed = new EmbedBuilder()
	.setColor('black')
	.setTitle(`Current Weather at ${config.location.name}`.toUpperCase())
	.setURL(`https://forecast.weather.gov/MapClick.php?lat=${config.location.lat}&lon=${config.location.lon}`)
	.setDescription(data.description)
    .setThumbnail(data.icon)
	.addFields(
        { name: 'Temp', value: `${roundedTemp}° F` }, // todo -- change this to adapt to temp unit config
        { name: 'Wind', value: `${ConvertDirection('degrees', 'point', data.wind.direction)} -- ${roundedWindSpeed} knots` },
	)
	.setImage(`https://images.webcamgalore.com/35385-current-webcam-Eugene-Oregon.jpg?${Date.now()}`)
    .setFooter( { text: `Data from ${data.station.id} (${Math.round(distanceToStation * 10) / 10} ${config.units.distance} from ${config.location.name})`, iconURL: 'https://www.weather.gov/images/nws/nws_logo.png' })
	.setTimestamp(data.observationTime) 

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
        const data = await GetWeatherData(['current', 'alerts'])
        await interaction.reply({ embeds: CurrentWeatherDataEmbed(data.current, data.alerts) })
    },
}