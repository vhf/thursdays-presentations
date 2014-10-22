var express = require('express');
var presentationController = require('../controllers/presentation');
var authController = require('../controllers/auth');
var userController = require('../controllers/user');
var router = express.Router();

router.get('/user/me', authController.ensureAuthenticated, userController.getUserData);
router.post('/add', authController.ensureAuthenticated, presentationController.addPresentation);
router.post('/cancel', authController.ensureAuthenticated, presentationController.cancelPresentation);
router.get('/list', authController.ensureAuthenticated, presentationController.listPresentation);

module.exports = router;
