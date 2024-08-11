const router = require('express').Router()
const userControllers = require('../controllers/userControllers')

// Make a create user API
router.post('/create',userControllers.createUser)

// controllers -routes- (Index.js)

// login user api
router.post('/login', userControllers.loginUser)

//exporting
module.exports = router;