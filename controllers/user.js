/* NODE-MODULES */
const async = require('async');
var mongoose = require('mongoose');
var ObjectId = mongoose.Types.ObjectId;
const bcrypt = require('bcryptjs');
const helper = require('../lib/helper');
const { check, validationResult, body } = require('express-validator');
const randomstring = require("randomstring");
var jwt = require('jsonwebtoken');

/* Model */
const userModel = require('../models/user');
const actions = require('../models/actions');


/* CONTROLLER MODULES */

/*
# parameters: token,
# purpose: login for users
*/
const signin = async (req, res) => {
    console.log('signin req.body ', req.body);

    const result = validationResult(req);

    console.log('signin errors ', result);
    if (result.errors.length > 0) {
        return res.status(200).json({
            error: true,
            title: result.errors[0].msg,
            errors: result
        });
    }

    let userData = await userModel.findOne({ email: req.body.email, user_type: req.body.user_type });
    if (userData.password && req.body.password && bcrypt.compareSync(req.body.password, userData.password)) {
        helper.generateToken(userData, (token) => {

            return res.status(200).json({
                title: "Logged in successfully",
                error: false,
                token: token
            });
        })
    } else {
        return res.status(200).json({
            title: 'You have entered an invalid username or password',
            error: true
        });
    }


}
//for admin will be added from postman
const createAdmin = async (req, res) => {
    try {
        let existUser = await userModel.getUser({ email: req.body.email })
        if (existUser) {
            return res.status(200).json({
                error: true,
                title: "Email alredy exixts"
            })
        }
        let user = new userModel({ email: req.body.email, user_type: 'admin', name: req.body.name, mobile: req.body.mobile })
        user.password = bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10))
        user.save().then((resul) => {
            res.status(200).json({
                error: false,
                title: 'Admin added'
            })
        })
    } catch (error) {
        res.status(200).json({
            error: true,
            title: error
        })
    }

}
/*
# parameters: userToken
# Variables used : token
# purpose: remote validation of email
*/
const validateEmail = async (req, res) => {
    console.log("validateEmail req.body", req.body);

    const result = validationResult(req);
    console.log('validateEmail errors ', result);
    if (result.errors.length > 0) {
        return res.status(200).json({
            error: true,
            title: result.errors[0].msg,
            errors: result
        });
    }
    let query = req.body.email ? { email: req.body.email.trim().toLowerCase() } : { mobile: req.body.mobile }

    let userData = await userModel.getUser(query);

    console.log("validateEmail userData", userData);

    if (userData && req.body.user_id) {
        if (userData && (ObjectId(userData._id).equals(ObjectId(req.body.user_id)))) {
            return res.status(200).json({
                error: false,
                isExist: false
            })
        }
        return res.status(200).json({
            error: false,
            isExist: true
        })
    } else if (userData && !req.body.user_id) {
        return res.status(200).json({
            error: false,
            isExist: true
        })
    }
    else {
        return res.status(200).json({
            error: false,
            isExist: false
        })
    }
}



const getUser = async (req, res) => {
    res.status(200).json({
        error: false,
        data: req.user
    })
}
const addMentor = async (req, res) => {
    try {
        const result = validationResult(req);
        if (result.errors.length > 0) {
            return res.status(200).json({
                error: true,
                title: result.errors[0].msg,
                errors: result
            });
        }
        let user = req.body._id ? await userModel.getUser({ _id: req.body._id }) : new userModel()
        // passwords are not added by assuming mentor will login through otp
        user.email = req.body.email;
        user.mobile = req.body.mobile;
        user.actions = req.body.actions
        user.name = req.body.name


        user.save().then((result, error) => {
            if (error) {
                return res.status(200).json({
                    error: true,
                    title: error
                })
            }
            res.status(200).json({
                error: false,
                title: req.body._id ? 'Mentor updated successfully' : 'Mentor added successfully'
            })
        })
    } catch (error) {
        console.log('error', error)
        res.status(200).json({
            error: true,
            title: error
        })
    }

}
const getMentors = async (req, res) => {
    try {
        let limit = parseInt(10);
        let skip = (parseInt(req.query.page ? req.query.page : 1) - 1) * parseInt(limit);
        let data = await userModel.getAllUserPagination({ user_type: 'mentor' }, skip, { createdAt: -1 }, limit)
        let count = await userModel.getCount({ user_type: 'mentor' })
        res.status(200).json({
            error: false,
            data,
            count
        })
    } catch (error) {
        console.log('error', error)
        res.status(200).json({
            error: true,
            title: error
        })
    }

}
const deleteMentor = async (req, res) => {
    try {
        let data = await userModel.deleteUser({ _id: req.body._id })
        res.status(200).json({
            error: false,
            title: 'User deleted successfully',
            data
        })
    } catch (error) {
        res.status(200).json({
            error: true,
            title: error
        })
    }
}
const getMentorDetails = async (req, res) => {
    try {
        let data = await userModel.getUser({ _id: req.query._id })
        res.status(200).json({
            error: false,
            data
        })

    } catch (error) {
        res.status(200).json({
            error: true,
            title: error
        })
    }
}

module.exports = {
    signin,
    getUser,
    validateEmail,
    addMentor,
    getMentors,
    deleteMentor,
    getMentorDetails,
    createAdmin

}