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

// let data = require('./data/data.json');

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

app.get('/hello', (request, response) => {
  console.log(request.query);
  let userFirstName = request.query.firstName;
  let userLastName = request.query.lastName;

  response.status(200).send(`Hello ${userFirstName} ${userLastName}! Welcome to My Server!`);
});

app.get('/info', (request, response, next) => {
  try {
    let queriedInfo = request.query.info;

    response.status(200).send(`You are looking for a ${queriedInfo}`);
  } catch (error) {
    next(error);
  }
});

//CATCH ALL  -BE AT THE BOTTOM AND SERVE AS A 404 ERROR MESSAGE//
app.get('*', (request, response) => {
  response.status(404).send('This route does not exist');
});

//ERROR HANDING - PLUG AND PLAY CODE FROM EXPRESS DOCS//
//add next after response//
app.use((error, request, response,) => {
  response.status(500).send(error.message);
});
