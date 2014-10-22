var express = require('express');
var sessionController = require('../controllers/session');
var authController = require('../controllers/auth');
var userController = require('../controllers/user');
var router = express.Router();

router.post('/session/add', authController.ensureAuthenticated, sessionController.addSession);

module.exports = router;
