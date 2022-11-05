const express = require('express');

const router = express.Router();
const orderController = require('../Controller/orderController');
const authController = require('../Controller/authController');

router.post(
  '/create-order',
  authController.protect,
  orderController.createOrder
);

router
  .route('/')
  .get(
    authController.protect,
    orderController.getAllOrders
  );

router
  .route('/:id')
  .patch(
    authController.protect,
    orderController.updateOrder
  )
  .delete(
    authController.protect,
    orderController.deleteOrder
  );

router.get(
  '/this-months-order',
  authController.protect,
  orderController.thisMonthsOrder
);

router.get(
  '/todays-order',
  authController.protect,
  orderController.todaysOrder
);

module.exports = router;
