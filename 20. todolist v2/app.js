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
  const listName = req.body.list; // Renamed from listType for clarity if it's coming from a form's name attribute

  const newItem = new Item({
    name: itemName,
  });

  try {
    // Check if the item is for a custom list or the default "Today" list
    if (listName && listName !== "Today") { // Assuming "Today" is the default list title from the form
      const foundList = await List.findOne({ name: listName });
      if (foundList) {
        foundList.items.push(newItem);
        await foundList.save();
        res.redirect("/" + listName);
      } else {
        // If list not found, perhaps create it or handle error
        console.log(`List '${listName}' not found when trying to add item.`);
        // For now, redirect to home if custom list not found
        res.redirect("/");
      }
    } else {
      // It's for the default "Today" list
      await newItem.save();
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


// CORRECTED app.get("/:customListName") route
app.get("/:customListName", async function (req, res) {
  const customListName = req.params.customListName;

  try {
    // Use await with List.findOne()
    const foundList = await List.findOne({ name: customListName });

    if (!foundList) {
      // If list not found, create a new one
      console.log("List not found, creating a new one.");
      const list = new List({
        name: customListName,
        items: defaultItems, // Initialize with default items
      });
      await list.save(); // Await the save operation
      res.render("list", { listTitle: customListName, newListItems: list.items });
    } else {
      // List found, render it
      console.log("List found.");
      res.render("list", { listTitle: foundList.name, newListItems: foundList.items });
    }
  } catch (err) {
    console.error("Error accessing or creating custom list:", err);
    res.status(500).send("An error occurred while loading your custom list.");
  }
});

app.get("/about", function (req, res) {
  res.render("about");
});

app.listen(3000, function () {
  console.log("Server started on port 3000");
});