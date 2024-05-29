const Group = require('./../models/Group.js')
const {validationResult} = require('express-validator')
const responsMsg = require('./../utilities/responseMsgs.js')
const getUserDataFromToken = require('./../utilities/getUserDataFromToken.js')

let addNewGroup = async(req,res)=>{
    try{
        let validationErrors = validationResult(req)
        if(validationErrors.errors.length != 0 ){
            throw(validationErrors.errors)
        }else{
            let newGroupData = await req.body
            let userData = await getUserDataFromToken(req.cookies.jwt)
            let newGroup = await new Group({
                groupDiploma : newGroupData.groupDiploma,
                groupName : newGroupData.groupName,
                groupStart : newGroupData.groupStart,
                groupCreatedAt : Date.now(),
                groupCreatedBy : {
                    _id : userData._id,
                    name : userData.name
                },
                groupStudents : newGroupData.groupStudents,
                groupSessions : newGroupData.groupSessions
            })

            let done = await newGroup.save()
            if(done.groupName != newGroup.groupName){
                throw('Something Went Wrong, Please Try Again')
            }else{
                res.status(200).json({
                    status : responsMsg.SUCCESS,
                    data : done
                })
            }
        }
    }catch(er){
        let errors ;

        if(er.message){
            errors = er.message
        }else if(er[0]?.location){
            errors = er.map((r)=>r.msg)
        }else{
            errors = er
        }

        res.status(400).json({
            status : responsMsg.FAIL,
            data : errors
        })
    }
    res.end()
}

let getAllGroups = async(req,res)=>{
    try{
        let allGroups = await Group.find()
        res.status(200).json({
            status : responsMsg.SUCCESS,
            data : allGroups
        })
    }catch(er){
        console.log(er)
        res.status(400).json({
            status: responsMsg.FAIL,
            data : "Something Went Wrong"
        })
    }
}

let getSingleGroup = async(req,res)=>{
    try{
        let groupId = await req.params.id
        let intendedGroup = await Group.findOne({_id : groupId})
        res.status(200).json({
            status : responsMsg.SUCCESS,
            data : intendedGroup || "No Group Found"
        })
    }catch(er){
        console.log(er)
        res.status(400).json({
            status : responsMsg.FAIL,
            data : er.message || "Something Went Wrong"
        })
    }
}

let updateGroup = async(req,res)=>{
    try{
        let groupId = await req.params.id
        let newStartDate = await req.body.startDate
        if(!newStartDate){
            throw("Please Enter A Start Date")
        }else{
            let upd = await Group.updateOne({_id : groupId},{
                groupStart : newStartDate
            })
            console.log(upd)
            if(upd.matchedCount == 0){
                throw("Group Not FOund")
            }else{
                if(upd.modifiedCount == 0){
                    throw("Nothing Updated")
                }else{
                    res.status(200).json({
                        status : responsMsg.SUCCESS,
                        data : "Updated Successfully"
                    })
                }
            }
        }
    }catch(er){
        console.log(er)
        res.status(400).json({
            status : responsMsg.FAIL,
            data : er?.message || er
        })
    }
}

let deleteGroup = async(req,res)=>{
    try{
        let groupId = await req.params.id
        let del = await Group.deleteOne({_id : groupId})
        console.log(del)
        if(del.deletedCount != 1){
            throw("Group Not Found")
        }else{
            res.status(200).json({
                status : responsMsg.SUCCESS,
                data : "Deleted Successfully"
            })
        }
    }catch(er){
        console.log(er)
        res.status(400).json({
            status : responsMsg.FAIL,
            data : er?.message || er
        })
    }
}


let diplomaGroups = async(req,res)=>{
    try{
        let diplomaName = await req.params.diplomaName
        let groups = await Group.find({groupDiploma : diplomaName})

        res.status(200).json({
            status : responsMsg.SUCCESS,
            data : groups
        })
    }catch(er){
        console.log(er)
        res.status(400).json({
            status : responsMsg.FAIL,
            data : er.message || er
        })
    }
}

module.exports = {
    addNewGroup,
    getAllGroups,
    getSingleGroup,
    updateGroup,
    deleteGroup,
    diplomaGroups
}