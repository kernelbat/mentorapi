const eventModel = require('../models/actions')

const get = async (req, res) => {
    try {
        let data = await eventModel.getActions()
        res.status(200).json({
            error: false,
            data: data
        })
    } catch (error) {
        res.status(200).json({
            error: true,
            title: error
        })
    }

}
const add = async (req, res) => {
    try {
        if (!req.body.name) {
            return res.status(200).json({
                error: true,
                title: 'Name is required'
            })
        }
        let data = new eventModel(req.body);//name will be there in parameter
        data.save().then((result, error) => {
            if (error) {
                return res.status(200).json({
                    error: true,
                    title: error
                })
            }
            res.status(200).json({
                error: false,
                data: result
            })
        })
    } catch (error) {
        res.status(200).json({
            error: true,
            title: error
        })
    }
}
module.exports = {
    get,
    add
}