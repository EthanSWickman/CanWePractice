import secrets from '../secrets.js'
import config from '../db/config.js'
import bent from 'bent'

// forecast caches
const currentObj = { data: null, cacheTime: null, ttl: config.ttl.current }
const forecastObj = { data: null, cacheTime: null, ttl: config.ttl.forecast }
const hourlyForecastObj = { data: null, cacheTime: null, ttl: config.ttl.hourly }
const alertsObj = { data: null, cacheTime: null, ttl: config.ttl.alerts }

function validateCachedObj(obj) {
    if (obj.data == null || Date.now() - obj.cacheTime > obj.ttl) {
        return False
    }
    return True
}

export default async function GetWeatherData() {
    const header = {
        'User-Agent': 'canwepractice (esw@halfangle.com)',
    }

    const getNWSJson = bent('GET', 'json', header)

    const points = await getNWSJson(`https://api.weather.gov/points/${config.location.lat}%2C${config.location.lon}`)
    const forecast = await getNWSJson(points.properties.forecast)
    const hourlyForecast = await getNWSJson(points.properties.hourlyForecast)
    const alerts = await getNWSJson(`https://api.weather.gov/alerts/active?status=actual&point=${location.config.lat}%2C${config.location.lon}&urgency=Expected,Future,Unknown&limit=500`)

    // would like to find gusts (worst case we can get current gusts via observation stations route)

    return true
}

GetWeatherData()