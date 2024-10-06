import secrets from '../secrets.js'
import config from '../db/config.js'
import { 
    Cache, 
    PointsCache, 
    StationCache, 
    CurrentCache, 
    DailyCache, 
    HourlyCache, 
    AlertsCache } from '../util/cache_obj.js'
import bent from 'bent'

const header = {'User-Agent': secrets.NWS_USER_AGENT}
const getNWS = bent('GET', header)

// forecast caches
const pointsCache = new PointsCache()
const stationCache = new StationCache(pointsCache)
const currentCache = new CurrentCache(stationCache)
const dailyCache = new DailyCache(pointsCache)
const hourlyCache = new HourlyCache(pointsCache)
const alertsCache = new AlertsCache()

// forecast requests to caches
const forecastDict = {
    'current': currentCache,
    'points': pointsCache,
    'daily': dailyCache,
    'hourly': hourlyCache,
    'alerts': alertsCache,
    'station': stationCache,
}

export default async function GetWeatherData(requested) {
    // refresh requested data
    refreshProms = []
    for (const req of requested) 
        refreshProms.push(forecastDict[req])
    await Promise.all(refreshProms)

    // add requested data to payload 
    const payload = {}
    for (const req of requested) 
        payload[req] = forecastDict[req].data

    // refresh queries
    /* 
    const points = await getNWS(`https://api.weather.gov/points/${config.location.lat}%2C${config.location.lon}`)
    const forecast = await getNWS(points.properties.forecast)
    const hourlyForecast = await getNWS(points.properties.hourlyForecast)
    const alerts = await getNWS(`https://api.weather.gov/alerts/active?status=actual&point=${location.config.lat}%2C${config.location.lon}&urgency=Expected,Future,Unknown&limit=500`)
    */


    return payload
}

let t = new AlertsCache(pointsCache)
await t.refresh()
const next = 0
