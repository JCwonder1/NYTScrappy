var express = require('express');
var router = express.Router();
const axios = require('axios');
const ArticlesModel = require('../db/models/Articles');
//TODO: Continue with the Articles Const Line20


/* GET home page. */
router.get('/', function(req, res, next) {

  let url = `https://api.nytimes.com/svc/topstories/v2/home.json?api-key=${process.env.NYTIMES_API_KEY}`;
  console.log(url);

  axios({
    method:'get',
    url: url,
  }).then( response => {
    //console.log(data.data);
    let data = response.data.results;
    const articles = new ArticlesModel()
   

    data.forEach(element => {
      console.log("TITLE: ", element.title);
      console.log("DESC: ", element.abstract);
      console.log("SHORTURL: ", element.short_url);
    });
    
  }).catch(err => {
    console.log(err.data);

  })
  

  res.render('index', { title: 'Express' });
});

module.exports = router;
