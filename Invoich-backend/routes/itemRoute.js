const express = require('express');
const router = express.Router();
const itemController = require('../controllers/itemController');
const multer = require('multer');

// Multer in-memory storage setup
const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post('/creatitem', itemController.createItem);

router.get('/getallitem', itemController.getAllItems);

router.get('/getitembyitemid/:id', itemController.getItemsByUserId);

router.put('/updateitem/:id', itemController.updateItem);

router.delete('/deletitem/:id', itemController.deleteItem);

router.get('/verifyqr/:qrCodeNumber', itemController.verifyQrCode);

router.post('/bulkupload', upload.single('file'), itemController.bulkUploadItems);


module.exports = router;