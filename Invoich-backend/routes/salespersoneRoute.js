const express = require('express');
const router = express.Router();
const upload = require('../middleware/multerConfig');
const salespersoneController = require('../controllers/salespersoneController');


router.post('/creatsalespersone', salespersoneController.createSalespersone);
router.post('/salespersonecsv', upload.single('file'), salespersoneController.salespersonecsv);

router.get('/getallsalespersone', salespersoneController.getAllSalespersones);
router.get('/getsalespersonebyid/:id', salespersoneController.getSalespersoneById);

module.exports = router;