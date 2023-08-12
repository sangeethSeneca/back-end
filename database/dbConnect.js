const { MongoClient } = require("mongodb");
const connectionString =
  "mongodb+srv://eperera:TshuWCsp8heOzDpl@ahead-capstone.af6smvw.mongodb.net/";
async function connectDB() {
  const client = await MongoClient.connect(connectionString, {
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 10000,
  });
  const db = client.db("evistra"); // Replace 'your_db_name' with the actual name of your database

  // Now, you can perform operations on the database

  // Example: querying a collection
  return db;
}

module.exports = connectDB;
