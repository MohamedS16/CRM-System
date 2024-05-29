let userSession = require('./../models/Usession.js')
let Session = require('./../models/Session.js')
let responseMsg = require('./../utilities/responseMsgs.js')
let {validationResult} = require('express-validator')
const getUserDataFromToken = require('./../utilities/getUserDataFromToken.js')

let addNewUserSession = async (req,res)=>{
    try{
        let validationErrors = validationResult(req)
        if(validationErrors.errors.length != 0){
            throw(validationErrors.errors)
        }else{

        let newuserSessionData = await req.body
        let sessionId = await req.params.sessionid

        let checkSession = await Session.findOne({_id: sessionId})
        if(!checkSession){
            throw('Session Not Found')
        }else{
            let pastSession = await userSession.findOne({sessionId : sessionId, userId : userId})
        if(pastSession){
            throw('Session Already Sent')
        }else{

        let attended = await Session.findOne({_id : sessionId}).select('sessionAttendence')
        let attendenceArray = attended.sessionAttendence
        let hasAttended = attendenceArray.find((e)=>{
            if(e == userId){
                return e
            }
        })
        let userData = await getUserDataFromToken(req.cookies.jwt)
        let add = await new userSession({
            sessionId : sessionId,
            userId : userData._id,
            assignment : newuserSessionData.assignment,
            question: newuserSessionData.question,
            feedback: newuserSessionData.feedback,
            attended: hasAttended ? true : false
        })

        let done = await add.save()
        if(done.feedback != newuserSessionData.feedback){
            throw('Something went Wrong')
        }else{
            res.status(200).json({
                status : responseMsg.SUCCESS,
                data : done
            })
        }
    }}

        }
        

    }catch(er){
        console.log(er)
        let errorsArray;
        if(er.message){
            errorsArray = er.message
        }else if(er[0]?.location){
            errorsArray = er.map((r)=>r.msg)
        }else{
            errorsArray = er
        }

        res.status(400).json({
            status : responseMsg.FAIL,
            data : errorsArray
        })
    }
}

let getUserSession = async(req,res)=>{
    try{
        let userSessionId = await req.params.usersessionid
        let intendedUserSession = await userSession.findOne({_id : userSessionId})

        if(!intendedUserSession){
            throw('User Session Not Found')
        }else{
            let userData = await getUserDataFromToken(req.cookies.jwt)
            if(userData.role != '1a' && userData.role != '2i' && userData._id != intendedUserSession.userId){
                throw('Not Allowed')
            }else{
                res.status(200).json({
                    status : responseMsg.SUCCESS,
                    data : intendedUserSession
                })
            }
        }
    }catch(er){
        console.log(er)
        res.status(400).json({
            status : responseMsg.FAIL,
            data : er.message ? er.message : er
        })
    }
}

let updateUserSession = async(req,res)=>{
    try{
        let sessionId = await req.params.usersessionid
        let findSession = await userSession.findOne({_id : sessionId})

        let userData = await getUserDataFromToken(req.cookies.jwt)
        if(userData._id != findSession.userId){
            throw("You Are Not Allowed To Edit This Session")
        }else{
            
        
        if(!findSession){
            throw('Session Not Found')
        }else{
            if(findSession.comment){
                throw("Can't Edit Session after Being Reviewed")
            }else{
                let validationErrors = validationResult(req)
                if(validationErrors.errors.length != 0){
                    throw(validationErrors.errors)
                }else{
                    let newData = await req.body
                    let upd = await userSession.updateOne({_id : sessionId},{
                        assignment : newData.assignment,
                        question : newData.question,
                        feedback : newData.feedback,
                        comment : newData.comment,
                    })

                    if(upd.modifiedCount == 0){
                        throw('Nothing Updated')
                    }else{
                        res.status(200).json({
                            status : responseMsg.SUCCESS,
                            data : newData
                        })
                    }
                }
            }}
        }
    }catch(er){
        console.log(er)
        let errorsArray;
        if(er.message){
            errorsArray = er.message
        }else if(er[0]?.location){
            errorsArray = er.map((r)=>r.msg)
        }else{
            errorsArray = er
        }

        res.status(400).json({
            status : responseMsg.FAIL,
            data : errorsArray
        })
    }
}

module.exports = {
    addNewUserSession,
    getUserSession,
    updateUserSession
}