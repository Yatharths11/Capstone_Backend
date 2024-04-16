const mongoose = require("mongoose")
const Story = require("../models/Story");
const Users = require("../models/User")
const Prompt = require("../models/Prompt")

const Group_Schema = new mongoose.Schema({

    creatorId:{
        type: mongoose.Schema.ObjectId,
        ref: "Users"
    },
    storyId:{
        type: mongoose.Schema.ObjectId,
        ref: "Story",
        required: true
    },
    collaborators :[{
        type: mongoose.Schema.ObjectId,
        ref: "Users" 
    }]

})


module.exports = mongoose.model("Group", Group_Schema)