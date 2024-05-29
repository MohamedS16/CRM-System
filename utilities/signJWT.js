const jwt = require('jsonwebtoken')


const signJWT = async(payload)=>{
    let token = await jwt.sign(payload,process.env.JWT)

    return token
}




module.exports = signJWT