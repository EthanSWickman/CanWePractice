import secrets from '../secrets.js'
import config from '../db/config.js'
import bent from 'bent'

const getJSON = bent('json')

let cachedWeather = JSON.parse(`{
  "lat": 0,
  "lon": 0,
  "timezone": "Etc/GMT",
  "timezone_offset": 0,
  "current": {
    "dt": 1725151968,
    "sunrise": 1725170207,
    "sunset": 1725213809,
    "temp": 296.73,
    "feels_like": 297.21,
    "pressure": 1013,
    "humidity": 79,
    "dew_point": 292.88,
    "uvi": 0,
    "clouds": 3,
    "visibility": 10000,
    "wind_speed": 2.07,
    "wind_deg": 208,
    "wind_gust": 1.82,
    "weather": [
      {
        "id": 800,
        "main": "Clear",
        "description": "clear sky",
        "icon": "01n"
      }
    ]
  },
  "hourly": [
    {
      "dt": 1725148800,
      "temp": 296.76,
      "feels_like": 297.21,
      "pressure": 1013,
      "humidity": 78,
      "dew_point": 292.7,
      "uvi": 0,
      "clouds": 3,
      "visibility": 10000,
      "wind_speed": 2.12,
      "wind_deg": 209,
      "wind_gust": 1.91,
      "weather": [
        {
          "id": 800,
          "main": "Clear",
          "description": "clear sky",
          "icon": "01n"
        }
      ],
      "pop": 0
    },
    {
      "dt": 1725152400,
      "temp": 296.73,
      "feels_like": 297.21,
      "pressure": 1013,
      "humidity": 79,
      "dew_point": 292.88,
      "uvi": 0,
      "clouds": 3,
      "visibility": 10000,
      "wind_speed": 2.07,
      "wind_deg": 208,
      "wind_gust": 1.82,
      "weather": [
        {
          "id": 800,
          "main": "Clear",
          "description": "clear sky",
          "icon": "01n"
        }
      ],
      "pop": 0
    },
    {
      "dt": 1725156000,
      "temp": 296.72,
      "feels_like": 297.2,
      "pressure": 1013,
      "humidity": 79,
      "dew_point": 292.87,
      "uvi": 0,
      "clouds": 3,
      "visibility": 10000,
      "wind_speed": 2.14,
      "wind_deg": 202,
      "wind_gust": 1.91,
      "weather": [
        {
          "id": 800,
          "main": "Clear",
          "description": "clear sky",
          "icon": "01n"
        }
      ],
      "pop": 0
    },
    {
      "dt": 1725159600,
      "temp": 296.67,
      "feels_like": 297.17,
      "pressure": 1013,
      "humidity": 80,
      "dew_point": 293.02,
      "uvi": 0,
      "clouds": 5,
      "visibility": 10000,
      "wind_speed": 1.99,
      "wind_deg": 191,
      "wind_gust": 1.82,
      "weather": [
        {
          "id": 800,
          "main": "Clear",
          "description": "clear sky",
          "icon": "01n"
        }
      ],
      "pop": 0
    },
    {
      "dt": 1725163200,
      "temp": 296.59,
      "feels_like": 297.08,
      "pressure": 1013,
      "humidity": 80,
      "dew_point": 292.94,
      "uvi": 0,
      "clouds": 10,
      "visibility": 10000,
      "wind_speed": 2.08,
      "wind_deg": 181,
      "wind_gust": 1.91,
      "weather": [
        {
          "id": 800,
          "main": "Clear",
          "description": "clear sky",
          "icon": "01n"
        }
      ],
      "pop": 0
    },
    {
      "dt": 1725166800,
      "temp": 296.61,
      "feels_like": 297.13,
      "pressure": 1014,
      "humidity": 81,
      "dew_point": 293.16,
      "uvi": 0,
      "clouds": 13,
      "visibility": 10000,
      "wind_speed": 2.39,
      "wind_deg": 196,
      "wind_gust": 2.22,
      "weather": [
        {
          "id": 801,
          "main": "Clouds",
          "description": "few clouds",
          "icon": "02n"
        }
      ],
      "pop": 0
    },
    {
      "dt": 1725170400,
      "temp": 296.59,
      "feels_like": 297.1,
      "pressure": 1015,
      "humidity": 81,
      "dew_point": 293.1,
      "uvi": 0,
      "clouds": 15,
      "visibility": 10000,
      "wind_speed": 2.76,
      "wind_deg": 201,
      "wind_gust": 2.51,
      "weather": [
        {
          "id": 801,
          "main": "Clouds",
          "description": "few clouds",
          "icon": "02d"
        }
      ],
      "pop": 0
    },
    {
      "dt": 1725174000,
      "temp": 296.54,
      "feels_like": 297.05,
      "pressure": 1015,
      "humidity": 81,
      "dew_point": 293.12,
      "uvi": 0.44,
      "clouds": 62,
      "visibility": 10000,
      "wind_speed": 2.88,
      "wind_deg": 204,
      "wind_gust": 2.71,
      "weather": [
        {
          "id": 803,
          "main": "Clouds",
          "description": "broken clouds",
          "icon": "04d"
        }
      ],
      "pop": 0
    },
    {
      "dt": 1725177600,
      "temp": 296.72,
      "feels_like": 297.25,
      "pressure": 1016,
      "humidity": 81,
      "dew_point": 293.2,
      "uvi": 1.73,
      "clouds": 81,
      "visibility": 10000,
      "wind_speed": 3.28,
      "wind_deg": 199,
      "wind_gust": 3.12,
      "weather": [
        {
          "id": 803,
          "main": "Clouds",
          "description": "broken clouds",
          "icon": "04d"
        }
      ],
      "pop": 0
    },
    {
      "dt": 1725181200,
      "temp": 296.72,
      "feels_like": 297.25,
      "pressure": 1016,
      "humidity": 81,
      "dew_point": 293.3,
      "uvi": 3.1,
      "clouds": 87,
      "visibility": 10000,
      "wind_speed": 3.52,
      "wind_deg": 194,
      "wind_gust": 3.31,
      "weather": [
        {
          "id": 804,
          "main": "Clouds",
          "description": "overcast clouds",
          "icon": "04d"
        }
      ],
      "pop": 0
    },
    {
      "dt": 1725184800,
      "temp": 296.9,
      "feels_like": 297.45,
      "pressure": 1016,
      "humidity": 81,
      "dew_point": 293.4,
      "uvi": 4.7,
      "clouds": 90,
      "visibility": 10000,
      "wind_speed": 3.81,
      "wind_deg": 186,
      "wind_gust": 3.62,
      "weather": [
        {
          "id": 804,
          "main": "Clouds",
          "description": "overcast clouds",
          "icon": "04d"
        }
      ],
      "pop": 0
    },
    {
      "dt": 1725188400,
      "temp": 297,
      "feels_like": 297.53,
      "pressure": 1016,
      "humidity": 80,
      "dew_point": 293.28,
      "uvi": 5.87,
      "clouds": 92,
      "visibility": 10000,
      "wind_speed": 3.49,
      "wind_deg": 193,
      "wind_gust": 3.42,
      "weather": [
        {
          "id": 804,
          "main": "Clouds",
          "description": "overcast clouds",
          "icon": "04d"
        }
      ],
      "pop": 0
    },
    {
      "dt": 1725192000,
      "temp": 297.2,
      "feels_like": 297.7,
      "pressure": 1015,
      "humidity": 78,
      "dew_point": 293.06,
      "uvi": 7.42,
      "clouds": 94,
      "visibility": 10000,
      "wind_speed": 3.26,
      "wind_deg": 212,
      "wind_gust": 3.21,
      "weather": [
        {
          "id": 804,
          "main": "Clouds",
          "description": "overcast clouds",
          "icon": "04d"
        }
      ],
      "pop": 0
    },
    {
      "dt": 1725195600,
      "temp": 297.41,
      "feels_like": 297.88,
      "pressure": 1014,
      "humidity": 76,
      "dew_point": 292.88,
      "uvi": 6.28,
      "clouds": 100,
      "visibility": 10000,
      "wind_speed": 3.39,
      "wind_deg": 219,
      "wind_gust": 3.41,
      "weather": [
        {
          "id": 804,
          "main": "Clouds",
          "description": "overcast clouds",
          "icon": "04d"
        }
      ],
      "pop": 0
    },
    {
      "dt": 1725199200,
      "temp": 297.51,
      "feels_like": 297.93,
      "pressure": 1013,
      "humidity": 74,
      "dew_point": 292.61,
      "uvi": 5.04,
      "clouds": 100,
      "visibility": 10000,
      "wind_speed": 3.61,
      "wind_deg": 219,
      "wind_gust": 3.6,
      "weather": [
        {
          "id": 804,
          "main": "Clouds",
          "description": "overcast clouds",
          "icon": "04d"
        }
      ],
      "pop": 0
    },
    {
      "dt": 1725202800,
      "temp": 297.55,
      "feels_like": 297.98,
      "pressure": 1013,
      "humidity": 74,
      "dew_point": 292.64,
      "uvi": 3.49,
      "clouds": 89,
      "visibility": 10000,
      "wind_speed": 3.6,
      "wind_deg": 223,
      "wind_gust": 3.6,
      "weather": [
        {
          "id": 804,
          "main": "Clouds",
          "description": "overcast clouds",
          "icon": "04d"
        }
      ],
      "pop": 0
    },
    {
      "dt": 1725206400,
      "temp": 297.7,
      "feels_like": 298.14,
      "pressure": 1013,
      "humidity": 74,
      "dew_point": 292.67,
      "uvi": 1.57,
      "clouds": 78,
      "visibility": 10000,
      "wind_speed": 3.64,
      "wind_deg": 223,
      "wind_gust": 3.64,
      "weather": [
        {
          "id": 803,
          "main": "Clouds",
          "description": "broken clouds",
          "icon": "04d"
        }
      ],
      "pop": 0
    },
    {
      "dt": 1725210000,
      "temp": 297.72,
      "feels_like": 298.19,
      "pressure": 1013,
      "humidity": 75,
      "dew_point": 292.94,
      "uvi": 0.36,
      "clouds": 73,
      "visibility": 10000,
      "wind_speed": 3.6,
      "wind_deg": 232,
      "wind_gust": 3.63,
      "weather": [
        {
          "id": 803,
          "main": "Clouds",
          "description": "broken clouds",
          "icon": "04d"
        }
      ],
      "pop": 0
    },
    {
      "dt": 1725213600,
      "temp": 297.61,
      "feels_like": 298.1,
      "pressure": 1014,
      "humidity": 76,
      "dew_point": 293.11,
      "uvi": 0,
      "clouds": 62,
      "visibility": 10000,
      "wind_speed": 4.1,
      "wind_deg": 233,
      "wind_gust": 4.22,
      "weather": [
        {
          "id": 803,
          "main": "Clouds",
          "description": "broken clouds",
          "icon": "04d"
        }
      ],
      "pop": 0
    },
    {
      "dt": 1725217200,
      "temp": 297.69,
      "feels_like": 298.18,
      "pressure": 1015,
      "humidity": 76,
      "dew_point": 293.29,
      "uvi": 0,
      "clouds": 4,
      "visibility": 10000,
      "wind_speed": 4.18,
      "wind_deg": 225,
      "wind_gust": 4.42,
      "weather": [
        {
          "id": 800,
          "main": "Clear",
          "description": "clear sky",
          "icon": "01n"
        }
      ],
      "pop": 0
    },
    {
      "dt": 1725220800,
      "temp": 297.79,
      "feels_like": 298.29,
      "pressure": 1015,
      "humidity": 76,
      "dew_point": 293.27,
      "uvi": 0,
      "clouds": 33,
      "visibility": 10000,
      "wind_speed": 4.52,
      "wind_deg": 219,
      "wind_gust": 4.71,
      "weather": [
        {
          "id": 802,
          "main": "Clouds",
          "description": "scattered clouds",
          "icon": "03n"
        }
      ],
      "pop": 0
    },
    {
      "dt": 1725224400,
      "temp": 297.89,
      "feels_like": 298.38,
      "pressure": 1015,
      "humidity": 75,
      "dew_point": 293.19,
      "uvi": 0,
      "clouds": 51,
      "visibility": 10000,
      "wind_speed": 5,
      "wind_deg": 211,
      "wind_gust": 4.82,
      "weather": [
        {
          "id": 803,
          "main": "Clouds",
          "description": "broken clouds",
          "icon": "04n"
        }
      ],
      "pop": 0
    },
    {
      "dt": 1725228000,
      "temp": 297.81,
      "feels_like": 298.26,
      "pressure": 1016,
      "humidity": 74,
      "dew_point": 293.01,
      "uvi": 0,
      "clouds": 63,
      "visibility": 10000,
      "wind_speed": 4.7,
      "wind_deg": 205,
      "wind_gust": 4.62,
      "weather": [
        {
          "id": 803,
          "main": "Clouds",
          "description": "broken clouds",
          "icon": "04n"
        }
      ],
      "pop": 0
    },
    {
      "dt": 1725231600,
      "temp": 298.05,
      "feels_like": 298.53,
      "pressure": 1016,
      "humidity": 74,
      "dew_point": 293.05,
      "uvi": 0,
      "clouds": 70,
      "visibility": 10000,
      "wind_speed": 4.18,
      "wind_deg": 200,
      "wind_gust": 4.2,
      "weather": [
        {
          "id": 803,
          "main": "Clouds",
          "description": "broken clouds",
          "icon": "04n"
        }
      ],
      "pop": 0
    },
    {
      "dt": 1725235200,
      "temp": 298.24,
      "feels_like": 298.71,
      "pressure": 1015,
      "humidity": 73,
      "dew_point": 293.07,
      "uvi": 0,
      "clouds": 75,
      "visibility": 10000,
      "wind_speed": 3.96,
      "wind_deg": 199,
      "wind_gust": 4,
      "weather": [
        {
          "id": 803,
          "main": "Clouds",
          "description": "broken clouds",
          "icon": "04n"
        }
      ],
      "pop": 0
    },
    {
      "dt": 1725238800,
      "temp": 298.02,
      "feels_like": 298.44,
      "pressure": 1015,
      "humidity": 72,
      "dew_point": 292.61,
      "uvi": 0,
      "clouds": 100,
      "visibility": 10000,
      "wind_speed": 4.53,
      "wind_deg": 200,
      "wind_gust": 4.03,
      "weather": [
        {
          "id": 804,
          "main": "Clouds",
          "description": "overcast clouds",
          "icon": "04n"
        }
      ],
      "pop": 0
    },
    {
      "dt": 1725242400,
      "temp": 297.52,
      "feels_like": 297.97,
      "pressure": 1014,
      "humidity": 75,
      "dew_point": 292.81,
      "uvi": 0,
      "clouds": 100,
      "visibility": 10000,
      "wind_speed": 5.11,
      "wind_deg": 198,
      "wind_gust": 4.61,
      "weather": [
        {
          "id": 804,
          "main": "Clouds",
          "description": "overcast clouds",
          "icon": "04n"
        }
      ],
      "pop": 0
    },
    {
      "dt": 1725246000,
      "temp": 297.45,
      "feels_like": 297.89,
      "pressure": 1015,
      "humidity": 75,
      "dew_point": 292.74,
      "uvi": 0,
      "clouds": 100,
      "visibility": 10000,
      "wind_speed": 4.66,
      "wind_deg": 191,
      "wind_gust": 4,
      "weather": [
        {
          "id": 804,
          "main": "Clouds",
          "description": "overcast clouds",
          "icon": "04n"
        }
      ],
      "pop": 0
    },
    {
      "dt": 1725249600,
      "temp": 297.58,
      "feels_like": 297.93,
      "pressure": 1015,
      "humidity": 71,
      "dew_point": 292.11,
      "uvi": 0,
      "clouds": 100,
      "visibility": 10000,
      "wind_speed": 4.27,
      "wind_deg": 189,
      "wind_gust": 3.73,
      "weather": [
        {
          "id": 804,
          "main": "Clouds",
          "description": "overcast clouds",
          "icon": "04n"
        }
      ],
      "pop": 0
    },
    {
      "dt": 1725253200,
      "temp": 297.7,
      "feels_like": 298.04,
      "pressure": 1015,
      "humidity": 70,
      "dew_point": 291.9,
      "uvi": 0,
      "clouds": 99,
      "visibility": 10000,
      "wind_speed": 4.25,
      "wind_deg": 192,
      "wind_gust": 4.02,
      "weather": [
        {
          "id": 804,
          "main": "Clouds",
          "description": "overcast clouds",
          "icon": "04n"
        }
      ],
      "pop": 0
    },
    {
      "dt": 1725256800,
      "temp": 297.61,
      "feels_like": 297.97,
      "pressure": 1015,
      "humidity": 71,
      "dew_point": 292.09,
      "uvi": 0,
      "clouds": 95,
      "visibility": 10000,
      "wind_speed": 4.77,
      "wind_deg": 195,
      "wind_gust": 4.32,
      "weather": [
        {
          "id": 804,
          "main": "Clouds",
          "description": "overcast clouds",
          "icon": "04d"
        }
      ],
      "pop": 0
    },
    {
      "dt": 1725260400,
      "temp": 297.57,
      "feels_like": 297.92,
      "pressure": 1015,
      "humidity": 71,
      "dew_point": 292.02,
      "uvi": 0.31,
      "clouds": 30,
      "visibility": 10000,
      "wind_speed": 4.68,
      "wind_deg": 192,
      "wind_gust": 4.11,
      "weather": [
        {
          "id": 802,
          "main": "Clouds",
          "description": "scattered clouds",
          "icon": "03d"
        }
      ],
      "pop": 0
    },
    {
      "dt": 1725264000,
      "temp": 297.4,
      "feels_like": 297.76,
      "pressure": 1016,
      "humidity": 72,
      "dew_point": 292.01,
      "uvi": 0.91,
      "clouds": 25,
      "visibility": 10000,
      "wind_speed": 3.89,
      "wind_deg": 184,
      "wind_gust": 3.44,
      "weather": [
        {
          "id": 802,
          "main": "Clouds",
          "description": "scattered clouds",
          "icon": "03d"
        }
      ],
      "pop": 0
    },
    {
      "dt": 1725267600,
      "temp": 297.38,
      "feels_like": 297.74,
      "pressure": 1016,
      "humidity": 72,
      "dew_point": 291.98,
      "uvi": 2.64,
      "clouds": 31,
      "visibility": 10000,
      "wind_speed": 3.64,
      "wind_deg": 183,
      "wind_gust": 3.52,
      "weather": [
        {
          "id": 802,
          "main": "Clouds",
          "description": "scattered clouds",
          "icon": "03d"
        }
      ],
      "pop": 0
    },
    {
      "dt": 1725271200,
      "temp": 297.53,
      "feels_like": 297.88,
      "pressure": 1016,
      "humidity": 71,
      "dew_point": 292.03,
      "uvi": 5.21,
      "clouds": 46,
      "visibility": 10000,
      "wind_speed": 3.76,
      "wind_deg": 189,
      "wind_gust": 3.52,
      "weather": [
        {
          "id": 802,
          "main": "Clouds",
          "description": "scattered clouds",
          "icon": "03d"
        }
      ],
      "pop": 0
    },
    {
      "dt": 1725274800,
      "temp": 297.42,
      "feels_like": 297.78,
      "pressure": 1015,
      "humidity": 72,
      "dew_point": 292.14,
      "uvi": 8.98,
      "clouds": 38,
      "visibility": 10000,
      "wind_speed": 3.62,
      "wind_deg": 186,
      "wind_gust": 3.41,
      "weather": [
        {
          "id": 802,
          "main": "Clouds",
          "description": "scattered clouds",
          "icon": "03d"
        }
      ],
      "pop": 0
    },
    {
      "dt": 1725278400,
      "temp": 297.31,
      "feels_like": 297.71,
      "pressure": 1014,
      "humidity": 74,
      "dew_point": 292.35,
      "uvi": 9.91,
      "clouds": 48,
      "visibility": 10000,
      "wind_speed": 3.95,
      "wind_deg": 189,
      "wind_gust": 3.71,
      "weather": [
        {
          "id": 802,
          "main": "Clouds",
          "description": "scattered clouds",
          "icon": "03d"
        }
      ],
      "pop": 0
    },
    {
      "dt": 1725282000,
      "temp": 297.34,
      "feels_like": 297.72,
      "pressure": 1014,
      "humidity": 73,
      "dew_point": 292.24,
      "uvi": 8.45,
      "clouds": 32,
      "visibility": 10000,
      "wind_speed": 3.16,
      "wind_deg": 179,
      "wind_gust": 3.01,
      "weather": [
        {
          "id": 802,
          "main": "Clouds",
          "description": "scattered clouds",
          "icon": "03d"
        }
      ],
      "pop": 0
    },
    {
      "dt": 1725285600,
      "temp": 297.27,
      "feels_like": 297.64,
      "pressure": 1013,
      "humidity": 73,
      "dew_point": 292.1,
      "uvi": 6.25,
      "clouds": 19,
      "visibility": 10000,
      "wind_speed": 2.9,
      "wind_deg": 179,
      "wind_gust": 2.72,
      "weather": [
        {
          "id": 801,
          "main": "Clouds",
          "description": "few clouds",
          "icon": "02d"
        }
      ],
      "pop": 0
    },
    {
      "dt": 1725289200,
      "temp": 297.34,
      "feels_like": 297.69,
      "pressure": 1013,
      "humidity": 72,
      "dew_point": 292,
      "uvi": 3.6,
      "clouds": 15,
      "visibility": 10000,
      "wind_speed": 2.19,
      "wind_deg": 184,
      "wind_gust": 2.01,
      "weather": [
        {
          "id": 801,
          "main": "Clouds",
          "description": "few clouds",
          "icon": "02d"
        }
      ],
      "pop": 0
    },
    {
      "dt": 1725292800,
      "temp": 297.34,
      "feels_like": 297.69,
      "pressure": 1012,
      "humidity": 72,
      "dew_point": 292,
      "uvi": 1.38,
      "clouds": 12,
      "visibility": 10000,
      "wind_speed": 2.44,
      "wind_deg": 197,
      "wind_gust": 2.22,
      "weather": [
        {
          "id": 801,
          "main": "Clouds",
          "description": "few clouds",
          "icon": "02d"
        }
      ],
      "pop": 0
    },
    {
      "dt": 1725296400,
      "temp": 297.3,
      "feels_like": 297.68,
      "pressure": 1013,
      "humidity": 73,
      "dew_point": 292.04,
      "uvi": 0.33,
      "clouds": 11,
      "visibility": 10000,
      "wind_speed": 2.26,
      "wind_deg": 198,
      "wind_gust": 2.13,
      "weather": [
        {
          "id": 801,
          "main": "Clouds",
          "description": "few clouds",
          "icon": "02d"
        }
      ],
      "pop": 0
    },
    {
      "dt": 1725300000,
      "temp": 297.24,
      "feels_like": 297.61,
      "pressure": 1013,
      "humidity": 73,
      "dew_point": 292.24,
      "uvi": 0,
      "clouds": 12,
      "visibility": 10000,
      "wind_speed": 2.68,
      "wind_deg": 191,
      "wind_gust": 2.51,
      "weather": [
        {
          "id": 801,
          "main": "Clouds",
          "description": "few clouds",
          "icon": "02d"
        }
      ],
      "pop": 0
    },
    {
      "dt": 1725303600,
      "temp": 297.16,
      "feels_like": 297.55,
      "pressure": 1014,
      "humidity": 74,
      "dew_point": 292.37,
      "uvi": 0,
      "clouds": 56,
      "visibility": 10000,
      "wind_speed": 3.11,
      "wind_deg": 187,
      "wind_gust": 2.93,
      "weather": [
        {
          "id": 803,
          "main": "Clouds",
          "description": "broken clouds",
          "icon": "04n"
        }
      ],
      "pop": 0
    },
    {
      "dt": 1725307200,
      "temp": 297.2,
      "feels_like": 297.62,
      "pressure": 1015,
      "humidity": 75,
      "dew_point": 292.3,
      "uvi": 0,
      "clouds": 60,
      "visibility": 10000,
      "wind_speed": 3.18,
      "wind_deg": 169,
      "wind_gust": 3.01,
      "weather": [
        {
          "id": 803,
          "main": "Clouds",
          "description": "broken clouds",
          "icon": "04n"
        }
      ],
      "pop": 0
    },
    {
      "dt": 1725310800,
      "temp": 297.08,
      "feels_like": 297.49,
      "pressure": 1016,
      "humidity": 75,
      "dew_point": 292.47,
      "uvi": 0,
      "clouds": 69,
      "visibility": 10000,
      "wind_speed": 3.63,
      "wind_deg": 170,
      "wind_gust": 3.51,
      "weather": [
        {
          "id": 803,
          "main": "Clouds",
          "description": "broken clouds",
          "icon": "04n"
        }
      ],
      "pop": 0
    },
    {
      "dt": 1725314400,
      "temp": 297.06,
      "feels_like": 297.49,
      "pressure": 1016,
      "humidity": 76,
      "dew_point": 292.49,
      "uvi": 0,
      "clouds": 77,
      "visibility": 10000,
      "wind_speed": 3.86,
      "wind_deg": 178,
      "wind_gust": 3.71,
      "weather": [
        {
          "id": 803,
          "main": "Clouds",
          "description": "broken clouds",
          "icon": "04n"
        }
      ],
      "pop": 0
    },
    {
      "dt": 1725318000,
      "temp": 296.99,
      "feels_like": 297.44,
      "pressure": 1016,
      "humidity": 77,
      "dew_point": 292.69,
      "uvi": 0,
      "clouds": 81,
      "visibility": 10000,
      "wind_speed": 4.19,
      "wind_deg": 193,
      "wind_gust": 3.93,
      "weather": [
        {
          "id": 803,
          "main": "Clouds",
          "description": "broken clouds",
          "icon": "04n"
        }
      ],
      "pop": 0
    }
  ],
  "daily": [
    {
      "dt": 1725192000,
      "sunrise": 1725170207,
      "sunset": 1725213809,
      "moonrise": 1725165900,
      "moonset": 1725210420,
      "moon_phase": 0.95,
      "summary": "Expect a day of partly cloudy with clear spells",
      "temp": {
        "day": 297.2,
        "min": 296.54,
        "max": 298.05,
        "night": 298.05,
        "eve": 297.61,
        "morn": 296.59
      },
      "feels_like": {
        "day": 297.7,
        "night": 298.53,
        "eve": 298.1,
        "morn": 297.1
      },
      "pressure": 1015,
      "humidity": 78,
      "dew_point": 293.06,
      "wind_speed": 5,
      "wind_deg": 211,
      "wind_gust": 4.82,
      "weather": [
        {
          "id": 804,
          "main": "Clouds",
          "description": "overcast clouds",
          "icon": "04d"
        }
      ],
      "clouds": 94,
      "pop": 0,
      "uvi": 7.42
    },
    {
      "dt": 1725274800,
      "sunrise": 1725256587,
      "sunset": 1725300190,
      "moonrise": 1725254940,
      "moonset": 1725299340,
      "moon_phase": 0.98,
      "summary": "There will be partly cloudy today",
      "temp": {
        "day": 297.42,
        "min": 296.99,
        "max": 298.24,
        "night": 296.99,
        "eve": 297.3,
        "morn": 297.7
      },
      "feels_like": {
        "day": 297.78,
        "night": 297.44,
        "eve": 297.68,
        "morn": 298.04
      },
      "pressure": 1015,
      "humidity": 72,
      "dew_point": 292.14,
      "wind_speed": 5.11,
      "wind_deg": 198,
      "wind_gust": 4.61,
      "weather": [
        {
          "id": 802,
          "main": "Clouds",
          "description": "scattered clouds",
          "icon": "03d"
        }
      ],
      "clouds": 38,
      "pop": 0,
      "uvi": 9.91
    },
    {
      "dt": 1725361200,
      "sunrise": 1725342968,
      "sunset": 1725386570,
      "moonrise": 1725343800,
      "moonset": 1725388140,
      "moon_phase": 0,
      "summary": "Expect a day of partly cloudy with rain",
      "temp": {
        "day": 297.11,
        "min": 296.51,
        "max": 297.55,
        "night": 297.47,
        "eve": 297.5,
        "morn": 296.64
      },
      "feels_like": {
        "day": 297.55,
        "night": 297.86,
        "eve": 297.87,
        "morn": 297.13
      },
      "pressure": 1016,
      "humidity": 76,
      "dew_point": 292.61,
      "wind_speed": 4.98,
      "wind_deg": 208,
      "wind_gust": 4.61,
      "weather": [
        {
          "id": 500,
          "main": "Rain",
          "description": "light rain",
          "icon": "10d"
        }
      ],
      "clouds": 100,
      "pop": 0.2,
      "rain": 0.13,
      "uvi": 7.6
    },
    {
      "dt": 1725447600,
      "sunrise": 1725429348,
      "sunset": 1725472949,
      "moonrise": 1725432600,
      "moonset": 1725476880,
      "moon_phase": 0.04,
      "summary": "There will be partly cloudy today",
      "temp": {
        "day": 296.99,
        "min": 296.7,
        "max": 297.2,
        "night": 296.9,
        "eve": 297.07,
        "morn": 296.73
      },
      "feels_like": {
        "day": 297.41,
        "night": 297.37,
        "eve": 297.5,
        "morn": 297.13
      },
      "pressure": 1014,
      "humidity": 76,
      "dew_point": 292.5,
      "wind_speed": 5.78,
      "wind_deg": 198,
      "wind_gust": 5.3,
      "weather": [
        {
          "id": 804,
          "main": "Clouds",
          "description": "overcast clouds",
          "icon": "04d"
        }
      ],
      "clouds": 87,
      "pop": 0,
      "uvi": 8.79
    },
    {
      "dt": 1725534000,
      "sunrise": 1725515728,
      "sunset": 1725559329,
      "moonrise": 1725521340,
      "moonset": 1725565620,
      "moon_phase": 0.07,
      "summary": "Expect a day of partly cloudy with rain",
      "temp": {
        "day": 297.3,
        "min": 296.82,
        "max": 297.63,
        "night": 297.63,
        "eve": 297.48,
        "morn": 296.85
      },
      "feels_like": {
        "day": 297.83,
        "night": 298.2,
        "eve": 298.03,
        "morn": 297.34
      },
      "pressure": 1015,
      "humidity": 79,
      "dew_point": 293.3,
      "wind_speed": 4.4,
      "wind_deg": 255,
      "wind_gust": 4.3,
      "weather": [
        {
          "id": 500,
          "main": "Rain",
          "description": "light rain",
          "icon": "10d"
        }
      ],
      "clouds": 100,
      "pop": 0.2,
      "rain": 1.02,
      "uvi": 7.43
    },
    {
      "dt": 1725620400,
      "sunrise": 1725602107,
      "sunset": 1725645708,
      "moonrise": 1725610020,
      "moonset": 1725654360,
      "moon_phase": 0.1,
      "summary": "The day will start with rain through the late morning hours, transitioning to partly cloudy",
      "temp": {
        "day": 297.25,
        "min": 297.22,
        "max": 297.58,
        "night": 297.22,
        "eve": 297.35,
        "morn": 297.32
      },
      "feels_like": {
        "day": 297.83,
        "night": 297.77,
        "eve": 297.91,
        "morn": 297.91
      },
      "pressure": 1015,
      "humidity": 81,
      "dew_point": 293.91,
      "wind_speed": 5.09,
      "wind_deg": 201,
      "wind_gust": 4.73,
      "weather": [
        {
          "id": 500,
          "main": "Rain",
          "description": "light rain",
          "icon": "10d"
        }
      ],
      "clouds": 74,
      "pop": 0.2,
      "rain": 0.88,
      "uvi": 8
    },
    {
      "dt": 1725706800,
      "sunrise": 1725688487,
      "sunset": 1725732087,
      "moonrise": 1725698880,
      "moonset": 1725743280,
      "moon_phase": 0.13,
      "summary": "Expect a day of partly cloudy with rain",
      "temp": {
        "day": 297.2,
        "min": 296.72,
        "max": 297.3,
        "night": 297.09,
        "eve": 297.3,
        "morn": 296.8
      },
      "feels_like": {
        "day": 297.75,
        "night": 297.63,
        "eve": 297.83,
        "morn": 297.39
      },
      "pressure": 1016,
      "humidity": 80,
      "dew_point": 293.5,
      "wind_speed": 6.35,
      "wind_deg": 179,
      "wind_gust": 5.8,
      "weather": [
        {
          "id": 500,
          "main": "Rain",
          "description": "light rain",
          "icon": "10d"
        }
      ],
      "clouds": 87,
      "pop": 0.48,
      "rain": 0.88,
      "uvi": 8
    },
    {
      "dt": 1725793200,
      "sunrise": 1725774866,
      "sunset": 1725818466,
      "moonrise": 1725787860,
      "moonset": 1725832320,
      "moon_phase": 0.16,
      "summary": "There will be partly cloudy today",
      "temp": {
        "day": 296.6,
        "min": 296.6,
        "max": 296.89,
        "night": 296.73,
        "eve": 296.7,
        "morn": 296.8
      },
      "feels_like": {
        "day": 297.04,
        "night": 297.18,
        "eve": 297.12,
        "morn": 297.28
      },
      "pressure": 1017,
      "humidity": 78,
      "dew_point": 292.6,
      "wind_speed": 5.26,
      "wind_deg": 167,
      "wind_gust": 4.82,
      "weather": [
        {
          "id": 804,
          "main": "Clouds",
          "description": "overcast clouds",
          "icon": "04d"
        }
      ],
      "clouds": 100,
      "pop": 0,
      "uvi": 8
    }
  ]
}`) 
let cacheTime = null

