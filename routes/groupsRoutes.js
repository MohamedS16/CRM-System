const express = require('express')
const router = express.Router()
const groupsController = require('./../controllers/groupsController.js')
const groupsValidator = require('./../middlewares/validation/groupsValidation.js')
const adminMiddleware = require('./../middlewares/adminMiddleware.js')
const instructorMiddleware = require('./../middlewares/instructorMiddleware.js')


router.route('/')
        .post(adminMiddleware,groupsValidator(),groupsController.addNewGroup)
        .get(instructorMiddleware,groupsController.getAllGroups)

router.route('/:id')
        .get(instructorMiddleware,groupsController.getSingleGroup)
        .delete(adminMiddleware,groupsController.deleteGroup)
        .patch(adminMiddleware,groupsController.updateGroup)

router.get('/diploma/:diplomaName',instructorMiddleware,groupsController.diplomaGroups)

module.exports = router