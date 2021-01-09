/* NODE-MODULES */
const express = require('express');
const router = express.Router();
var auth = require("../lib/auth");
const { check, validationResult, body } = require('express-validator');

/* CONTROLLER MODULES */
const userController = require('../controllers/user');

router.post('/signin', [check('user_type', 'Name is required').notEmpty(),
check('email', 'Email is required').notEmpty(),
check('password', 'Password is required').notEmpty(),
], (req, res, next) => {
    userController.signin(req, res);
});
router.post('/addMentor', [
    check('name', 'Name is required').notEmpty(),
    check('email', 'Email is required').notEmpty(),
    check('email', 'Email is not valid').isEmail(),
], (req, res, next) => {
    userController.addMentor(req, res);
});
router.post('/validateEmail', (req, res, next) => {
    userController.validateEmail(req, res);
});
router.get('/getUser', [auth.authenticateUser], (req, res) => {
    userController.getUser(req, res)
})
router.get('/getMentors', [auth.authenticateUser], (req, res) => {
    userController.getMentors(req, res)
})
router.post('/deleteMentor', [auth.authenticateUser], (req, res) => {
    userController.deleteMentor(req, res)
})
router.get('/getMentorDetails', [auth.authenticateUser], (req, res) => {
    userController.getMentorDetails(req, res)
})
router.post('/createAdmin', (req, res) => {
    userController.createAdmin(req, res)
})
module.exports = router;