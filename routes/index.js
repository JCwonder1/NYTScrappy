var express = require("express");
var router = express.Router();
const axios = require("axios");
const ArticlesModel = require("../db/models/Articles");

/* GET home page. */
router.get("/", function(req, res, next) {
  ArticlesModel.find({}).then(data => {
    res.render("index", { data: data });
  });
});

/**Scrap for new news */
router.get("/add", function(req, res, next) {
  fetchTimesDataFromApi(data => {
    insertIntoMongo(ArticlesModel, data);
    res.redirect("/");
  });
});

router.delete("/", function (req, res, next){
  ArticlesModel.remove({}, response => {
    console.log(response); 
    res.redirect("/");
}
)});

module.exports = router;

/**Functions */

function fetchTimesDataFromApi(cb) {
  let url = `https://api.nytimes.com/svc/topstories/v2/home.json?api-key=${
    process.env.NYTIMES_API_KEY
  }`;
  console.log(url);

  axios({
    method: "get",
    url: url
  })
    .then(response => {
      return cb(response.data.results);
    })
    .catch(err => {
      return cb(err);
    });
}

async function insertIntoMongo(collection, data) {
  await data.forEach(element => {
    ArticlesModel.create({
      title: element.title,
      desc: element.abstract,
      url: element.short_url
    });
  });
}
