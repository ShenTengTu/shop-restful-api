const express = require('express')
const router = express.Router()

/*checkAuth middleware*/
const checkAuth = require('../middleware/check-auth')

/*controllers*/
const OrdersController = require('../controllers/orders');

/*GET /orders
need Auth*/
router.get('/', checkAuth, OrdersController.getAll)

/*POST /orders
need Auth*/
router.post('/', checkAuth, OrdersController.create)

/*GET /orders/{id}
need Auth*/
router.get('/:orderId', checkAuth, OrdersController.getById)

/*DELETE /orders/{id}
need Auth*/
router.delete('/:orderId', checkAuth, OrdersController.deleteById)

module.exports = router
