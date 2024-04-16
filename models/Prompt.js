const mongoose = require('mongoose')


const Prompt = new mongoose.Schema({

    //title of a story
    title: {
        type: String,
        required: true
    },

    //description: a description of what the outine of the story is 
    description: {
        type: String
    },

    story_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Story"
    },

    creator: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },

    date_of_creation: {
        type: Date
    }
})

module.exports = mongoose.model("Prompt", Prompt)