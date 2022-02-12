const {Router}=require('express')
const authController=require('../controllers/authController')
const controller=require('../controllers/usercontroller')

const router=Router()
router.route('/signup').post(authController.signup)
router.route('/login').post(authController.login)
router.route('/forgotPassword').post(authController.forgotPassword)
router.route('/resetPassword/:token').patch(authController.resetPassword)
router.route('/updatePassword').patch(authController.protect,authController.updatePassword)
router.route('/updateMe').patch(authController.protect,controller.updateMe)
router.route('/deleteMe').delete(authController.protect,controller.deleteMe)
router.route('/')
.get(controller.getAllusers)
.post(controller.setNewusers)

router.route('/:id')
.get(controller.getuser)
.patch(controller.updateuser)
.delete(controller.deleteuser)

module.exports=router