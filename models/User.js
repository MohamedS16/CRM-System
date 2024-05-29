const mongoose = require('mongoose')

const userSchema = mongoose.Schema({
    name : String,
    email : String,
    password : String,
    phone : String,
    role: String,
    diploma : String,
    group: String,
    createdAt : Date,
    createdBy : {
        _id : String,
        name : String
    }
})

const userModel = mongoose.model('User',userSchema)

module.exports = userModel