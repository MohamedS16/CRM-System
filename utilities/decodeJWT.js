const jwt = require('jsonwebtoken')

let decodeJWT = async(token)=>{
    let decodedData = await jwt.verify(token,process.env.JWT)

    return decodedData
}


module.exports = decodeJWT