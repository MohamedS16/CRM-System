const mongoose = require('mongoose')

const sessionSchema = mongoose.Schema({
    sessionDiploma : String,
    sessionGroup : String,
    sessionCreatedAt : Date,
    sessionCreatedBy : {
        _id : String,
        name : String
    },
    sessionName : String,
    sessionMaterial : String,
    sessionAssignment : String,
    sessionQuestion : String,
    sessionAttendence : Array
})

const sessionModel = mongoose.model('Session',sessionSchema)

module.exports = sessionModel