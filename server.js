'use strict';

require('dotenv').config();

const express = require('express');
const ejs = require('ejs');
const methodoverride = require('method-override');
const pg = require('pg');
const superagent = require('superagent');

const PORT = process.env.PORT || 3000; 
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
  res.render('pages/index')
});

app.get('/main', (req, res) => {
  res.render('pages/main', {username});
});

app.get('/family', (req, res) => {
  new_Activity_Search(req, res);
});

app.get('/work', (req, res) => {
  new_Activity_Search(req, res);
});

app.get('/individual', (req, res) => {
  new_Activity_Search(req, res);
});

app.get('/accessibility', (req, res) => {
  new_Activity_Search(req, res);
});

app.get('/about', (req, res) => {
  res.render('pages/about',{username});
});
let username;



app.post('/user-name', (req, res)=>{
username = req.body.username;
console.log(username);
res.redirect('/main');
});




  //THIS IS THE CALL BACK FUNCTION TO DELETE (needs to be above where it is called)
  const deleteBook = function (req , res ) {
    //console.log(req.body.id);
    client.query('DELETE FROM bored WHERE id=$1',[req.body.id]).then( sql => {
      res.redirect('/saves');
    })
  }

//this needs to be below the call back function 
app.delete('/delete', deleteBook);


//THIS WILL SAVE USERS FAVORITE ACTIVITY TO DATABASE
  app.post('/user-saves', (req, res) => {
    let SQL = `INSERT INTO bored
    (activity, accessibility, type, participants, price, key, username)
    VALUES($1,$2,$3,$4,$5,$6, $7);`;
  
    let sqlData = [req.body.activity, req.body.accessibility, req.body.type, req.body.participants, req.body.price, req.body.key, username];
  console.log(sqlData);
    client.query(SQL, sqlData).then(() => {
      res.redirect('/saves');
    });
  
  });


app.get('/saves', (req, res) => {
  const instruction = 'SELECT * FROM bored;';
  client.query(instruction).then(function(sqlSaveData){
    const boredDataArray = sqlSaveData.rows;
    if(boredDataArray.length > 0){
      res.render('pages/saves', { boredDataArray, username });
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
  let promisesArray = [];

  let url = `https://www.boredapi.com/api/activity?price=${request.query.price}&participants=${request.query.participants}&minaccessibility=${request.query.minaccessibility}&maxaccessibility=${request.query.maxaccessibility}`;

  function promiseConstructor(url){

    return new Promise( (resolve, reject) => {
      superagent.get(url).then(result => {
      let new_Activity = new Activity(result.body);
      resolve(new_Activity)
    }).catch( err => {
      console.error(err);
    });
    })

  }

  for(let i = 0; i < 3; i++){

    let newPromise =  promiseConstructor(url)
    promisesArray.push(newPromise)

  }
  
  Promise.all(promisesArray).then( (superAgentResponses) => {
    response.render('./pages/detail', {activity_Listings:superAgentResponses, username});
  });

}


app.listen(PORT, () => console.log(`app running on ${PORT}`));
