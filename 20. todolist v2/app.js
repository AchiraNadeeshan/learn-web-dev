//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

// Connect to MongoDB
// useNewUrlParser and useUnifiedTopology are recommended for new connections
mongoose.connect("mongodb://localhost:27017/todolistDB", { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.error(err));

const itemSchema = {
  name: String
};

const Item = mongoose.model("Item", itemSchema);

const item1 = new Item({
  name: "Welcome to your todo list!"
});
const item2 = new Item({
  name: "Hit the + button to add a new item."
});
const item3 = new Item({
  name: "<-- Hit this to delete an item."
});
const defaultItems = [item1, item2, item3];

// Use async/await with insertMany as it returns a Promise
(async () => {
  try {
    // Check if there are existing items before inserting defaults
    const existingItems = await Item.find({});
    if (existingItems.length === 0) {
      await Item.insertMany(defaultItems);
      console.log("Default items added successfully.");
    } else {
      console.log("Default items already exist, skipping insertion.");
    }
  } catch (err) {
    console.error("Error inserting default items:", err);
  }
})();

app.get("/", async function(req, res) {
  try {
    const foundItems = await Item.find({});
    res.render("list", {listTitle: "Today", newListItems: foundItems});
  } catch (err) {
    console.error(err);
    res.status(500).send("Error retrieving items.");
  }
});

app.post("/", async function(req, res){
  const itemName = req.body.newItem;
  const listName = req.body.list; // This will likely be the listTitle from the form

  const newItem = new Item({
    name: itemName
  });

  try {
    await newItem.save();
    if (listName === "Work List") {
      // You'll need to implement logic for different lists, e.g., a separate model
      // or a field in the Item schema to differentiate lists.
      // For now, redirecting to home as your current setup doesn't distinguish lists in the DB.
      res.redirect("/work");
    } else {
      res.redirect("/");
    }
  } catch (err) {
    console.error(err);
    res.status(500).send("Error saving item.");
  }
});

// Note: Your current setup for /work and the `workItems` array
// is not persistent with Mongoose. You'll need to modify your schema
// or create a separate model for work items if you want them stored in the database.
// For now, it will simply render the "Work List" title without actual items from DB.
app.get("/work", function(req,res){
  // If you want to fetch items for work list from DB, you'd do it here
  // similar to the "/" route, possibly with a filter if your schema supports it.
  res.render("list", {listTitle: "Work List", newListItems: []}); // No items from DB currently
});

app.get("/about", function(req, res){
  res.render("about");
});

app.listen(3000, function() {
  console.log("Server started on port 3000");
});