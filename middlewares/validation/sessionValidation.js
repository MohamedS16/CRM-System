const {body} = require('express-validator')

let sessionValidation = ()=>{
    return [
        body('sessionMaterial').notEmpty().withMessage("Session Material Can't Be Empty"),
        body('sessionName').notEmpty().withMessage("Session Name Can't Be Empty"),
        body('sessionAssignment').notEmpty().withMessage("Session Assignment Can't Be Empty"),
        body('sessionQuestion').notEmpty().withMessage("Session Question Can't Be Empty"),
        body('sessionAttendence').notEmpty().withMessage("Session Attendence Can't Be Empty")
    ]
}

module.exports = sessionValidation