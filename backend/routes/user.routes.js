const router = require('express').Router();
const userController = require('../controllers/user.controller');

router.post('/create', userController.createUser);
router.post('/auth', userController.authentification)
router.get('/get/:id', userController.getInfos)
router.get('/getListing/:id', userController.getListings)
router.get('/getPurchase/:id', userController.getPurchase)
router.post('/updateUser', userController.updateUser)


module.exports = router;