const express = require('express')
const router = express.Router()

/*checkAuth middleware*/
const checkAuth = require('../middleware/check-auth')

/*controllers*/
const UserController = require('../controllers/user');

/*POST /user/signup*/
router.post('/signup', UserController.signup)

/*POST /user/login*/
router.post('/login', UserController.login)

/*DELETE /user/{id}*/
router.delete('/:userId', checkAuth, UserController.deleteById)

module.exports = router
