const express = require("express")
const router = express.Router()

const likesControllers = require("../Controllers/likesControllers")


//api that toggles the like status of a story
router.post("toggle", likesControllers.togglelike)

module.exports = router