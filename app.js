const express = require("express");
const bodyparser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");

const app = express();

app.use(bodyparser.urlencoded({extended: true}));
app.use(express.static("public"));

app.set("view engine","ejs");

mongoose.connect("mongodb://localhost:27017/wikiDB");

const articleSchema = new mongoose.Schema({
    title: String,
    content: String
});

const Article = new mongoose.model("Article",articleSchema);

app.route("/articles")
    .get(function(req,res){
        Article.find({},function(err,foundArticles){
            if(!err)
            {
                res.send(foundArticles);
            }
            else
            {
                res.send(err);
            }
        });
    })

    .post(function(req,res){
        const article = new Article({
            title: req.body.title,
            content: req.body.content
        });
        article.save(function(err){
            if(!err)
            {
                res.send("Successfully added a new Article");
            }
            else
            {
                res.send(err);
            }
        });
    })

    .delete(function(req,res){
        Article.deleteMany({},function(err){
            if(!err)
            {
                res.send("All the Articles deleted Successfully")
            }
            else
            {
                res.send(err);
            }
        });
    });

app.route("/articles/:topic")
    .get(function(req,res){
        Article.findOne({title: req.params.topic},function(err,foundArticle){
            if(!err)
            {
                if(foundArticle)
                {
                    res.send(foundArticle);
                }
                else
                {
                    res.send(req.params.topic + " is not in our Database");
                }
            }
        });
    })

    .put(function(req,res){
        Article.replaceOne(
            {title: req.params.topic},
            //req.body, 1st method
            {title: req.body.title, content: req.body.content}, //2nd method
            function(err){
                if(!err)
                {
                    res.send("document replaced Successfully");
                }
                else
                {
                    console.log(err);
                }
            });
    })

    .patch(function(req,res){
          Article.updateOne(
              {title: req.params.topic},
              req.body,
              function(err){
                  if(!err)
                  {
                      res.send("document updated successfully");
                  }
                  else
                  {
                      res.send(err);
                  }
              }
          );
    })

    .delete(function(req,res){
        Article.deleteOne(
            {title: req.params.topic},
            function(err){
                if(!err)
                {
                    res.send("document deleted successfully");
                }
                else
                {
                    console.log(err);
                }
        });
    })

app.listen(3000,function(){
    console.log("server has started successfully");
})