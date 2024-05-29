const mongoose = require('mongoose')

const diplomaSchema = mongoose.Schema({
    diplomaName : {type : String, required: true},
    diplomaPrice : {type : Number, required : true},
    diplomaCreatedBy : {
        _id : String,
        name : String
    } ,
    diplomaCreatedAt : Date
})

const diplomaModel = mongoose.model('Diploma',diplomaSchema)

module.exports = diplomaModel