'use strict';
console.log('Our first server');

// REQUIRE

const express = require('express');
// let data = require('./data/weather.json');
const cors = require('cors');
// const axios = require('axios');
require('dotenv').config();
const getWeather = require('./modules/my-weather');
const getMovies = require('./modules/movies');

// USE

const app = express();
app.use(cors());
const PORT = process.env.PORT || 3002;

// ROUTES

app.get('/', (request, response) => {
  response.send('Hello from my server');
});

app.get('/weather', getWeather);
app.get('/movies', getMovies);

// ERRORS

app.get('*', (request, response) => {
  response.status(404).send('The thing you are looking for doesn\'t exist');
});

app.use((error, request, response, next) => {
  console.log(error.message);
  response.status(500).send(error.message);
});

// LISTENER

app.listen(PORT, () => console.log(`listening on port ${PORT}`));
