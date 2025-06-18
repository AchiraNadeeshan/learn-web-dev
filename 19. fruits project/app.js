const mongoose = require("mongoose");

mongoose.connect("mongodb://localhost:27017/fruitsDB");

// const fruitSchema = new mongoose.Schema({
//   name: String,
//   rating: Number,
//   review: String,
// });

// const Fruit = mongoose.model("Fruit", fruitSchema);

// const kiwi = new Fruit({
//   name: "Kiwi",
//   rating: 7,
//   review: "Tasty and healthy",
// });

// const orange = new Fruit({
//   name: "Orange",
//   rating: 6,
//   review: "Citrusy and refreshing",
// });

// const banana = new Fruit({
//   name: "Banana",
//   rating: 9,
//   review: "Soft and sweet",
// });

// async function run() {
//   try {
//     await Fruit.insertMany([kiwi, orange, banana]);
//     console.log("Successfully saved all fruits to fruitsDB");

//     const fruits = await Fruit.find();
//     fruits.forEach(fruit => console.log(fruit.name));
//   } catch (err) {
//     console.error(err);
//   } finally {
//     mongoose.connection.close();
//   }
// }

// run();

// async function getFruits() {
//   try {
//     const fruits = await Fruit.find();
//     fruits.forEach(fruit => console.log(fruit.name));
//   } catch (err) {
//     console.error(err);
//   } finally {
//     mongoose.connection.close();
//   }
// }

// getFruits();

// async function updateBanana() {
//   try {
//     const result = await Fruit.updateOne({ name: "Banana" }, { rating: 10 });
//     console.log("Successfully updated the document:", result);
//   } catch (err) {
//     console.error(err);
//   } finally {
//     mongoose.connection.close();
//   }
// }

// updateBanana();


// async function deleteFruit() {
//   try {
//     await Fruit.deleteOne({ name: "Banana" });
//     console.log("Successfully deleted the document.");
//   } catch (err) {
//     console.error(err);
//   } finally {
//     mongoose.connection.close(); // Optional: Close DB connection
//   }
// }

// deleteFruit();

// Fruit.deleteOne({ name: "Banana" })
//   .then(() => {
//     console.log("Successfully deleted the document.");
//   })
//   .catch(err => {
//     console.error(err);
//   });


person.deleteOne