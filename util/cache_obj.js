import bent from 'bent'
import config from '../db/config.js'
const header = {'User-Agent': 'canwepractice (esw@halfangle.com)'}
const getNWS = bent('GET', header)

/*

a cache should have external traits: 
    - a method to refresh
    - a method to access current data
    - a method to access status message associated with current data

a cache should have internal traits:
    - a ttl that makes sure request only happens once every so often
    - an optional data expiration date before which data is not refreshed
    - a method that calls an api if after ttl and after data expiration date and passes results to data and error message to error status trait

*/

// todo -- rework cache class after changes
// todo -- go through entire file and add catch statements
// todo -- make sure that we are getting the correct expiration times
// todo -- invalidate all caches if configuration has been updated (maybe just if lon/lat has been updated)
// todo -- get cache time from api instead of javasrcipt Date.now()
// todo -- check over each forecast once more for useful data missed
export class Cache {
    #data 
    #status = null
    #cacheTime = 0
    #ttl = 0  
    #cacheExpireTime = Infinity
    #locked = false

    constructor() {}

    get data() {
        return this.#data
    }

    get status() {
        return this.#status
    }

    // refresh cache
    async refresh() {
        // refuse to refresh if up to date
        if (this.#cacheTime + this.#ttl > Date.now() && this.#cacheExpireTime > Date.now())
            return 

        // lock the cache 
        // locked in case another request comes in during the current refresh
        while (this.#locked) {}
        this.#locked = true

        // probably makes sense to return {data: , err: , expiration: } because can't access privates in child classes
        let parsedResponse = await this.refreshData()
        this.#data = parsedResponse.data

        // unlock cache
        this.#locked = false
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
                id: jsonResponse.features[0].properties.stationIdentifier
            }
        }

        // return data, expiration, and error 
        return { data: data, expiration, expiration, error: error }
    }

}

export class PointsCache extends Cache {
    constructor() {
        super()
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
        // refresh station 
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
                    speed: jsonResponse.properties.windSpeed.value,
                    direction: jsonResponse.properties.windDirection.value
                },
                temperature: jsonResponse.properties.temperature.value,
                description: jsonResponse.properties.textDescription,
            } 
        }

        return { data: data, expiration, expiration, error: error }
    }
}

export class DailyCache extends Cache {
    #pointsCache = null 

    constructor(pointsCache) {
        super()
        this.#pointsCache = pointsCache
    }

    async refreshData() { 
        // refresh station 
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
                    temperature: p.temperature,
                    precipitation: p.probabilityOfPrecipitation.value,
                    wind: {
                        speed: p.windSpeed,
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
        // refresh station 
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
                    temperature: p.temperature,
                    precipitation: p.probabilityOfPrecipitation.value,
                    wind: {
                        speed: p.windSpeed,
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
        super()
    }
    

    async refreshData() {
        // const apiResponse = await getNWS(`https://api.weather.gov/alerts/active?status=actual&point=${config.location.lat}%2C${config.location.lon}`)
        const apiResponse = await getNWS('https://api.weather.gov/alerts/active?status=actual&message_type=alert&region=PA&limit=500')

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
            data = {
                alerts: await Promise.all(jsonResponse.features.map(parseAlert))
            }
        }

        // return data, expiration, and error 
        return { data: data, expiration, expiration, error: error }
    }
}