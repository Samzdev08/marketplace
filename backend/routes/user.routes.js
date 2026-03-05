const router = require('express').Router();
const userController = require('../controllers/user.controller');

router.post('/create', userController.createUser);
router.post('/auth', userController.authentification)

module.exports = router;