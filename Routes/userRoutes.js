const express = require('express');

const router = express.Router();
const userController = require('../Controller/userController');

router.post('/create-user', userController.addNewUser);
router.post('/login', userController.login);

router.route('/').get(userController.getAllUsers);

router
  .route('/:id')
  .get(userController.getUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);

module.exports = router;
