const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/fruitsDB');

const fruitSchema = new mongoose.Schema({
  name: String,
  rating: Number,
  review: String
});

const Fruit = mongoose.model('Fruit', fruitSchema);

const kiwi = new Fruit({
  name: "Kiwi",
  rating: 7,
  review: "Tasty and healthy"
});

const orange = new Fruit({
  name: "Orange",
  rating: 6,
  review: "Citrusy and refreshing"
});

const banana = new Fruit({
  name: "Banana",
  rating: 9,
  review: "Soft and sweet"
});

async function insertFruits() {
  try {
    await Fruit.insertMany([kiwi, orange, banana]);
    console.log("Successfully saved all fruits to fruitsDB");
  } catch (err) {
    console.error(err);
  } finally {
    mongoose.connection.close(); // Optional: close DB connection
  }
}

insertFruits();