const express = require('express');
// const local_env = require('dotenv').config({ path: __dirname + '/.env.local' });
const bodyParser = require('body-parser');
// Do not forget to use body parser!! It is pretty much a standard
// in apps that use express
const bcrypt = require('bcrypt-nodejs');
// brypt for hashing passwords
const cors = require('cors');
// this is used to enable CORS
const knex = require('knex');
// Knex for connecting the server and the database

// CONTROLLERS
const register = require('./controllers/register');
const signin = require('./controllers/signin');
const profile = require('./controllers/profile');
const image = require('./controllers/image');

// Here's the connection to the database using Knex
const db = knex({
  client: 'pg', // pg for postgres
  connection: {
    connectionString: process.env.DATABASE_URL,
    //ssl: false,
  },
});

// db.select('*').from('users').then(data => {
//   console.log(data);
// })

const app = express();

app.use(bodyParser.json());
app.use(cors());
app.use(cors({origin: 'https://smart-brain-frontie.herokuapp.com'}));
// app.use(function (req, res, next) {

//   // Website you wish to allow to connect
//   res.setHeader('Access-Control-Allow-Origin', 'https://smart-brain-frontie.herokuapp.com/');

//   // Request methods you wish to allow
//   res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

//   // Request headers you wish to allow
//   res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

//   // Set to true if you need the website to include cookies in the requests sent
//   // to the API (e.g. in case you use sessions)
//   res.setHeader('Access-Control-Allow-Credentials', true);

//   // Pass to next layer of middleware
//   next();
// });

// ROOT ROUTE
app.get('/', (req, res) => {
  res.send('it is working!');
});

// SIGNIN ROUTE (more comments in controllers)
// In here we're doing a dependency injection ie. injecting the dependencies
// that the handleRegister function needs like the knex database and bcrypt.
app.post('/signin', signin.handleSignin(db, bcrypt));
// a bit more advanced way is used here - the other routes could be changed to similar syntax depending on preference

// REGISTER ROUTE
app.post('/register', (req, res) => {
  register.handleRegister(req, res, db, bcrypt);
});

// PROFILE ROUTE
// Can have any number as id.
// This will GET the user for their homepage.
app.get('/profile/:id', (req, res) => {
  profile.handleProfileGet(req, res, db);
});

// IMAGE ROUTE
app.put('/image', (req, res) => {
  image.handleImage(req, res, db);
});
app.post('/imageurl', (req, res) => {
  image.handleApiCall(req, res);
});

app.listen(process.env.PORT || 3000, () => {
  console.log(`app is running on port ${process.env.PORT}`);
});