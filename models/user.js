const mongoose = require("mongoose")
const Schem = mongoose.Schema
const userSchem = new Schem({
    nam:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    date:{
        type:Date,
        default:Date.now
    }
})

module.exports = mongoose.model("user",userSchem)