export default {
    days: [1, 3, 5],
    location: {
        lat: 44.1132,
        lon: -123.3039,
        name: 'Fern Ridge'
    },
    units: 'imperial', // only metric or imperial
    ttl: { // when to refresh each weather data cache 
        forecast: 1000 * 60 * 30,
        hourly: 1000 * 60 * 5,
        alerts: 1000 * 60 * 10,
        current: 1000 * 60 * 1
    },
    nearest_station: 'KEUG'
}