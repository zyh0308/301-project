'use strict';

require('dotenv').config();

const express = require('express');
const ejs = require('ejs');
const methodoverride = require('method-override');
 const pg = require('pg');
 const superagent = require('superagent');

const PORT = process.env.PORT || 3009;
const app = express();

const expressLayouts=require('express-ejs-layouts');

const client = new pg.Client(process.env.DATABASE_URL);
client.on('error', (e) => console.error(e));
client.connect();


app.use(methodoverride('_method'));
app.use(express.urlencoded({ extended: true }));
app.use(express.static('./public'));
app.use(expressLayouts);

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


  //THIS IS THE CALL BACK FUNCTION TO DELETE (needs to be above where it is called)
  const deleteBook = function (req , res ) {
    console.log(req.body.id);
    client.query('DELETE FROM bored WHERE id=$1',[req.body.id]).then( sql => {
      res.redirect('/saves');
    })
  }

//this needs to be below the csl
app.delete('/delete', deleteBook);


//THIS WILL SAVE USERS FAVORITE ACTIVITY TO DATABASE
  app.post('/saves', (req, res) => {
    let SQL = `INSERT INTO bored
    (activity, accessibility, type, participants, price, key)
    VALUES($1,$2,$3,$4,$5,$6);`;
  
    let sqlData = [req.body.activity, req.body.accessibility, req.body.type, req.body.participants, req.body.price, req.body.key];
  
    // let SQLrow = (SQL, [req.body.author, req.body.title, req.body.isbn, req.body.image_url, req.body.summary, req.body.category]);
  
    client.query(SQL, sqlData).then(() => {
      res.redirect('/');
    });
  
  });
  

app.get('/saves', (req, res) => {
  const instruction = 'SELECT * FROM bored;';
  client.query(instruction).then(function(sqlSaveData){
    //console.log('is it working',sqlSaveData.rows);
    const boredDataArray = sqlSaveData.rows;
    if(boredDataArray.length > 0){
      res.render('pages/saves', { boredDataArray });
    } else {
      res.redirect('/main');
    }
  });
});


app.listen(PORT, () => console.log(`app running on ${PORT}`));
