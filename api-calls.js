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
${date.toLocaleTimeString([], {hourCycle: "h23", hour: "2-digit", minute: "2-digit"})}: ${response.current.wind_speed} mph winds, ${response.current.temp}° F, ${response.current.weather[0].description}  
-------------------------------------------------------------------
  `

  return currentConditionsString;
}

// returns multiline string for weather at practices within the next week
exports.GetNextPractices = async () => {
  let dateCursor = new Date();
  let practicesOutput = 0;
  // check for practice today
  for (let i = 0; i < practiceTimes.length; i++) {
    if (dateCursor.getDay() === practiceTimes[i][0]) {
      if (dateCursor.getHours() < practiceTimes[i][1]) {
        // add the following line to the return string
        // GetHourly(new Date().setHours(practiceTimes[i][1]), new Date().setHours(practiceTimes[i][2]))
        practicesOutput++;
      }
    }
  }
  // check for practices that are not today
  while (practicesOutput < practiceTimes.length) {
    for (let i = 0; i < practiceTimes.length; i++) {
      // check if the 
      if (dateCursor.getDay() === practiceTimes[i][0]) {
        // add the following line to the return string later
      }
    }
    practicesOutput++;
  }

}

// TODO
// complete this function
exports.GetTodaysWeather = async () => {
  let response = await getJSON("https://api.openweathermap.org/data/2.5/onecall?lat=44.09&lon=-123.29&exclude=minutely,daily&units=imperial&appid=" + SECRETS.OPENWEATHERMAP_KEY)

  console.log(response.hourly[0])

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

  while (startIndex < endIndex) {
    console.log(new Date(response.hourly[startIndex].dt * 1000).toDateString())
    startIndex++
  }

  let hourlyDataString = `
${(firstHour > 18 ? `It is late so I'll give you tomorrow's weather instead \n` : ``)}hourly data
  `  

  console.log(hourlyDataString)

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
