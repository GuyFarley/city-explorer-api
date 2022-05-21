'use strict';

const axios = require('axios');
let cache = require('./cache.js');

async function getMovies(request, response, next) {
  try {
    let movieCity = request.query.movie_city;
    let key = movieCity + 'Data';

    if (cache[key] && (Date.now() - cache[key].timestamp < 5000000)) {
      console.log('You have previously requested this info');
      response.status(200).send(cache[key].data);
    } else {
      console.log('New search request');
    }

    let movieURL = `https://api.themoviedb.org/3/search/movie?api_key=${process.env.MOVIE_API_KEY}&language=en-US&include_adult=false&query=${movieCity}`;
    let moviesFromAPI = await axios.get(movieURL);
    let movieData = moviesFromAPI.data.results.map(movie => new Movie(movie));
    response.send(movieData);

    cache[key] = {
      data: movieData,
      timestamp: Date.now()
    };
  } catch (error) {
    next(error);
  }
}

class Movie {
  constructor(movieObject) {
    this.title = movieObject.title;
    this.overview = movieObject.overview;
    this.vote_average = movieObject.vote_average;
    this.vote_count = movieObject.vote_count;
    this.poster_path = movieObject.poster_path ? `https://image.tmdb.org/t/p/w500${movieObject.poster_path}` : '';
    this.popularity = movieObject.popularity;
    this.release_date = movieObject.release_date;
  }
}

module.exports = getMovies;

