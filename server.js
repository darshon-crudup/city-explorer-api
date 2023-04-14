'use strict';

const express = require('express');
require('dotenv').config();
const cors = require('cors');
const axios = require('axios');

const app = express();

//MIDDLEWARE - CORS//
app.use(cors());

//PORT THAT MY SERVER WILL RUN ON//
const PORT = process.env.PORT || 3002;

app.listen(PORT, ()=> console.log(`WE ARE RUNNING ON PORT ${PORT}!`));

app.get('/', (request, response) => {
  response.statusCode(200).send('Welcome To My Server!');
});

app.get('/weather', async (request, response, next) => {
  try {
    let lat = request.query.lat;
    let lon = request.query.lon;
    let cityName = request.query.searchQuery;

    console.log(request.query);

    let url = `http://api.weatherbit.io/v2.0/forecast/daily/?key=${process.env.REACT_APP_weatherBit_API_KEY}&lat=${lat}&lon=${lon}&days=5`;
    console.log(url);

    let weatherResults = await axios.get(url);
    console.log(weatherResults);

    let city = weatherResults.find(city => city.city_name.toLowerCase() === cityName.toLowerCase());
    console.log(city);

    let weatherToSend = weatherResults.data.data.map(day => new Forecast (day));

    response.status(200).send(weatherToSend);
  } catch (error) {
    next(error);
  }
});

class Forecast {
  constructor(dayObj){
    this.date = dayObj.valid_date;
    this.description = dayObj.weather.description;
  }
}
app.get('/movie', async (request, response, next) => {
  try {
    let city = request.query.searchQuery;
    console.log(city);
    let movieUrl = `https://api.themoviedb.org/3/search/movie?query=${city}&api_key=${process.env.movieAPI_KEY}&language=en-US&page=1&include_adult=false`;
    console.log(movieUrl);

    let movieResults = await axios.get(movieUrl);
    
    console.log(movieResults);
    // response.status(200).send();

    let moviesToSend = movieResults.data.results.map(film => new Movie(film));

    response.status(200).send(moviesToSend);
  } catch (error) {
    next(error);
  }
});

class Movie {
  constructor(movieObj) {
    this.title = movieObj.title;
    this.description = movieObj.overview;
  }
}
//CATCH ALL  -BE AT THE BOTTOM AND SERVE AS A 404 ERROR MESSAGE//
app.get('*', (request, response) => {
  response.status(404).send('This route does not exist');
});

//ERROR HANDING - PLUG AND PLAY CODE FROM EXPRESS DOCS//
//add next after response//
app.use((error, request, response) => {
  response.status(500).send(error.message);
});
