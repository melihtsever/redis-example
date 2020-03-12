var httpStatus = require('http-status');
const Item = require('../models/item');
//const { omit } = require('lodash');





/**
 * Load item and append to req.
 * @public
 */
exports.load = async (req, res, next, id) => {
    try {
        const item = await Item.get(id);
        req.locals = { item };
        return next();
    } catch (error) {
        return next(error);
    }
};
/**
 * Get item
 * @public
 */
exports.get = (req, res) => {
    res.json(req.locals.item.transform());
};




/**
 * Get item list
 * @public
 */
exports.list = async (req, res, next) => {
    try {
        const items = await Item.list(req.query);
        const transformedUsers = items.map(item => item.transform());
        res.json(transformedUsers);
    } catch (error) {
        next(error);
    }
};


/**
* Create new item
* @public
*/
exports.create = async (req, res, next) => {
    try {
        const item = new Item(req.body);
        const savedItem = await item.save();
        res.status(httpStatus.CREATED);
        res.json(savedItem.transform());
    } catch (error) {
        next(error);
    }
};


/**
 * Delete item
 * @public
 */
exports.remove = (req, res, next) => {
    const { item } = req.locals;
    item.remove()
        .then(() => res.status(httpStatus.NO_CONTENT).end())
        .catch(e => next(e));
};



/**
 * Update existing item
 * @public
 */
exports.update = (req, res, next) => {
    const item = Object.assign(req.locals.item, req.body);
    item.save()
        .then(savedItem => res.json(savedItem.transform()))
        .catch(e => next(e));
};