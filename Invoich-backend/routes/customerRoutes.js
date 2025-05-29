const express = require('express');
const router = express.Router();
const upload = require('../middleware/multerConfig');
const customerController = require('../controllers/customerController');

// Routes for customer operations
router.post('/createCustomer', customerController.createCustomer); 
router.post('/Customercsv', upload.single('file'), customerController.Customercsv); 
router.get('/viewCustomers', customerController.getAllCustomers); 
router.get('/viewCustomers/:id', customerController.getCustomerById);
router.put('/updateCustomer', customerController.updateCustomer);
router.delete('/deleteCustomer', customerController.deleteCustomer); 

module.exports = router;
