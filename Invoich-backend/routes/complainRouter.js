const express = require('express');
const router = express.Router();
const userComplainController = require('../controllers/complainController');

router.post('/creatusercomplain', userComplainController.createUserComplain);

router.get('/getallcomplain', userComplainController.getAllUserComplains);

router.get('/getsinglecomplain/:id', userComplainController.getUserComplainById);

router.put('/updatecomplain/:id', userComplainController.updateUserComplainById);

module.exports = router;