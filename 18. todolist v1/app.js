const express = require("express");
const bodyParser = require("body-parser");

const app = express();
const port = 3000;

let items = ["buy food", "cook food", "eat food"];
let workItems = [];

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.set("view engine", "ejs");

app.get("/", (req, res) => {
  let today = new Date();

  let options = {
    weekday: "long",
    day: "numeric",
    month: "long",
  };

  let day = today.toLocaleDateString("en-US", options);

  res.render("list", { listTitle: day, items: items });
});

app.post("/", (req, res) => {
  let item = req.body.newItem;

  if (req.body.list === "Work List") {
    workItems.push(item);
    res.redirect("/work");
  } else {
    items.push(item);
    res.redirect("/");
  }
});

app.get("/work", (req, res) => {
  res.render("list", { listTitle: "Work List", items: workItems });
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
