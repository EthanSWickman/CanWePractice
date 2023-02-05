// api call library
const bent = require("bent");

// file that contains secrets like the API key
const SECRETS = require ("./secrets.json");

// json request method
var getJSON = bent("json");

// convert from integer to day/month 
const dayStrings = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const monthStrings = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

// current practice times, could be moved to a config file later 
// format: [[dayIndex, startTime24Hr, endTime24Hr],[1, 1200, 1600],...]
// MUST BE ARRANGED IN ASCENDING ORDER, ONLY ONE PRACTICE PER DAY (PROBABLY)
const practiceTimes = [[3, 16, 20], [4, 16, 20], [6, 10, 16]];

// assemble the strings here and then send them, this way we minimize api calls

// logs the current wind and basic weather conditions at EYC
exports.GetCurrentConditions = async () => {
  // fetch json response from api
  let response = await getJSON("https://api.openweathermap.org/data/2.5/onecall?lat=44.09&lon=-123.29&exclude=minutely,hourly,daily&units=imperial&appid=" + SECRETS.OPENWEATHERMAP_KEY)

  // make a javascript date from response data
  let date = new Date((response.current.dt) * 1000);

  // fill out weather alert descriptions if they exist
  let alertString = ``;
  if (response.alerts) {
    response.alerts.forEach(alert => {
      alertString += `\n  WEATHER ALERT: ${alert.event}`
    });
  }

  // assemble string
  let currentConditionsString = `
-- ${dayStrings[date.getDay()]}, ${monthStrings[date.getMonth()]} ${date.getDate()} (CURRENT CONDITIONS) -- ${alertString}
${date.toLocaleTimeString([], {hourCycle: "h23", hour: "2-digit", minute: "2-digit"})}: ${MphToKnots(response.current.wind_speed)} knot winds, ${response.current.temp}° F, ${response.current.weather[0].description}  
-------------------------------------------------------------------
  `

  return currentConditionsString;
}

// TODO
// finish this function
// returns multiline string for weather at practices within the next week
exports.GetNextPractices = async () => {
  // good through 5 days
  let triHourlyData = (await getJSON("https://api.openweathermap.org/data/2.5/forecast?lat=44.09&lon=-123.29&units=imperial&appid=" + SECRETS.OPENWEATHERMAP_KEY)).list
  // good through 48 hours
  let hourlyData = await getJSON("https://api.openweathermap.org/data/2.5/onecall?lat=44.09&lon=-123.29&exclude=minutely&units=imperial&appid=" + SECRETS.OPENWEATHERMAP_KEY)
  // good through 10 days
  let dailyData = hourlyData.daily
  hourlyData = hourlyData.hourly

  let practiceHoursFromNow = []

  let nowDay = new Date().getDay()
  let nowHour = new Date().getHours() 

  // iterate through each day in the next 7 days
  for (let i = 0; i < 7; i++) {
    // iterate through each practice to check if a practice falls on this day
    for (let j = 0; j < practiceTimes.length; j++) {
      if ((nowDay + i) % 7 == practiceTimes[j][0]) {
        // continue if practice is today, but it's already happening
        if (nowDay == practiceTimes[j][0] && nowHour >= practiceTimes[j][1]) continue
        practiceHoursFromNow.push([j, i*24 + practiceTimes[j][1] - nowHour,i*24 + practiceTimes[j][2] - nowHour])
      }
    }
  }

  console.log(practiceHoursFromNow)

  
  let hourlyStrings = []
  let triHourlyStrings = []
  let dailyStrings = []

  for (let i = 0; i < practiceHoursFromNow.length; i++) {
    if (practiceHoursFromNow[i][2] < 48) {
      hourlyStrings.push(GetHourly(practiceHoursFromNow[i][1], practiceHoursFromNow[i][2], hourlyData))
    }
    else if (practiceHoursFromNow[i][2] < 120) {
      triHourlyStrings.push(GetThirdHourly(Math.floor(practiceHoursFromNow[i][1]/3) * 3, Math.floor(practiceHoursFromNow[i][2]/3) * 3, triHourlyData))
    }
    else {
      dailyStrings.push(GetDaily(practiceHoursFromNow[i][1], dailyData))
    }
  }


  let outputString = `
  ${hourlyStrings.map(weatherString => `${weatherString}`).join('\n\n')}
  ${triHourlyStrings.map(weatherString => `${weatherString}`).join('\n\n')}
  ${dailyStrings.map(weatherString => `${weatherString}`).join('\n\n')}
  `

  console.log(outputString)
  return outputString
}

