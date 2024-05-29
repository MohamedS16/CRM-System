const User = require('./../models/User.js')
const signJWT = require('./../utilities/signJWT.js')
const responseMsg = require('./../utilities/responseMsgs.js')
const bcrypt = require('bcrypt')

let userLogin = async(req,res)=>{
    try{
        let credentials = await req.body
        if(!credentials.email || !credentials.password){
            throw("Please Enter Email and Password")
        }else{
            let checkUser = await User.findOne({email : credentials.email})
            if(!checkUser){
                throw("User Not Found")
            }else{
                let checkPassword = await bcrypt.compare(credentials.password,checkUser.password)
                if(!checkPassword){
                    throw("Wrong Password")
                }else{
                    let token = await signJWT({
                        userID : checkUser._id,
                        role : checkUser.role
                    })
                    res.status(200).cookie('jwt',token).json({
                        status : responseMsg.SUCCESS,
                        data : token
                    })
                }
            }
        }
    }catch(er){
        console.log(er)
        res.status(400).json({
            status : responseMsg.FAIL,
            data : er.message || er
        })
    }
}

let logOut = async(req,res)=>{

        res.status(200).clearCookie('jwt').json({
            status : "Logged Out"
        })

}

module.exports = {
    userLogin,
    logOut
}