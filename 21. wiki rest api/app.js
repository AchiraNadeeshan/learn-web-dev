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

app.get("/articles", async function (req, res) {
  try {
    const foundArticles = await Article.find();
    res.send(foundArticles);
  } catch (err) {
    console.error(err);
    res.status(500).send("An error occurred while fetching articles.");
  }
});


app.listen(3000, function () {
  console.log("Server started on port 3000");
});
