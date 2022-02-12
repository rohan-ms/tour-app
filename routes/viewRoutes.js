const express=require('express')
const controller=require('./../controllers/viewController')

const router=express.Router()

router.route('/').get(controller.overview)
router.route('/tour').get(controller.tour)
router.route('/tour/:id').get(controller.tour)
router.route('/login').get(controller.getloginForm)

module.exports=router