const express = require('express');

const router = express.Router();
const userController = require('../Controller/userController');
const authController = require('../Controller/authController');

router.post(
  '/create-user',
  authController.protect,
  authController.restrictToAdmin,
  userController.addNewUser
);
router.post('/login', userController.login);
router.get('/logout', userController.logout);
router
  .route('/')
  .get(
    authController.protect,
    authController.restrictToAdmin,
    userController.getAllUsers
  );

router
  .route('/:id')
  .get(authController.protect, userController.getUser)
  .patch(userController.updateUser)
  .delete(
    authController.protect,
    authController.restrictToAdmin,
    userController.deleteUser
  );

module.exports = router;
