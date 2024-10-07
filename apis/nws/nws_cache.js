import bent from 'bent'
import config from '../../db/config.js'
import { ConvertSpeed, ConvertTemperature } from './../../util/unit_converter.js'
const header = {'User-Agent': 'canwepractice (esw@halfangle.com)'}
const getNWS = bent('GET', header)

// todo -- invalidate all caches if configuration has been updated (maybe just if lon/lat has been updated)
// todo -- add error handling, maybe a try/catch for refresh routes
export class Cache {
    #data 
    #error = null
    #cacheExpireTime = 0
    #dataPromise = null
    #cacheTime = 0
    #ttl = 1000 * 60  

    constructor() {}

    get data() {
        return this.#data
    }

    // refresh cache
    async refresh() {
        // refuse to refresh if up to date
        if (this.#cacheTime + this.#ttl > Date.now() && this.#cacheExpireTime > Date.now())
            return await this.#data

        this.#cacheTime = Date.now()

        // refresh data
        if (this.#dataPromise == null) {
            this.#dataPromise = this.refreshData().then((res) => {
                this.#dataPromise = null
                this.#data = res.data
                this.#cacheExpireTime = res.expiration
                this.#error = res.error
            })
        }

        await this.#dataPromise
    }
}

export class StationCache extends Cache {
    #pointsCache = null

    constructor(pointsCache) {
        super()
        this.#pointsCache = pointsCache
    }

    async refreshData() {
        await this.#pointsCache.refresh()

        const apiResponse = await getNWS(this.#pointsCache.data.stations)

        let data = null
        let expiration = null
        let error = null

        // report error
        if (apiResponse.status != 200) 
            error = apiResponse.json.detail 

        // parse response
        else {
            expiration = apiResponse.headers.expires

            const jsonResponse = await apiResponse.json()
            data = {
                id: jsonResponse.features[0].properties.stationIdentifier,
                lat: jsonResponse.features[0].geometry.coordinates[1],
                lon: jsonResponse.features[0].geometry.coordinates[0],
            }
        }

        // return data, expiration, and error 
        return { data: data, expiration, expiration, error: error }
    }

}

export class PointsCache extends Cache {
    constructor() {
        super('points')
    }

    async refreshData() {
        const apiResponse = await getNWS(`https://api.weather.gov/points/${config.location.lat}%2C${config.location.lon}`)

        let data = null
        let expiration = null
        let error = null

        // report error
        if (apiResponse.status != 200)
            error = apiResponse.json.detail 

        // parse response
        else {
            expiration = apiResponse.headers.expires

            const jsonResponse = await apiResponse.json()
            data = {
                dailyForecast: jsonResponse.properties.forecast,
                hourlyForecast: jsonResponse.properties.forecastHourly,
                stations: jsonResponse.properties.observationStations,
            }
        }

        // return data, expiration, and error 
        return { data: data, expiration, expiration, error: error }
    }
}

export class CurrentCache extends Cache {
    #stationCache = null 

    constructor(stationCache) {
        super()
        this.#stationCache = stationCache
    }

    async refreshData() { 
        await this.#stationCache.refresh()

        const apiResponse = await getNWS(`https://api.weather.gov/stations/${this.#stationCache.data.id}/observations/latest`)

        let data = null 
        let expiration = null 
        let error = null

        // report error
        if (apiResponse.status != 200) {
            error = apiResponse.json.detail 
        }
        // parse response
        else {
            expiration = apiResponse.headers.expires 
            let jsonResponse = await apiResponse.json()
            data = {
                wind: {
                    speed: ConvertSpeed('kmph', config.units.speed, jsonResponse.properties.windSpeed.value),
                    direction: jsonResponse.properties.windDirection.value
                },
                temperature: ConvertTemperature('celsius', config.units.temperature, jsonResponse.properties.temperature.value),
                description: jsonResponse.properties.textDescription,
                icon: jsonResponse.properties.icon,
                observationTime: new Date(jsonResponse.properties.timestamp),
                station: {
                    id: this.#stationCache.data.id,
                    lat: this.#stationCache.data.lat,
                    lon: this.#stationCache.data.lon,
                },
            } 
        }

        return { data: data, expiration, expiration, error: error }
    }
}

export class DailyCache extends Cache {
    #pointsCache = null 

