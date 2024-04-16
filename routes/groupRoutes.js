const express = require("express")
const router = express.Router()

const group = require("../Controllers/groupsControllers")



router.post("/create", group.create)

module.exports = router