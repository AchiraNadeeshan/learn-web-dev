//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const _ = require("lodash");

const app = express();

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

// Connect to MongoDB
// Use .then() and .catch() for Promise-based connection handling
mongoose
  .connect(
    "mongodb+srv://admin-achira:Test123@cluster0.qotralt.mongodb.net/todolistDB?retryWrites=true&w=majority&appName=Cluster0" // <-- Updated URI (suggestion)
  )
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

const listSchema = {
  name: String,
  items: [itemSchema], // Array of Item documents
};
const List = mongoose.model("List", listSchema);

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
  try {
    const foundItems = await Item.find({});

    if (foundItems.length === 0) {
      await Item.insertMany(defaultItems);
      console.log("Default items added successfully (on first visit).");
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
  const itemName = req.body.newItem;
  const listName = req.body.list; // This name comes from the button's 'name="list"' attribute

  const newItem = new Item({
    name: itemName,
  });

  try {
    // Check if the item is for a custom list or the default "Today" list
    if (listName && listName !== "Today") {
      // Find the custom list
      const foundList = await List.findOne({ name: listName });
      if (foundList) {
        foundList.items.push(newItem); // Add the new item to the list's items array
        await foundList.save(); // Save the updated list
        res.redirect("/" + listName); // Redirect to the custom list
      } else {
        // If the custom list doesn't exist (e.g., user typed a URL that doesn't exist yet,
        // or a form submission for a non-existent list), handle accordingly.
        console.log(`List '${listName}' not found when trying to add item.`);
        res.redirect("/");
      }
    } else {
      // It's for the default "Today" list (or if listName is undefined/empty)
      await newItem.save(); // Save to the default Item collection
      res.redirect("/");
    }
  } catch (err) {
    console.error("Error saving new item:", err);
    res.status(500).send("Error adding new item to the list.");
  }
});

app.post("/delete", async function (req, res) {
  const checkedItemId = req.body.checkbox; // ID of the item to delete
  const listName = req.body.listName; // Assuming you'll pass listName from a hidden input in the form

  try {
    if (listName === "Today") {
      await Item.findByIdAndDelete(checkedItemId);
      console.log("Default list item deleted successfully.");
      res.redirect("/");
    } else {
      // If it's a custom list, find the list and pull the item from its items array
      await List.findOneAndUpdate(
        { name: listName },
        { $pull: { items: { _id: checkedItemId } } }
      );
      console.log("Custom list item deleted successfully.");
      res.redirect("/" + listName);
    }
  } catch (err) {
    console.error("Error deleting item:", err);
    res.status(500).send("Error deleting item from the list.");
  }
});

app.get("/:customListName", async function (req, res) {
  const customListName = _.capitalize(req.params.customListName);

  try {
    const foundList = await List.findOne({ name: customListName });

    if (!foundList) {
      console.log("List not found, creating a new one.");
      const list = new List({
        name: customListName,
        items: defaultItems, // Initialize with default items
      });
      await list.save();
      res.render("list", {
        listTitle: customListName,
        newListItems: list.items,
      });
    } else {
      console.log("List found.");
      res.render("list", {
        listTitle: foundList.name,
        newListItems: foundList.items,
      });
    }
  } catch (err) {
    console.error("Error accessing or creating custom list:", err);
    res.status(500).send("An error occurred while loading your custom list.");
  }
});

app.get("/about", function (req, res) {
  res.render("about");
});

let port = process.env.PORT;
if (port == null || port == "") {
  port = 3001; // Default to port 3000 if not set
}
// Listen on the determined port
app.listen(port, function () {
  console.log(`Server started successfully on port ${port}`); // Updated console log
});