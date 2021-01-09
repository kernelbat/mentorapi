var mongoose = require('mongoose');
var schema = mongoose.Schema({
    name: String,
    is_deleted: {
        type: Boolean,
        default: false
    }
})
var actions = module.exports = mongoose.model('action', schema);

module.exports.getActions = async (query = { is_deleted: false }) => {
    let data = await actions.find(query).then(result => result)
    return data
}
