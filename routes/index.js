var express = require("express");
var router = express.Router();
const axios = require("axios");
const ArticlesModel = require("../db/models/Articles");
const CommentModel = require("../db/models/Comments")
const mongoose = require('mongoose');


/* GET home page. */
router.get("/", function(req, res, next) {
  ArticlesModel.find({}).then(data => {
    res.render("index", { data: data });
  });
});

router.get("/comment/:articleid", (req, res, next)=>{
  console.log(req.params.articleid);
  CommentModel.find({article:req.params.articleid}).populate({path: 'Article'}).
  exec((err, data)=>{
    if (err) return handleError(err);
    res.json(data);
  })
});

/**Scrap for new news */
router.post("/", function(req, res, next) {
  fetchTimesDataFromApi(data => {
    insertIntoMongo(ArticlesModel, data);
    res.json('/');
  });
  
});

router.delete("/delete", function (req, res, next){
  ArticlesModel.deleteMany({}, response => {
    res.json("/")
    
})
  
});

router.put("/", async (req, res, next)=> {
  insertComment(CommentModel, req.body).then(res =>{  
  });
  
});

module.exports = router;

/**Functions */

function fetchTimesDataFromApi(cb) {
  let url = `https://api.nytimes.com/svc/topstories/v2/home.json?api-key=${
    process.env.NYTIMES_API_KEY
  }`;
  

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

async function insertComment(collection, {name, comment, article}){
  await CommentModel.create({
    user: name,
    comment: comment,
    article: mongoose.Types.ObjectId(article),
  }, (err, res) => {
    if (err) throw err;
    });
}

async function findCommentByArticleId(collection, articleId){
  await CommentModel.find({article: articleId}).then((err, res)=>{

  })
}