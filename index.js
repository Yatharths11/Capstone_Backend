// Import required modules
const express = require("express")
const mongoose = require("mongoose")
const bodyParser = require("body-parser")
const dotenv = require("dotenv")
const cors = require('cors');

// Load environment variables from .env file
dotenv.config()


// Create an instance of the Express application
const app = express()

app.use(bodyParser.json())
app.use(cors({ origin: 'http://localhost:4200' }));

// Define routes
//Auth Routes - Login and Logout
const authRoutes = require("./routes/authRoutes.js")
//User Routes - Register
const userRoutes = require("./routes/userRoutes.js")
//Story Routes- Get All, Get One, Put One
const storyRoutes = require("./routes/storyRoutes.js")
//Prompts Routes  - Add Prompt, Get all prompt for a user by id
const promptRoutes = require("./routes/promptRoutes.js")
// Group Router -  Add to group, 
const groupRoutes = require("./routes/groupRoutes.js");
//Like Routes - Toggle likes for a story
const likeRoutes = require("./routes/likeRoutes.js")

// Connect to MongoDB asynchronously
const connectToMongoDB = async () => {
  try {
    await mongoose.connect(process.env.URI)
    console.log("Connected to MongoDB")
  } catch (error) {
    console.error("Error connecting to MongoDB:", error)
    process.exit(1) // Exit the process if unable to connect
  }
}

app.use("/auth", authRoutes)
app.use("/users", userRoutes)
app.use("/story", storyRoutes)
app.use("/prompt", promptRoutes)
app.use("/group", groupRoutes)
app.use("/likes", likeRoutes)
// Start the server after connecting to MongoDB
const startServer = async () => {
  const port = process.env.PORT || 3000
  app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`)
  })
}

// Call the asynchronous functions
connectToMongoDB().then(startServer)