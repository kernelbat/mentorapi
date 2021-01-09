const { query } = require('express-validator');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = mongoose.Types.ObjectId;

var schema = new Schema({
    name: String,
    email: {
        type: String,
        required: false
    },
    password: {
        type: String,
        required: false
    },
    mobile: String,
    actions: [{
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'action'
    }],
    user_type: {
        type: String,//admin,mentor,
        default: 'mentor'
    }


},
    {
        timestamps: true
    });

const user = module.exports = mongoose.model('user', schema);

module.exports.getUser = async (query) => {
    let data = await user.findOne(query, { name: 1, email: 1, mobile: 1, actions: 1, _id: 1 }).then(result => result)
    return data
}
module.exports.getAllUserPagination = async (query, skip, sort = { createdAt: -1 }, limit = 10) => {
    let data = await user.find(query).skip(skip).limit(limit).sort(sort).populate('actions').then((result) => result)
    return data
}
module.exports.getCount = async (query) => {
    let data = await user.countDocuments(query).then(result => result)
    return data
}
module.exports.deleteUser = async (query) => {
    let data = await user.deleteOne(query).then(result => result)
    return data
}