    constructor(pointsCache) {
        super('daily')
        this.#pointsCache = pointsCache
    }

    async refreshData() { 
        await this.#pointsCache.refresh()

        const apiResponse = await getNWS(this.#pointsCache.data.dailyForecast)

        let data = null 
        let expiration = null 
        let error = null

        // report error
        if (apiResponse.status != 200) 
            error = apiResponse.json.detail 

        // parse response
        else {
            expiration = apiResponse.headers.expires 

            const parsePeriod = async (p) => {
                return {
                    name: p.name,
                    startTime: p.startTime,
                    endTime: p.endTime,
                    description: p.shortForecast,
                    icon: p.icon,
                    temperature: ConvertTemperature('fahrenheit', config.units.temperature, p.temperature),
                    precipitation: p.probabilityOfPrecipitation.value,
                    wind: {
                        speed: ConvertSpeed('mph', config.units.speed, p.windSpeed.match(/^\d*(.\d+)?/)[0]),
                        direction: p.windDirection
                    }
                }
            }

            let jsonResponse = await apiResponse.json()
            data = {
                periods: await Promise.all(jsonResponse.properties.periods.map(parsePeriod)) 
            } 
        }

        return { data: data, expiration, expiration, error: error }
    }
}

export class HourlyCache extends Cache {
    #pointsCache = null 

    constructor(pointsCache) {
        super()
        this.#pointsCache = pointsCache
    }

    async refreshData() { 
        await this.#pointsCache.refresh()

        const apiResponse = await getNWS(this.#pointsCache.data.hourlyForecast)

        let data = null 
        let expiration = null 
        let error = null

        // report error
        if (apiResponse.status != 200) 
            error = apiResponse.json.detail 

        // parse response
        else {
            expiration = apiResponse.headers.expires 

            const parsePeriod = async (p) => {
                return {
                    startTime: p.startTime,
                    endTime: p.endTime,
                    description: p.shortForecast,
                    icon: p.icon,
                    temperature: ConvertTemperature('fahrenheit', config.units.temperature, p.temperature),
                    precipitation: p.probabilityOfPrecipitation.value,
                    wind: {
                        speed: ConvertSpeed('mph', config.units.speed, p.windSpeed.match(/^\d*(.\d+)?/)[0]),
                        direction: p.windDirection
                    }
                }
            }

            let jsonResponse = await apiResponse.json()
            data = {
                periods: await Promise.all(jsonResponse.properties.periods.map(parsePeriod)) 
            } 
        }

        return { data: data, expiration, expiration, error: error }
    }
}

export class AlertsCache extends Cache {
    constructor() {
        super('alerts')
    }

    async refreshData() {
        const apiResponse = await getNWS(`https://api.weather.gov/alerts/active?status=actual&point=${config.location.lat}%2C${config.location.lon}`)

        let data = null
        let expiration = null
        let error = null

        // report error
        if (apiResponse.status != 200)
            error = apiResponse.json.detail 

        // parse response
        else {
            expiration = apiResponse.headers.expires

            const parseAlert = (a) => {
                return {
                    type: a.properties.messageType,
                    severity: a.properties.severity,
                    description: a.properties.description,
                    startTime: a.properties.effective,
                    endTime: a.properties.expires,
                }
            }

            const jsonResponse = await apiResponse.json()
            data = await Promise.all(jsonResponse.features.map(parseAlert))
        }

        // return data, expiration, and error 
        return { data: data, expiration, expiration, error: error }
    }
}