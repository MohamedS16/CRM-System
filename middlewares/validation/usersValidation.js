let {body} = require('express-validator')
let User = require('./../../models/User.js')

const usersValidation = ()=>{
    return [
        body('name').notEmpty().withMessage("Name Can't be Empty"),
        body('email').notEmpty().withMessage("email Can't be Empty").isEmail().withMessage("Please Enter a valid Email").custom(async(r)=>{
            let users = await User.findOne({email : r})
            if(users){
                throw('User Already Exists with this Email')
            }
        }),
        body('password').notEmpty().withMessage("Password Can't be Empty"),
        body('phone').notEmpty().withMessage("Phone Can't be Empty").custom(async(r)=>{
            let users = await User.findOne({phone : r})
            if(users){
                throw('User Already Exists with this Phone')
            }
        }),
        body('role').notEmpty().withMessage("Role Can't be Empty").isIn(['1a','2i','3s']).withMessage("Role Must be Admin, Instructor or Student")       
    ]
}

module.exports = usersValidation