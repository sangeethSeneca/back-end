const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { MongoClient } = require("mongodb");
const { jwtSecretKey } = require("../modules/common");
const uri =
  "mongodb+srv://eperera:TshuWCsp8heOzDpl@ahead-capstone.af6smvw.mongodb.net/";

const client = new MongoClient(uri, { useUnifiedTopology: true });
const router = express.Router();

client.connect((err) => {
  if (err) {
    console.error("Error connecting to MongoDB:", err);
    return;
  }
  console.log("Connected to MongoDB");
});

// Register Endpoint
router.post("/register", async (req, res) => {
  const { fName, lName, email, phoneNumber, password, userType } = req.body;
  const usersCollection = client.db("evistra").collection("users");

  try {
    // Check if the user already exists
    const existingUser = await usersCollection.findOne({ email });
    if (existingUser) {
      return res
        .status(409)
        .json({ message: "User with this email already exists" });
    }

    // Hash the password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Save the user in the database
    await usersCollection.insertOne({
      fName,
      lName,
      phoneNumber,
      email,
      userType,
      password: hashedPassword,
    });

    // Respond with a success message
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).json({ message: "Something went wrong" });
  }
});

// Sign-in Endpoint
router.post("/signin", async (req, res) => {
  const { email, password } = req.body;
  const usersCollection = client.db("evistra").collection("users");

  try {
    // Check if the user exists
    const validEmailPattern =
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/; // email pattern
    if (typeof email !== "string" || !validEmailPattern.test(email)) {
      return res.status(400).json({ message: "Invalid user input" });
    }

    const user = await usersCollection.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Compare the provided password with the hashed password in the database
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Generate a JWT token
    const token = jwt.sign(
      { userId: user._id, userType: user.userType },
      jwtSecretKey,
      {
        expiresIn: "1h",
      }
    );

    // Respond with the JWT token
    res.status(200).json({
      token,
      userId: user._id,
      userRole: user.userType,
      userName: user.fName,
      contactNumber: user.contactNumber,
    });
  } catch (error) {
    console.error("Error signing in:", error);
    res.status(500).json({ message: "Something went wrong" });
  }
});

module.exports = router;
