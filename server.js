'use strict';
console.log('Our first server');

// REQUIRE

const express = require('express');
// let data = require('./data/weather.json');
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
    // next(error);
    Promise.resolve().then(() => {
      throw new Error(error.message);
    }).catch(next);
  }
});

app.get('/movies', async (request, response, next) => {
  try {
    let movieCity = request.query.movie_city;

    let movieURL = `https://api.themoviedb.org/3/search/movie?api_key=${process.env.MOVIE_API_KEY}&language=en-US&include_adult=false&query=${movieCity}`;
    let moviesFromAPI = await axios.get(movieURL);
    console.log(moviesFromAPI);

    let movieData = moviesFromAPI.data.results.map(movie => new Movie(movie));
    console.log(movieData);
    response.send(movieData);

  } catch (error) {
    // next(error);
    Promise.resolve().then(() => {
      throw new Error(error.message);
    }).catch(next);
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

class Movie {
  constructor(movieObject) {
    this.title = movieObject.title;
    this.overview = movieObject.overview;
    this.vote_average = movieObject.vote_average;
    this.vote_count = movieObject.vote_count;
    this.poster_path = movieObject.poster_path ? "https://image.tmdb.org/t/p/w500" + movieObject.poster_path : '';
    this.popularity = movieObject.popularity;
    this.release_date = movieObject.release_date;
  }
}

// LISTEN

app.listen(PORT, () => console.log(`listening on port ${PORT}`));
