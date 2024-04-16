const express = require("express")
const router = express.Router()

const { togglelikes } = require("../Controllers/likesControllers")


//api that toggles the like status of a story
router.post("toggle", togglelikes)

module.exports = router