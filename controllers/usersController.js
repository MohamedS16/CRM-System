const User = require('./../models/User.js')
const {validationResult} = require('express-validator')
const bcrypt = require('bcrypt')
const responseMsg = require('./../utilities/responseMsgs.js')
const Diploma = require('./../models/Diploma.js')
const Group = require('./../models/Group.js')
const incrementGroupStudents = require('./../utilities/incrementGroupStudents.js')
const checkGroup = require('../utilities/checkGroup.js')
const getUserDataFromToken = require('./../utilities/getUserDataFromToken.js')


let registerUser = async(req,res)=>{
    try{
        let validationErrors = validationResult(req)
        if(validationErrors.errors.length != 0){
            throw(validationErrors.errors)
        }else{
            let newUserData = await req.body
            let checkedGroup;

            if(newUserData.role === '3s' && !newUserData.group){
                throw('Student Must Have a Group')
            }else{
                if(newUserData.role === '3s'){
                    checkedGroup = await checkGroup(newUserData.group)
                    if(checkedGroup == "Group Not Found"){
                        throw(checkedGroup)
                    }
                }
                        let hashedPass = await bcrypt.hash(newUserData.password,5)
                        let userData = await getUserDataFromToken(req.cookies.jwt)
                        let addNewUser = await new User({
                            name : newUserData.name,
                            email : newUserData.email,
                            password : hashedPass,
                            phone : newUserData.phone,
                            role: newUserData.role,
                            diploma : checkedGroup?.groupDiploma,
                            group: newUserData.group,
                            createdAt : Date.now(),
                            createdBy : {
                                _id : userData._id,
                                name : userData.name
                            }
                        })
                        let done =await  addNewUser.save()
                        if(done.email != newUserData.email){
                            throw('Something went wrong')
                        }else{
                            if(done.role === '3s'){
                                incrementGroupStudents(done.group,1)
                            }
                            res.status(200).json({
                                status : responseMsg.SUCCESS,
                                data : done
                            })
                        }
                    }}
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
            status : responseMsg.ERROR,
            data : errorsArray
        })
    }
}

let getAllUsers = async(req,res)=>{
    try{
        let type = await req.params.type
        let dbRole;
        if(type === 'admins'){
            dbRole = '1a'
        }else if(type === 'instructors'){
            dbRole = '2i'
        }else if(type === 'students'){
            dbRole = '3s'
        }else{
            throw('Please Enter a valid type')
        }
        let intendedUsers = await User.find({role : dbRole })
        res.status(200).json({
            status : responseMsg.SUCCESS,
            data : intendedUsers
        })
    }catch(er){
        console.log(er)
        res.status(400).json({
            status : responseMsg.FAIL,
            data : er.message ? er.message : er
        })
    }
}

let deleteUser = async(req,res)=>{
    try{
        let userID = req.params.id
        let checkAdmin = await User.findById(userID)
        if(!checkAdmin){
            throw('User Not Found')
        }else{
            if(checkAdmin.role === '1a'){
                throw("Admins Can't Be Deleted")
            }else{
                let del = await User.findByIdAndDelete(userID)
                console.log(del)
                if(del._id != userID){
                    throw('Something Went Wrong')
                }else{
                    if(checkAdmin.role == '3s'){
                        incrementGroupStudents(checkAdmin.group,-1)
                    }
                    res.status(200).json({
                        status : responseMsg.SUCCESS,
                        data : "Deleted Successfully"
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

let updateUserPassword = async(req,res)=>{
    try{
        let userId = await req.params.id
        let newUserPassword = await req.body.password
        let intendedUser = await User.findOne({_id : userId})

        if(!intendedUser){
            throw('User Not Found')
        }else{
            if(!newUserPassword){
                throw("Please Enter A Password")
            }else{
                let hashedPass = await bcrypt.hash(newUserPassword,5)
                let upd = await User.updateOne({_id : userId},
                    {
                        password : hashedPass
                    })
                if(upd.modifiedCount != 1){
                    throw("Nothing Updated, Please Try Again")
                }else{
                    res.status(200).json({
                        status : responseMsg.SUCCESS,
                        data : "Updated Successfully"
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

let updateUserGroup = async(req,res)=>{
    try{
        let userId = await req.params.id
        let newUserData = await req.body
        let intendedUser = await User.findOne({_id : userId,role : '3s'})
        let checkedGroup;
        if(!intendedUser){
            throw('Student Not Found')
        }else{
            checkedGroup = await checkGroup(newUserData.group)
            if(checkedGroup == "Group Not Found"){
                throw('Group Not Found')
            }else{
                let upd = await User.updateOne({_id : userId},{
                    diploma : checkedGroup.groupDiploma,
                    group: newUserData.group
                })

            if(upd.modifiedCount != 1){
                throw("Nothing Updated, Please Try Again")
            }else{
                    let inc = await incrementGroupStudents(intendedUser.group,-1)
                    if(inc != 'Done' ){
                        throw(inc)
                    }else{
                        inc = await incrementGroupStudents(newUserData.group, 1)
                        if(inc != 'Done'){
                            throw(inc)
                        }
                    }
                res.status(200).json({
                    status : responseMsg.SUCCESS,
                    data : "Updated Successfully"
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


let getUser = async(req,res)=>{
    try{
        let userData = await getUserDataFromToken(await req.cookies.jwt)
        res.status(200).json({
            status : responseMsg.SUCCESS,
            data : userData 
        })
    }catch(er){
        console.log(er)
        res.status(400).json({
            status : responseMsg.FAIL,
            data: er.message || er
        })
    }
} 

module.exports = {
    registerUser,
    getAllUsers,
    deleteUser,
    updateUserPassword,
    updateUserGroup,
    getUser
}