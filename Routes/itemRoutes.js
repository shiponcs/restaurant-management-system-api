const express = require('express');

const router = express.Router();
const itemController = require('../Controller/itemController');
const authController = require('../Controller/authController');

router.post(
  '/additem',
  authController.protect,
  itemController.addItem
);

router
  .route('/')
  .get(authController.protect, itemController.getAllItems);

router
  .route('/:id')
  .patch(authController.protect, itemController.updateItem)
  .delete(
    authController.protect,
    itemController.deleteItem
  );

module.exports = router;
