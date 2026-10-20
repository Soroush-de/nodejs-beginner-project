const { MongoClient, ObjectId } = require("mongodb");

const client = new MongoClient(
  process.env.MONGO_URL || "mongodb://127.0.0.1:27017",
);
const DB_NAME = process.env.DB_NAME || "nodejs_first_project";
async function connectToMongo() {
  try {
    await client.connect();
    const db = client.db(DB_NAME);
    return db;
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    throw error;
  }
}
module.exports = { connectToMongo, ObjectId };
