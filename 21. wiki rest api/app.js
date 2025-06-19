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

// Request targeting all articles
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

// Request targeting a specific article
app
  .route("/articles/:articleTitle")
  .get(async function (req, res) {
    try {
      const requestedTitle = req.params.articleTitle;
      const foundArticle = await Article.findOne({ title: requestedTitle });

      if (foundArticle) {
        res.send(foundArticle);
      } else {
        res.status(404).send("No article matching that title was found.");
      }
    } catch (err) {
      console.error(err);
      res.status(500).send("An error occurred while fetching the article.");
    }
  })
  .put(async function (req, res) {
    try {
      const result = await Article.replaceOne(
        { title: req.params.articleTitle },
        { title: req.body.title, content: req.body.content }
      );

      if (result.modifiedCount > 0) {
        res.send("Successfully updated the article.");
      } else {
        res.status(404).send("Article not found or no changes made.");
      }
    } catch (err) {
      console.error(err);
      res.status(500).send("Failed to update the article.");
    }
  })
  .patch(async function (req, res) {
    try {
      const result = await Article.updateOne(
        { title: req.params.articleTitle },
        { $set: req.body }
      );

      if (result.modifiedCount > 0) {
        res.send("Successfully updated the article.");
      } else {
        res.status(404).send("Article not found or no changes made.");
      }
    } catch (err) {
      console.error(err);
      res.status(500).send("Failed to update the article.");
    }
  })
  .delete(async function (req, res) {
    try {
      const result = await Article.deleteOne({
        title: req.params.articleTitle,
      });

      if (result.deletedCount > 0) {
        res.send("Successfully deleted the article.");
      } else {
        res.status(404).send("No article matching that title was found.");
      }
    } catch (err) {
      console.error(err);
      res.status(500).send("Failed to delete the article.");
    }
  });

app.listen(3000, function () {
  console.log("Server started on port 3000");
});
