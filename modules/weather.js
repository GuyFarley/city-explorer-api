'use strict';

const axios = require('axios');
let cache = require('./cache.js');

function weatherHandler(request, response) {

  try {
    let lat = request.query.latitude;
    let lon = request.query.longitude;

    let summaries = getWeather(lat, lon);
    console.log(summaries);
    response.send(summaries);
  } catch (error) {
    console.error(error);
    response.status(200).send('Sorry. Something went wrong!');
  }
}

async function getWeather(latitude, longitude) {

  const key = 'weather-' + latitude + longitude;
  const url = `http://api.weatherbit.io/v2.0/forecast/daily/?key=${process.env.WEATHER_API_KEY}&lang=en&lat=${latitude}&lon=${longitude}&days=5`;

  if (cache[key] && (Date.now() - cache[key].timestamp < 50000)) {
    console.log('Cache hit');
  } else {
    console.log('Cache miss');
    cache[key] = {};
    cache[key].timestamp = Date.now();
    cache[key].data = await axios.get(url)
      .then(response => parseWeather(response.data));
  }

  return cache[key].data;
}

function parseWeather(weatherData) {
  try {
    const weatherSummaries = weatherData.data.map(day => {
      return new Weather(day);
    });
    console.log(weatherSummaries);
    return Promise.resolve(weatherSummaries);
  } catch (e) {
    return Promise.reject(e);
  }
}

class Weather {
  constructor(day) {
    this.forecast = day.weather.description;
    this.time = day.datetime;
    this.temp = Math.floor(day.high_temp * 1.8 + 32);

  }
}

module.exports = weatherHandler;

