var express = require('express');
var presentationController = require('../controllers/presentation');
var authController = require('../controllers/auth');
var userController = require('../controllers/user');
var router = express.Router();

router.get('/user/me', authController.ensureAuthenticated, userController.getUserData);
router.post('/add', authController.ensureAuthenticated, presentationController.addPresentation);
router.post('/cancel', authController.ensureAuthenticated, presentationController.cancelPresentation);
router.get('/list', presentationController.listPresentation);
router.get('/presenting', authController.ensureAuthenticated, presentationController.presenting);
router.get('/totaltime', presentationController.totalTime);

module.exports = router;
