//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const app = express();

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

// Connect to MongoDB
// Use .then() and .catch() for Promise-based connection handling
mongoose
  .connect("mongodb://localhost:27017/todolistDB", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB Connected Successfully!"))
  .catch((err) => console.error("MongoDB Connection Error:", err));

const itemSchema = {
  name: String,
};

const Item = mongoose.model("Item", itemSchema);

const item1 = new Item({
  name: "Welcome to your todo list!",
});
const item2 = new Item({
  name: "Hit the + button to add a new item.",
});
const item3 = new Item({
  name: "<-- Hit this to delete an item.",
});
const defaultItems = [item1, item2, item3];

// --- IMPORTANT: This is where the 'await' error often occurs if not handled correctly ---
// Use an immediately invoked async function (IIAFE) to handle initial database operations
// that use 'await' at the application startup.
(async () => {
  try {
    // Check if the collection is empty before inserting default items
    const existingItemsCount = await Item.countDocuments({}); // 'await' is valid here
    if (existingItemsCount === 0) {
      await Item.insertMany(defaultItems); // 'await' is valid here
      console.log("Default items added successfully.");
    } else {
      console.log("Default items already exist, skipping insertion.");
    }
  } catch (err) {
    console.error("Error during default item insertion:", err);
  }
})();
// --- END of IIAFE for initial setup ---

// All route handlers using 'await' MUST be marked 'async'
app.get("/", async function (req, res) {
  // <-- Marked as async
  try {
    const foundItems = await Item.find({}); // 'await' is valid here because the function is async

    if (foundItems.length === 0) {
      // If no items found, insert default items
      await Item.insertMany(defaultItems); // 'await' is valid here
      console.log("Default items added successfully (on first visit)."); // After inserting, retrieve them again or use the defaultItems directly
      res.render("list", { listTitle: "Today", newListItems: defaultItems });
    } else {
      res.render("list", { listTitle: "Today", newListItems: foundItems });
    }
  } catch (err) {
    console.error("Error retrieving or inserting items for today's list:", err);
    res.status(500).send("An error occurred while loading your todo list.");
  }
});

app.post("/", async function (req, res) {
  // <-- Marked as async
  const itemName = req.body.newItem;
  const listType = req.body.list;

  const newItem = new Item({
    name: itemName,
  });

  try {
    await newItem.save(); // 'await' is valid here // Reminder: Your current database schema doesn't differentiate between "Today" and "Work List" // items. For proper persistence for different lists, you would typically add // a 'listType' field to your itemSchema and filter based on that.

    if (listType === "Work List") {
      res.redirect("/work");
    } else {
      res.redirect("/");
    }
  } catch (err) {
    console.error("Error saving new item:", err);
    res.status(500).send("Error adding new item to the list.");
  }
});

app.post("/delete", async function (req, res) {
  // <-- Marked as async
  const checkedItemId = req.body.checkbox; // ID of the item to delete

  try {
    await Item.findByIdAndDelete(checkedItemId); // <-- CORRECTED LINE: Changed to findByIdAndDelete
    console.log("Item deleted successfully.");
    res.redirect("/"); // Redirect to the main list after deletion
  } catch (err) {
    console.error("Error deleting item:", err);
    res.status(500).send("Error deleting item from the list.");
  }
});

app.get("/work", async function (req, res) {
  // <-- Marked as async, good practice for potential future DB calls
  // If you had a 'listType' field in your schema, you would query like:
  // const workItems = await Item.find({ listType: "Work" });
  // For now, it will render an empty list as there's no distinction in DB.
  res.render("list", { listTitle: "Work List", newListItems: [] }); // Or fetch specific work items if your schema supports it
});

app.get("/about", function (req, res) {
  res.render("about");
});

app.listen(3000, function () {
  console.log("Server started on port 3000");
});
