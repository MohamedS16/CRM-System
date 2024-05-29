const Session = require('./../models/Session.js')
const responseMsg = require('./../utilities/responseMsgs.js')
const Group = require('./../models/Group.js')
const {validationResult} = require('express-validator')
const getUserDataFromToken = require('./../utilities/getUserDataFromToken.js')


let addNewSession = async(req,res)=>{
    try{
        let validationErrors = validationResult(req)
        if(validationErrors.errors.length != 0){
            throw(validationErrors.errors)
        }else{
        let newSession = await req.body
        let params = await req.params
        let userData = await getUserDataFromToken(req.cookies.jwt)
        let addSession = await new Session({
            sessionDiploma : params.diploma,
            sessionGroup : params.group,
            sessionCreatedAt : Date.now(),
            sessionCreatedBy : {
                _id : userData._id,
                name : userData.name
            },
            sessionName : newSession.sessionName,
            sessionMaterial : newSession.sessionMaterial,
            sessionAssignment : newSession.sessionAssignment,
            sessionQuestion : newSession.sessionQuestion,
            sessionAttendence : newSession.sessionAttendence
        })
        let done = await addSession.save()

        if(done.sessionGroup != params.group){
            throw("Something Went Wrong, Please Try Again.")
        }else{
            let upd = await Group.updateOne({groupName : params.group},{
                $inc : {groupCurrentSession : 1}
            })

            if(upd.matchedCount != 1){
                throw("Group Not Found")
            }else{
                if(upd.modifiedCount != 1){
                    throw("Nothing Updated")
                }else{
                    res.status(200).json({
                        status : responseMsg.SUCCESS,
                        data : done
                    })
                }
            }
        }}
    }catch(er){
        console.log(er)

        let errorsArray 
        if(er.message){
            errorsArray = er.message
        }else if(er[0]?.location){
            errorsArray = er.map((e)=>e.msg)
        }else{
            errorsArray = er
        }
        res.status(400).json({
            status : responseMsg.FAIL,
            data : errorsArray
        })

    }
}

let updateSession = async(req,res)=>{
    try{
        let validationErrors = validationResult(req)
        if(validationErrors.errors.length != 0){
            throw(validationErrors.errors)
        }else{
            let sessionId = await req.params.id
            let newSessionData = await req.body

            let upd = await Session.updateOne({_id : sessionId},{
                sessionName : newSessionData.sessionName,
                sessionMaterial : newSessionData.sessionMaterial,
                sessionAssignment : newSessionData.sessionAssignment,
                sessionQuestion : newSessionData.sessionQuestion,
                sessionAttendence : newSessionData.sessionAttendence
            })

            if(upd.matchedCount != 1){
                throw("Session Not Found")
            }else{
                if(upd.modifiedCount != 1){
                    throw("Nothing Updated")
                }else{
                    res.status(200).json({
                        status : responseMsg.SUCCESS,
                        data : "Successfully Updated"
                    })
                }
            }
        }
    }catch(er){
        console.log(er)

        let errorsArray 

        if(er.message){
            errorsArray = er.message
        }else if(er[0]?.location){
            errorsArray = er.map((e)=>e.msg)
        }else{
            errorsArray = er
        }

        res.status(400).json({
            status : responseMsg.FAIL,
            data : errorsArray
        })

    }
}

let getSingleSession = async(req,res)=>{
    try{
        let sessionId = await req.params.id
        let intendedSession = await Session.findOne({_id: sessionId})
        res.status(200).json({
            status : responseMsg.SUCCESS,
            data : intendedSession || "Session Not Found"
        })
    }catch(er){
        console.log(er)
        res.status(400).json({
            status : responseMsg.FAIL,
            data : er.message
        })
    }
}

let getAllGroupSessions = async(req,res)=>{
    try{
        let groupName = await req.params.name
        let intendedSessions = await Session.find({sessionGroup : groupName})
        res.status(200).json({
            status : responseMsg.SUCCESS,
            data : intendedSessions
        })
    }catch(er){
        console.log(er)
        res.status(400).json({
            status : responseMsg.FAIL,
            data : "Something Went Wrong"
        })
    }
}

module.exports = {
    addNewSession,
    updateSession,
    getSingleSession,
    getAllGroupSessions
}




