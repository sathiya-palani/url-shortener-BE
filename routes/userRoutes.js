
const express = require('express');
const userRouter = express.Router();
const userController = require('../controller/userController');

userRouter.post('/signup',userController.signup)
userRouter.post('/login',userController.login)
userRouter.post('/forgot-password',userController.forgotPassword)
userRouter.post('/reset-password/:randomString/:expitationTimestamp',userController.resetPassword)



module.exports = userRouter;