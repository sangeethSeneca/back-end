const express = require("express");

const { MongoClient } = require("mongodb");
const uri =
  "mongodb+srv://eperera:TshuWCsp8heOzDpl@ahead-capstone.af6smvw.mongodb.net/";
const client = new MongoClient(uri, { useUnifiedTopology: true });
client.connect((err) => {
  if (err) {
    console.error("Error connecting to MongoDB:", err);
    return;
  }
  console.log("Connected to MongoDB");
});

module.exports = client;
