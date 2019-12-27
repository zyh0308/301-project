'use strict';

require('dotenv').config();

const express = require('express');
const ejs = require('ejs');

// const pg = require('pg');
// const superagent = require('superagent');

const PORT = process.env.PORT || 3000;
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.static('./public'));
app.set('view engine', 'ejs');

app.get('/', (req, res) => {
  res.render('pages/index');
});

app.get('/main', (req, res) => {
  res.render('pages/main');
})

app.listen(PORT, () => console.log(`app running on ${PORT}`));
