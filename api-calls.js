const bent = require("bent");
const SECRETS = require ("./secrets.json");

var getJSON = bent("json");

const dayStrings = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const monthStrings = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

// assemble the strings here and then send them, this way we minimize api calls

// logs the current wind and basic weather conditions at EYC
exports.GetCurrentConditions = async () => {
  // fetch json response from api
  let response = await getJSON("https://api.openweathermap.org/data/2.5/onecall?lat=44.09&lon=-123.29&exclude=minutely,hourly,daily&units=imperial&appid=" + SECRETS.OPENWEATHERMAP_KEY)

  // 25200 offsets the UTC time to PST time
  let date = new Date((response.current.dt - 25200) * 1000);

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

exports.GetHourly = async (startDate, endDate) => {
  let response = await getJSON("https://api.openweathermap.org/data/2.5/onecall?lat=44.09&lon=-123.29&exclude=,daily&appid=" + SECRETS.OPENWEATHERMAP_KEY) 
  // get the data we want into a new json object
  let weatherData;
  for (let i = startHourIndex; i < endHourIndex; i++) {
    
  }
  // return the string
  return response;
}

exports.GetThirdHourly = async (startDate, endDate) => {
}

exports.GetDaily = async (date) => {
  let weather = {};
  return weather;
}