import secrets from '../../secrets.js'
import config from '../../db/config.js'
import { 
    PointsCache, 
    StationCache, 
    CurrentCache, 
    DailyCache, 
    HourlyCache, 
    AlertsCache } from './nws_cache.js'

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
    'daily': dailyCache,
    'hourly': hourlyCache,
    'alerts': alertsCache,
}

export default async function GetWeatherData(requested) {
    // refresh requested data
    const payload = await Promise.all(requested.map(req => forecastDict[req].refresh().then((r) => forecastDict[req].data)))

    let ret = {}

    for (let i = 0; i < requested.length; i++) {
        ret[requested[i]] = payload[i]
    }

    return ret 
}