const express = require('express')
const controller=require('../controllers/tourcontroller')
const authController=require('../controllers/authController')

const router=express.Router()
router.route('/advStats').get(controller.advStats)
router.route('/stats').get(controller.statsFind)
router.route('/topfivecheap').get(controller.aliasRoute,controller.getAllTour)
router.route('/').get(authController.protect,controller.getAllTour)
.post(controller.setNewTour)

router.route('/:id/:field?')
.get(controller.getTour)
.patch(controller.updateTour)
.delete(authController.protect ,authController.checkEligible('admin','tour-guide'),controller.deleteTour)

module.exports.tourRouter=router;