const mongoose = require('mongoose');
const httpStatus = require('http-status');
const { omitBy, isNil } = require('lodash');
const APIError = require('../utils/APIError');



/**
 * Item Schema
 * @private
 */
const itemSchema = new mongoose.Schema({
    itemCode: String,
    itemGroup: String,
    name: String,
    barcode: String,
    createdAt: { type: Date, default: Date.now }
})


/**
 * Methods
 */
itemSchema.method({
    transform() {
        const transformed = {};
        const fields = ['id', 'itemCode', 'itemGroup', 'name', 'barcode', 'createdAt'];
        fields.forEach((field) => {
            transformed[field] = this[field];
        });
        return transformed;
    }
});

/**
 * Statics
 */
itemSchema.statics = {
    /**
     * Get item
     *
     * @param {ObjectId} id - The objectId of item.
     * @returns {Promise<Item, APIError>}
     */
    async get(id) {
        try {
            let item;
            if (mongoose.Types.ObjectId.isValid(id)) {
                item = await this.findById(id).cache({ key: id}).exec();
            }
            if (item) {
                return item;
            }
            throw new APIError({
                message: 'Item does not exist',
                status: httpStatus.NOT_FOUND,
            });
        } catch (error) {
            throw error;
        }
    },
    /**
     * List items in descending order of 'createdAt' timestamp.
     *
     * @param {number} skip - Number of items to be skipped.
     * @param {number} limit - Limit number of items to be returned.
     * @returns {Promise<Item[]>}
     */
    list({
        page = 1, perPage = 30, itemGroup, name,
    }) {
        const options = omitBy({ itemGroup, name }, isNil);

        return this.find(options)
            .sort({ createdAt: -1 })
            .skip(perPage * (page - 1))
            .limit(perPage)
            .cache()
            .exec()
            ;
    }
};

/**
 * @typedef Item
 */
module.exports = mongoose.model('Item', itemSchema)