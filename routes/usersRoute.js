const express = require('express')
const router = express.Router()
const usersController = require('./../controllers/usersController.js')
const usersValidation = require('./../middlewares/validation/usersValidation.js')
const adminMiddleware = require('./../middlewares/adminMiddleware.js')
const studentsMiddleware = require('./../middlewares/studentMiddleware.js')

router.post('/register',adminMiddleware,usersValidation(),usersController.registerUser)
router.get('/all/:type',adminMiddleware,usersController.getAllUsers)
router.delete('/:id',adminMiddleware,usersController.deleteUser)
router.patch('/password/:id',adminMiddleware,usersController.updateUserPassword)
router.patch('/group/:id',adminMiddleware,usersController.updateUserGroup)
router.get('/userdata',studentsMiddleware,usersController.getUser)

module.exports = router