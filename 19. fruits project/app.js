const { MongoClient } = require("mongodb");

const uri = "mongodb://localhost:27017";

const client = new MongoClient(uri);  

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
run().catch(console.dir);