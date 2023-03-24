'use strict';

console.log('1st Server =)!!');


//REQUIRES//
const express = require('express');
require('dotenv').config();
const cors = require('cors');

//ONCE WE BRING IN EXPRESS WE CALL IT TO CREATE THE SERVER//
//app === SERVER
const app = express();

//MIDDLEWARE - CORS//
app.use(cors());

let weather = require('./data/weather.json');

//PORT THAT MY SERVER WILL RUN ON//
const PORT = process.env.PORT || 3002;

app.listen(PORT, ()=> console.log(`WE ARE RUNNING ON PORT ${PORT}!`));

//ENDPOINTS//

//BASE ENDPOINT - PROOF OF LIFE//
//1ST ARG -STRING URL IN QUOTES//
//2ND ARG -STRING -CALLBACK THAT WILL EXECUTE WHEN THAT ENDPOINT IS HIT//

app.get('/', (request, response) => {
  response.statusCode(200).send('Welcome To My Server!');
});

app.get('/weather', (request, response, next) => {
  try {
    let lat = request.query.lat;
    let lon = request.query.lon;
    let cityName = request.query.searchQuery;

    console.log(request.query);

    let city = weather.find(city => city.city_name.toLowerCase() === cityName.toLowerCase());
    console.log(city);
    let weatherToSend = city.data.map(day => new Forecast (day));

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

// app.get('/weather', (request, response, next) => {

//   try {
//     let queriedMyWeather = request.query.MyWeather;

//     let dataToGroom = data.find(weather => weather.MyWeather === queriedMyWeather);
//     let dataToSend = new MyWeather(dataToGroom);

//     response.status(200).send(dataToSend);
//   } catch (error) {
//     next(error);
//   }
// });


//CATCH ALL  -BE AT THE BOTTOM AND SERVE AS A 404 ERROR MESSAGE//
app.get('*', (request, response) => {
  response.status(404).send('This route does not exist');
});

//ERROR HANDING - PLUG AND PLAY CODE FROM EXPRESS DOCS//
//add next after response//
app.use((error, request, response, next) => {
  response.status(500).send(error.message);
});
