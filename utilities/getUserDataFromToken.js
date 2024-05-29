const decodeToken = require('./decodeJWT.js')
const User = require('./../models/User.js')

let getUserDataFromToken = async(token)=>{
    let tokenData = await decodeToken(token)
    let userData = await User.findOne({_id : tokenData.userID}).select(['_id','name','role'])
    console.log(userData)

    return userData
}

module.exports = getUserDataFromToken