// returns today's conditions during sailable hours
// function done
exports.GetTodaysWeather = async () => {
  let response = await getJSON("https://api.openweathermap.org/data/2.5/onecall?lat=44.09&lon=-123.29&exclude=minutely,daily&units=imperial&appid=" + SECRETS.OPENWEATHERMAP_KEY)

  console.log(response.hourly[0])
  console.log("we have received data for " + response.hourly.length + " hours")

  let firstHour = new Date(response.hourly[0].dt * 1000).getHours()

  let startIndex = 0
  let endIndex = 21 - firstHour

  if (firstHour < 8) {
    startIndex = 8 - firstHour
    endIndex = 21 - firstHour
  }
  else if (firstHour > 18) {
    startIndex = 32 - firstHour
    endIndex = 45 - firstHour
  }

  let weatherStrings = [];

  for (let i = startIndex; i < endIndex; i++) {
    weatherStrings.push(
    new Date(response.hourly[i].dt * 1000).toLocaleTimeString('en-US') + "\n"
    + response.hourly[i].weather[0].description + "\n" 
    + MphToKnots(response.hourly[i].wind_speed) + " knots with "
    + MphToKnots(response.hourly[i].wind_gust) + " knot gusts"
    )
  }

  let hourlyDataString = `
${(firstHour > 18 ? `It's too late to go sailing tonight, reporting tomorrow's data\n` : ``)}Hourly Data
${weatherStrings.map(weatherString => `${weatherString}`).join('\n\n')}
`  
  return hourlyDataString; 
}

// TODO
// complete this function
exports.GetTomorrowsWeather = async () => {
  return 'not yet implemented'
}

// returns multiline string with hourly weather data in interval of two hours from now
GetHourly = (startHour, endHour, hourlyWeatherData) => {
  let date = new Date(hourlyWeatherData[startHour].dt * 1000)
  let outputStrings = []
  outputStrings.push(date.toLocaleDateString('en-US'))
  for (let i = startHour; i < endHour; i++) {
    outputStrings.push(
      date.toLocaleTimeString('en-US') + '\n'
      + hourlyWeatherData[i].weather[0].description + '\n'
      + MphToKnots(hourlyWeatherData[i].wind_speed) + " knots with "
      + MphToKnots(hourlyWeatherData[i].wind_gust) + " knot gusts"
      )
    date.setTime(date.getTime() + 60*60*1000)
  }
  let outputString = `
  ${outputStrings.map(output => `${output}`).join('\n')}
  `
  return outputString
}

// returns multiline string with tri-hourly weather data in interval of two hours from now
GetThirdHourly = (startHour, endHour, triHourlyWeatherData) => {
  console.log(triHourlyWeatherData[0])
  let outputStrings = []
  let date = new Date(triHourlyWeatherData[Math.floor(startHour / 3)].dt * 1000)
  outputStrings.push(date.toLocaleDateString('en-US'))

  for (let i = Math.floor(startHour / 3); 3*i <= endHour; i++) {
    console.log('i is: ' + i)
    outputStrings.push(
      new Date(triHourlyWeatherData[i].dt * 1000).toLocaleTimeString('en-US') + '\n'
      + triHourlyWeatherData[i].weather[0].description + '\n'
      + MphToKnots(triHourlyWeatherData[i].wind.speed) + " knots with "
      + MphToKnots(triHourlyWeatherData[i].wind.gust) + " knot gusts"
    ) 
  }

  let outputString = `
  ${outputStrings.map(output => `${output}`).join('\n')}
  `
  return outputString
}

// returns multiline string for daily data 
GetDaily = (hoursFromNow, weatherData) => {
  let dayIndex = Math.floor(hoursFromNow / 24)
  let date = new Date()
  date.setTime(date.getTime() + dayIndex*24*60*60*1000)
  let outputString = date.toLocaleDateString('en-US') + '\n'
  + weatherData[dayIndex].weather[0].description + '\n'
  + weatherData[dayIndex].temp.day + " degrees, " + MphToKnots(weatherData[dayIndex].wind_speed) + " knots with " + MphToKnots(weatherData[dayIndex].wind_gust) + " knot gusts"
  return outputString
}

MphToKnots = (mph) => {
  return Math.round(mph * 100) / 100
}