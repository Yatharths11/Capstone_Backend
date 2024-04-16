const express = require("express")
const router = express.Router()

const prompt = require("../Controllers/promptController")

router.get('/:id',prompt.getprompt)

module.exports =  router; 
