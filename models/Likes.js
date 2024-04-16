const mongoose = require('mongoose')


const Likes = new mongoose.Schema({
    story_id:{
        type: mongoose.Schema.Types.ObjectId, 
        required: true
    },
    likes: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'Users',
        default: 0,
    }
})


module.exports = new mongoose.model("Likes", Likes)
