const Diploma = require('./../models/Diploma.js')
const responseMsg = require('./../utilities/responseMsgs.js')
const {validationResult} = require('express-validator')
const getUserDataFromToken = require('./../utilities/getUserDataFromToken.js')

let addDiploma = async(req,res)=>{
    try{
        let validationErrors = validationResult(req)
        if(validationErrors?.errors.length != 0){
            throw(validationErrors.errors)
        }else{

        let newDiploma = await req.body
        let userData = await getUserDataFromToken(req.cookies.jwt)
        let add = await new Diploma({
            diplomaName : newDiploma.diplomaName,
            diplomaPrice : newDiploma.diplomaPrice,
            diplomaCreatedBy : {
                _id : userData._id,
                name : userData.name
            },
            diplomaCreatedAt : Date.now()
        })

        let done = await add.save()
        
        if(done.diplomaName != newDiploma.diplomaName){
            throw('Something Went Wrong, Please Try Again')
        }else{
            res.status(200).json({
                status : responseMsg.SUCCESS,
                data : done
            })
        }}

    }catch(er){
        console.log(er)
        
        let dberrors
        if(er?.message){
            dberrors= er.message.split(',')
        }else{
            dberrors = er.map((e)=>e.msg)
        }
        
        res.status(400).json({
            status: responseMsg.ERROR,
            data : dberrors
        })
    }
}

let getAllDiplomas = async(req,res)=>{
    try{
        let allDiplomas = await Diploma.find()
        res.status(200).json({
            status : responseMsg.SUCCESS,
            data : allDiplomas
        })
    }catch(er){
        console.log(er)
        res.status(400).json({
            status : responseMsg.ERROR,
            message : er
        })
    }
}

let getSingleDiploma = async(req,res)=>{
    try{
        let diplomaID = req.params.id
        let diploma = await Diploma.find({_id:diplomaID})

        if(diploma.length == 0){
            throw('Diploma Not Found')
        }else{
            res.status(200).json({
                status: responseMsg.SUCCESS,
                data : diploma
            })
        }
    }catch(er){
        console.log(er)
        res.status(400).json({
            status: responseMsg.FAIL,
            data : er.message || er
        })
    }
}

let updateDiploma = async(req,res)=>{
    try{
        let validation = validationResult(req)
        if(validation.errors.length != 0){
            throw(validation.errors)
        }else{
        let diplomaID = req.params.id
        let newdata = req.body
        let upd = await Diploma.updateOne({_id : diplomaID},{
            // diplomaName : newdata.diplomaName,
            diplomaPrice : newdata.diplomaPrice
        }) 

        if(upd.matchedCount == 0){
            throw('Diploma Not Found')
        }else{
            if(upd.modifiedCount == 0){
                throw('Nothing Updated')
            }else{
                res.status(200).json({
                    status : responseMsg.SUCCESS,
                    data : newdata
                })
            }
        }
    }
    }catch(er){
        console.log(er)
        let errors = []
        
        if(er[0]?.location){
            errors = er.map((e)=>e.msg)
        }else if(er.message){
            errors = er.message
        }else{
            errors = er
        }
        res.status(400).json({
            status : responseMsg.FAIL,
            data : errors
        })
    }
}

module.exports = {
    addDiploma,
    getAllDiplomas,
    getSingleDiploma,
    updateDiploma
}