'use strict';

require('dotenv').config();

const express = require('express');
const ejs = require('ejs');

 const pg = require('pg');
 const superagent = require('superagent');

const PORT = process.env.PORT || 3000;
const app = express();

const client = new pg.Client(process.env.DATABASE_URL);
client.on('error', (e) => console.error(e));
client.connect();

app.use(express.urlencoded({ extended: true }));
app.use(express.static('./public'));
app.set('view engine', 'ejs');

app.get('/', (req, res) => {
  res.render('pages/index');
});

app.get('/main', (req, res) => {
  res.render('pages/main');
});

app.get('/one', (req, res) => {
  res.render('pages/form');
});


app.get('/', (req, res) => {
  const instruction = 'SELECT * FROM bored;';
  client.query(instruction).then(function(sqlSaveData){
    console.log(sqlSaveData.rows);
    const boredDataArray = sqlSaveData.rows;
    //console.log(booksArray);
    if(boredDataArray.length > 0){
      res.render('index', { boredDataArray });
    } else {
      res.redirect('/search');
    }
  });
});



app.listen(PORT, () => console.log(`app running on ${PORT}`));
