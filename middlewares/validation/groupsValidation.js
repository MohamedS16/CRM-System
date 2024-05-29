const {body} = require('express-validator')
const Group = require('./../../models/Group.js')
const Diploma = require('./../../models/Diploma.js')

let groupValidation = ()=>{
    return [
        body('groupDiploma').notEmpty().withMessage("Diploma Can't be Empty").custom(async(d)=>{
            let diploma = await Diploma.findOne({diplomaName : d})
            if(!diploma){
                throw('Diploma Not Found')
            }
        }),
        body('groupName').notEmpty().withMessage("Group Name Can't be Empty").custom(async (n)=>{
            let Groups = await Group.findOne({groupName : n})
            if(Groups){
                throw('Group Name Must be Unique')
            }
        }),
        body('groupStart').notEmpty().withMessage("Group Start Date Can't be Empty"),
        body('groupSessions').notEmpty().withMessage("Please Enter Number of Sessions")
    ]
}


module.exports = groupValidation