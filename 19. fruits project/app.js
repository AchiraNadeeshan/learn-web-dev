const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/fruitsDB');

const fruitSchema = new mongoose.Schema({
  name: String,
  rating: Number,
  review: String
});

const Fruit = mongoose.model('Fruit', fruitSchema);

const fruit = new Fruit({
  name: "Apple",
  rating: 8,
  review: "Sweet and crunchy"
});

fruit.save()









async function run() {
  try {
    const database = client.db("fruitsDB");
    const fruits = database.collection("fruits");

    await fruits.insertOne({ name: "Apple", rating: 8, review: "Sweet and crunchy" });

    const query = { name: "Apple" };
    const fruit = await fruits.findOne(query);

    console.log(fruit);
  } catch (err) {
    console.error(err);
  } finally {
    await client.close();
  }
}
