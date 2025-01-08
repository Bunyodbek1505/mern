const express = require('express')
const {registerController, loginController, getUsers} = require('../controller/authControllers')

const router = express.Router()

router.get('/users', getUsers)
router.post('/register', registerController)
router.post('/login', loginController)


module.exports = router;