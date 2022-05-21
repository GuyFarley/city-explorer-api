'use strict';
console.log('lab 10 server');

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const weatherHandler = require('./modules/weather');
const getMovies = require('./modules/movies');

const app = express();
app.use(cors());
const PORT = process.env.PORT || 3002;


app.get('/', (request, response) => {
  response.send('Hello from lab 10 server');
});

app.get('/weather', weatherHandler);
app.get('/movies', getMovies);

app.get('*', (request, response) => {
  response.status(404).send('The thing you are looking for doesn\'t exist');
});

app.use((error, request, response, next) => {
  console.log(error.message);
  response.status(500).send(error.message);
});

app.listen(PORT, () => console.log(`Server up on ${PORT}`));
