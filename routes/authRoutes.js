// external imports
const express = require("express")
const router = express.Router()

// internal imports
const authController = require("../Controllers/authControllers")

// routes
router.post("/login", authController.login)
router.post("/logout", authController.logout)

module.exports = router