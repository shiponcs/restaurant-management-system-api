const express = require('express');

const router = express.Router();
const userController = require('../Controller/userController');
const authController = require('../Controller/authController');

router.post(
  '/create-user',
  authController.protect,
  userController.addNewUser
);
router.post('/login', userController.login);

router.route('/').get(userController.getAllUsers);

router
  .route('/:id')
  .get(userController.getUser)
  .patch(userController.updateUser)
  .delete(
    authController.protect,
    authController.restrictToAdmin,
    userController.deleteUser
  );

module.exports = router;
