// todo -- add options for each configuration, e.g. knots, mph, kmph for speed units
export default {
    days: [1, 3, 5],
    timezone: 'PDT',
    location: {
        lat: 44.1132,
        lon: -123.3039,
        name: 'Fern Ridge'
    },
    units: {
        speed: 'knots', 
        distance: 'miles',
        temperature: 'fahrenheit',
    },
    ttl: { // when to refresh each weather data cache 
        forecast: 1000 * 60 * 30,
        hourly: 1000 * 60 * 5,
        alerts: 1000 * 60 * 10,
        current: 1000 * 60 * 1
    },
    nearest_station: 'KEUG'
}