export default async function GetWeatherData(forecastTypes) {
    // requested weather data object
    let requestedData = {}

    // update weather data with openweathermap API
    if (Date.now() - cacheTime > (5 * 60 * 1000)) {
        const time = Date.now()
        let weather = null

        // try to update cached weather data
        try {
            weather = await getJSON(`https://api.openweathermap.org/data/3.0/onecall?lat=${config.location.lat}&lon=${config.location.lon}&units=${config.units}&appid=${secrets.OPENWEATHERMAP_KEY}`)
            cachedWeather = weather
            cacheTime = time
        }
        catch (err) {
            requestedData.error = err
        }
    }

    forecastTypes.forEach((forecastType) => requestedData[forecastType] = cachedWeather[forecastType])
    if ('alerts' in forecastTypes && !('alerts' in requestedData)) {
        requestedData.alerts = null
    }

    requestedData.alerts = [
        {
            "sender_name": "NWS Philadelphia - Mount Holly (New Jersey, Delaware, Southeastern Pennsylvania)",
            "event": "Small Craft Advisory",
            "start": 1684952747,
            "end": 1684988747,
            "description": "...SMALL CRAFT ADVISORY REMAINS IN EFFECT FROM 5 PM THIS",
            "tags": []
        },
    ]

    return requestedData 
}