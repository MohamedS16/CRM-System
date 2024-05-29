const express = require('express')
const router = express.Router()
const userSessionController = require('./../controllers/userSessionController.js')
const userSessionValidation = require('./../middlewares/validation/userSessionValidation.js')
const studentMiddleware = require('./../middlewares/studentMiddleware.js')

router.post('/:sessionid/add',studentMiddleware,userSessionValidation(),userSessionController.addNewUserSession)
router.get('/:usersessionid',studentMiddleware,userSessionController.getUserSession)
router.patch('/update/:usersessionid',studentMiddleware,userSessionValidation(),userSessionController.updateUserSession)


module.exports = router