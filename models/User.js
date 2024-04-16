const mongoose = require('mongoose')


const Users = new mongoose.Schema({
    
    //unique username
    username:{
        type: String,
        required: true,
        minLength: 6,
        unique: true
    },

    //Email 
    email:{
        type : String,
        required: true,
        unique: true,
        validate: {
            validator: function (value) {
              // Regular expression for basic email validation
              return /^[a-zA-Z0-9]+@[a-zA-Z]+\.(com)$/.test(value)
            },
            message: (props) => `${props.value} is not a valid email!`,
          }
    },

    //hashed password
    password:{
        type:String,
        required:true
    
    },
    
    //array of all the stories that the user has comotributed to...
    contributions:{
        type: [String],
        default: []
    },

    //the stories that the user has created
    created_stories:{
        type: [mongoose.Schema.Types.ObjectId],
        ref: "Stories",
    }
})




module.exports = mongoose.model("User", Users)