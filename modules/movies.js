'use strict';

const axios = require('axios');

async function getMovies(request, response, next) {

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
