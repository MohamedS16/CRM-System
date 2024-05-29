const mongoose = require('mongoose')

const groupSchema = mongoose.Schema({
    groupDiploma : String,
    groupName : String,
    groupStart : Date,
    groupCreatedAt : Date,
    groupCreatedBy : {
        _id : String,
        name : String
    },
    groupStudents : {type : Number, default : 0},
    groupSessions : Number,
    groupCurrentSession : {type : Number , default : 0}
})

const groupModel = mongoose.model('Group',groupSchema)

module.exports = groupModel