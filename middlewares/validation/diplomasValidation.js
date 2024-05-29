const {body} = require('express-validator')
const Diploma = require('./../../models/Diploma.js')

let validatediplomas = ()=>{
    return [
        body('diplomaName').notEmpty().withMessage("Diploma Name Can't Be Empty").custom(async (d)=>{
            let diploma = await Diploma.findOne({diplomaName : d})
            if(diploma){
                throw('Diploma Name Must be Unique')
            }
        }),
        body('diplomaPrice').notEmpty().withMessage("Diploma Price Can't be Empty").isNumeric().withMessage("Please Enter A Valid Value, in Numbers")
    ]
}

module.exports = validatediplomas