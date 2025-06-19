//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");

const app = express();

app.set("view engine", "ejs");

app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/wikiDB");
const articleSchema = {
  title: String,
  content: String,
};
const Article = mongoose.model("Article", articleSchema);

app
  .route("/articles")
  .get(async function (req, res) {
    try {
      const foundArticles = await Article.find();
      res.send(foundArticles);
    } catch (err) {
      console.error(err);
      res.status(500).send("An error occurred while fetching articles.");
    }
  })
  .post(async function (req, res) {
    try {
      const newArticle = new Article({
        title: req.body.title,
        content: req.body.content,
      });

      await newArticle.save(); // Await the save operation

      res.status(201).send("Successfully added the new article.");
    } catch (err) {
      console.error(err);
      res.status(500).send("Failed to add the article.");
    }
  })
  .delete(async function (req, res) {
    try {
      await Article.deleteMany({});
      res.status(200).send("Successfully deleted all articles.");
    } catch (err) {
      console.error(err);
      res.status(500).send("Failed to delete articles.");
    }
  });

app.listen(3000, function () {
  console.log("Server started on port 3000");
});
