'use strict';

require('dotenv').config();

const express = require('express');
const ejs = require('ejs');
const methodoverride = require('method-override');
const pg = require('pg');
const superagent = require('superagent');

const PORT = process.env.PORT || 3240;
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
app.post('/one', new_Activity_Search);

app.get('/two', (req, res) => {
  res.render('pages/form');
});
app.post('/two', new_Activity_Search);

app.get('/three', (req, res) => {
  res.render('pages/form');
});
app.post('/three', new_Activity_Search);

app.get('/four', (req, res) => {
  res.render('pages/form');
});
app.post('/four', new_Activity_Search);


  //THIS IS THE CALL BACK FUNCTION TO DELETE (needs to be above where it is called)
  const deleteBook = function (req , res ) {
    console.log(req.body.id);
    client.query('DELETE FROM bored WHERE id=$1',[req.body.id]).then( sql => {
      res.redirect('/saves');
    })
  }

//this needs to be below the call back function 
app.delete('/delete', deleteBook);


//THIS WILL SAVE USERS FAVORITE ACTIVITY TO DATABASE
  app.post('/saves', (req, res) => {
    let SQL = `INSERT INTO bored
    (activity, accessibility, type, participants, price, key)
    VALUES($1,$2,$3,$4,$5,$6);`;
  
    let sqlData = [req.body.activity, req.body.accessibility, req.body.type, req.body.participants, req.body.price, req.body.key];
  
    client.query(SQL, sqlData).then(() => {
      res.redirect('/saves');
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



function Activity(object){
  //console.log(object);
  this.activity = object.activity;
  this.accessibility = object.accessibility;
  this.type = object.type;
  this.participants = object.participants;
  this.price = object.price;
  this.link = object.link;
  this.key = object.key;
}


function new_Activity_Search(request, response){
  let request_parameters = request.body;
  var activities_Array = [];
  let promisesArray = [];

  let url = `https://www.boredapi.com/api/activity?price=${request_parameters.price}&participants=${request_parameters.participants}`;

  function promiseConstructor(url){

    return new Promise( (resolve, reject) => {
      superagent.get(url).then(result => {
      let new_Activity = new Activity(result.body);
      console.log('HEY NEW ACTIVITY', new_Activity);
      resolve(new_Activity)
      // console.log('EXPRESS ARRAY',activities_Array);
    }).catch( err => {
      console.error(err);
    });
    })

  }

  for(let i = 0; i < 5; i++){

    let newPromise =  promiseConstructor(url)
    promisesArray.push(newPromise)

  }
  
  console.log('PROMISESARRAY', promisesArray);
  Promise.all(promisesArray).then( (superAgentResponses) => {
    response.render('./pages/detail', {activity_Listings:superAgentResponses});
  });

}


app.listen(PORT, () => console.log(`app running on ${PORT}`));
