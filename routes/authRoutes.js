const authController = require('./../controllers/authController.js')
const express = require('express')
const router = express.Router()


router.post('/login',authController.userLogin)
router.get('/logout',authController.logOut)

module.exports = router
