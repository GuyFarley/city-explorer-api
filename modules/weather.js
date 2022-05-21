'use strict';

const axios = require('axios');

async function getWeather(request, response, next) {

  try {
    let searchLat = request.query.latitude;
    let searchLon = request.query.longitude;

    let weatherURL = `https://api.weatherbit.io/v2.0/forecast/daily?key=${process.env.WEATHER_API_KEY}&lat=${searchLat}&lon=${searchLon}`;
    let forecastFromAPI = await axios.get(weatherURL);
    console.log(forecastFromAPI);

    let dataToSend = forecastFromAPI.data.data.map(city => new Forecast(city));
    // console.log(dataToSend);
    response.send(dataToSend);

  } catch (error) {
    // next(error);
    Promise.resolve().then(() => {
      throw new Error(error.message);
    }).catch(next);
  }
}

class Forecast {
  constructor(cityObject) {
    this.description = cityObject.weather.description;
    this.date = cityObject.datetime;
    this.temp = Math.floor(cityObject.high_temp * 1.8 + 32);
  }
}

module.exports = getWeather;
