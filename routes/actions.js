const express = require('express');
const router = express.Router();
const actionController = require('../controllers/actions')

router.get('/get', (req, res) => {
    actionController.get(req, res)
})
router.post('/add', (req, res) => {
    actionController.add(req, res)
})
module.exports = router