const Prompt = require("../models/Prompt")
const { decodeToken } = require("../utility/utility")
// const User = require('../models/User')

const getprompt = async (req,res)=>{
    const prompt = await Prompt.findById(req.query.id)
    res.status(200).json({prompt:prompt})
}

module.exports = { getprompt}

