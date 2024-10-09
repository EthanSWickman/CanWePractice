import config from '../../db/config.js'
import { EmbedBuilder, SlashCommandBuilder } from 'discord.js'
import GetWeatherData from '../../apis/nws/nws.js'
import { ConvertDirection } from '../../util/unit_converter.js'

// todo -- add arrow for wind direction
// todo -- add one or two fields for current weather and current alerts
// todo -- add an asterisk/exclamation point or small descriptor to each period if it aligns with an alert
// todo -- add better formatting 
function HourlyWeatherDataEmbed(data, alerts, hourly) {
    // skip today's hours
    let startIndex = 1  
    while (hourly[startIndex].startTime.getHours() != 0) {
        startIndex++ 
        continue
    }

    // populate fields
    let fields = []
    for (let i = startIndex; i < hourly.length; i++) {
        if (i != startIndex && hourly[i].startTime.getHours() == 0)
            break

        let time = hourly[i].startTime.toLocaleString('en-US', { hour: 'numeric', hour12: true })
        let description = hourly[i].description

        let windString = `${Math.round(hourly[i].wind.speed * 10) / 10} knots ${hourly[i].wind.direction}`
        let tempString = `${hourly[i].temperature}° F`
        let precipString = `${hourly[i].precipitation}% rain`

        fields.push({ 
            name: `${time} -- ${description}`, 
            value: `${tempString} ${windString} ${precipString}`,
        })
    }

    const currentWeatherEmbed = new EmbedBuilder()
	.setColor('black')
	.setTitle(`Tomorrow's Weather at ${config.location.name}`.toUpperCase())
	.setURL(`https://forecast.weather.gov/MapClick.php?w0=t&w3=sfcwind&w3u=0&w4=sky&w5=pop&w7=rain&w13u=0&w16u=1&AheadHour=0&Submit=Submit&FcstType=graphical&textField1=${config.location.lat}&textField2=${config.location.lon}&site=all&unit=0&dd=&bw=`)
	.addFields(fields)
    .setFooter( { text: `\u200b`, iconURL: 'https://www.weather.gov/images/nws/nws_logo.png' })
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
        .setName('weathertomorrow')
        .setDescription(`displays tomorrow's weather at the yacht club`),
    async execute(interaction) {
        const data = await GetWeatherData(['current', 'alerts', 'hourly'])
        await interaction.reply({ embeds: HourlyWeatherDataEmbed(data.current, data.alerts, data.hourly) })
    },
}