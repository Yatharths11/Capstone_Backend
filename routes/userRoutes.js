// external imports
const express = require("express")
const router = express.Router()

// internal imports
const usersController = require("../Controllers/usersControllers")
const { register, login } = require("../Controllers")

// routes
router.post("/register", usersController.register)
router.get("/profile", usersController.profile)
router.put("/updateProfile", usersController.updateProfile)
router.delete("/delete", usersController.deleteUser)
router.get("/getmygroups", usersController.getmygroup)

// exports
module.exports = router