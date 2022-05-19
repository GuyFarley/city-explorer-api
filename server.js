'use strict';
console.log('Our first server');

// REQUIRE

const express = require('express');
let data = require('./data/weather.json');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();

// USE

const app = express();
app.use(cors());
const PORT = process.env.PORT || 3002;

// ROUTES

app.get('/', (request, response) => {
  response.send('Hello from my server');
});

// app.get('/weather', (request, response, next) => {
//   try {
//     let cityFromRequest = request.query.city_name;

//     let selectedCity = data.find(city => city.city_name.toLowerCase() === cityFromRequest.toLowerCase());

//     let dataToSend = selectedCity.data.map(city => new Forecast(city));
//     console.log(dataToSend);
//     response.send(dataToSend);

//   } catch (error) {

//     next(error);
//   }
// });

app.get('/weather', async (request, response, next) => {
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
    next(error);
  }
});

app.get('*', (request, response) => {
  response.status(404).send('The thing you are looking for doesn\'t exist');
});

// ERRORS

app.use((error, request, response, next) => {
  console.log(error.message);
  response.status(500).send(error.message);
});

// CLASSES
class Forecast {
  constructor(cityObject) {
    this.description = cityObject.weather.description;
    this.date = cityObject.datetime;
  }
}

// LISTEN

app.listen(PORT, () => console.log(`listening on port ${PORT}`));
