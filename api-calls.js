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
  let triHourlyData = await getJSON("https://api.openweathermap.org/data/2.5/forecast?lat=44.09&lon=-123.29&units=imperial&appid=" + SECRETS.OPENWEATHERMAP_KEY)
  let hourlyData = await getJSON("https://api.openweathermap.org/data/2.5/onecall?lat=44.09&lon=-123.29&exclude=minutely&units=imperial&appid=" + SECRETS.OPENWEATHERMAP_KEY)
  let dailyData = hourlyData.daily
  hourlyData = hourlyData.hourly

  // find the first day of practice we want to print
  let firstDayIndex = 0
  let now = new Date()
  let nowDay = now.getDay()
  let nowHour = now.getHours()
  for (let i = 0; i < practiceTimes.length; i++) {
    // ignore day if it comes before today
    if (practiceTimes[i][0] < nowDay) 
      continue
    // we found a day after ours this week
    if (practiceTimes[i][0] > nowDay) {
      firstDayIndex = i   
      break
    }
    // we have practice today, check if it already started, if not, we found our first day
    if (practiceTimes[i][1] >= new Date(response.hourly.dt * 1000).getHours())
      firstDayIndex = i
    break
  }

  let outputString = "Next Practices\n"
  for (let i = 0; i < practiceTimes.length; i++) {
    let practiceIndex = (firstDayIndex + i) % 3
    let startIndex
    let practiceLength = practiceTimes[practiceIndex][2] - practiceTimes[practiceIndex][1]
    // check if we can output hourly data
    // today = 6 and practice = 0, 
    // practice must be less than 2 ahead of us 
    // practice must not be behind us
    if ((nowDay + 2) % 7 > practiceTimes[practiceIndex][0] && true /* fix this condition */) { 
      // set start index 
      startIndex = practiceTimes[practiceIndex][1] - nowHour
      if (nowDay != practiceTimes[practiceIndex][0]) 
        startIndex +=24
      // add output weather
      outputString += new Date(hourlyData[startIndex].dt * 1000).toDateString() + "\n"
      for (let j = startIndex; j < startIndex + practiceLength; j++) {
        let time = hourlyData[j]
        outputString += 
        new Date (time.dt * 1000).toLocaleTimeString('en-US') + " " + time.temp + "degrees, " + time.weather[0].description + "\n"
        + MphToKnots(time.wind_speed) + " knots with " + MphToKnots(time.wind_gust) + " knot gusts\n"
      }
      outputString += "\n"
    }
    // output tri-hourly data
    // practice must be less than 5 ahead of us
    // practice must not be behind us
    else if ((nowDay + 5) % 7 > practiceTimes[practiceIndex][0] && true /* fix this condition */) { 
      // set start index 
      startIndex = 0
    }
    // output daily data
    else {
      // set start index 
      dayIndex = practiceTimes[practiceIndex][0] + 6 - nowDay
      let day = dailyData[dayIndex]
      outputString += 
      new Date(day.dt * 1000).toDateString() + "\n"
      + day.temp.max + " degrees max, " + day.temp.min + " degrees min\n"
      + day.weather[0].description + "\n"
      + MphToKnots(day.wind_speed) + " knots with " + MphToKnots(day.wind_gust) + " knot gusts\n"
    }
  }

  console.log(outputString)

  return outputString 
}

// returns today's conditions during sailable hours
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
  return ''
}

// returns multiline string for tri-hourly data between two dates 
GetThirdHourly = async (startDate, endDate) => {
}

// returns multiline string for daily data 
GetDaily = async (date) => {
}

MphToKnots = (mph) => {
  return Math.round(mph * 100) / 100
}