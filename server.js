'use strict';

console.log('Our first server');


// REQUIRE (things we need to build a server)

const express = require('express');
let data = require('./data/weather.json');
const cors = require('cors');
require('dotenv').config();


// USE (once we require something we need to use it - this is where we assign variable names to required files)

const app = express();
app.use(cors());
const PORT = process.env.PORT || 3002;


// ROUTES - where we declare our endpoints

app.get('/', (request, response) => {
  response.send('Hello from my server');
});

app.get('/hello', (request, response) => {
  console.log(request.query.name);
  let firstName = request.query.name;
  let lastName = request.query.lastName
  response.send(`Hello ${firstName} ${lastName}!`);
});

app.get('/pets', (request, response, next) => {
  try {
    let speciesFromRequest = request.query.species;
    let selectedPet = data.find(pet => pet.species === speciesFromRequest);
    let dataToSend = new Pet(selectedPet);
    response.send(dataToSend);
  } catch (error) {
    // if I have an error, it will create a neew instance of the error objct that lives in express.
    next(error);
  }
});

// catch all "star route"
app.get('*', (request, response) => {
  response.send('The thing you are looking for doesn\'t exist');
});


// ERRORS

app.use((error, request, response, next) => {
  response.status(500).send(error.message);
});


// CLASSES
class Pet {
  constructor(petObject) {
    this.name = petObject.name;
    this.breed = petObject.breed;
  }
}


// LISTEN (starts the server)
// listen is an Express method that takes in 2 arguments: a port value and a callback function
app.listen(PORT, () => console.log(`listening on port ${PORT}`));
