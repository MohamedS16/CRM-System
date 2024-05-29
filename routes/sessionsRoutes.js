const express = require('express')
const router = express.Router()
const sessionsController = require('./../controllers/sessionController.js')
const sessionsValidator = require('./../middlewares/validation/sessionValidation.js')
const instructorMiddleware = require('./../middlewares/instructorMiddleware.js')
const studentMiddleware = require('./../middlewares/studentMiddleware.js')

router.post('/:diploma/:group/addsession',instructorMiddleware,sessionsValidator(),sessionsController.addNewSession)
router.get('/:id',studentMiddleware,sessionsController.getSingleSession)
router.get('/:name/sessions',studentMiddleware,sessionsController.getAllGroupSessions)
router.patch('/:id',instructorMiddleware,sessionsValidator(),sessionsController.updateSession)

module.exports = router