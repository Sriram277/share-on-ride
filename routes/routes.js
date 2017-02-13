var express = require('express');
var router = express.Router();
var config = require('../config/config.js');
var userController = require('../controllers/userController.js');
var fileUploadController = require('../controllers/fileuploadController.js');
var rideController = require('../controllers/rideController.js');

/* user */
router.post('/user/register', userController.register);
router.post('/user/login', userController.login);
router.get('/user/all/list', userController.listUsers);

/*file upload*/
//var multer  = require('multer');
//var upload = multer({ dest: 'uploads/' });
//
router.post('/uploadtos3', fileUploadController.uploadFiletoS3);
router.post('/file/upload', fileUploadController.uploadFile);

/* Rides */
router.post('/create/:driverId/trip', rideController.createTrip);
router.get('/list/all/trips', rideController.listAllTrips);
router.get('/list/all/:driverId/trips', rideController.listMyTrips);
router.post('/list/find/trips', rideController.findTrips);
router.post('/contact/:userId/driver', rideController.contactDriver);



module.exports = router;
