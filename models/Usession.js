const mongoose = require('mongoose')

const userSessionSchema = mongoose.Schema({
    sessionId : String,
    userId : String,
    assignment : String,
    question: String,
    feedback: String,
    comment: String,
    attended: Boolean
})

const userSessionModel = mongoose.model('Usession',userSessionSchema)

module.exports = userSessionModel