const bent = require("bent");
const SECRETS = require ("./secrets.json");

var getJSON = bent("json");

// assemble the strings here and then send them, this way we minimize api calls

exports.GetCurrentConditions = async () => {
  let response = await getJSON("https://api.openweathermap.org/data/2.5/onecall?lat=44.09&lon=-123.29&exclude=minute,daily,alerts&appid=" + SECRETS.OPENWEATHERMAP_KEY)

  let weatherData = [];
  let currDate = new Date;

  let currWeather = {
    "temp": Math.round((response.current.temp-273.15) * (9/5) + 32), 

  }; 

  console.log(currWeather.temp)



  for (let i = 0; i < 5; i++) {
    let temp = 0;
  }

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