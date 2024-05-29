const express = require('express')
const router = express.Router()
const diplomasController = require('./../controllers/diplomasContoller.js')
const diplomasValidation = require('./../middlewares/validation/diplomasValidation.js')
const adminMiddleware = require('./../middlewares/adminMiddleware.js')
const instructorMiddleware = require('./../middlewares/instructorMiddleware.js')


router.route('/')
        .post(adminMiddleware,diplomasValidation(),diplomasController.addDiploma)
        .get(instructorMiddleware,diplomasController.getAllDiplomas)

router.route('/:id')
        .get(instructorMiddleware,diplomasController.getSingleDiploma)
        .patch(adminMiddleware,diplomasController.updateDiploma)


module.exports = router