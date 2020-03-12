const Joi = require('joi');

module.exports = {

    // GET /api/items
    listItems: {
        query: {
            page: Joi.number().min(1),
            perPage: Joi.number().min(1).max(150),
            itemGroup: Joi.string(),
            name: Joi.string(),
        },
    },



    // POST /api/item
    createItem: {
        body: {
            itemCode: Joi.string()
                .required()
                .min(6)
                .max(10),
            barcode: Joi.string()
                .required()
                .min(12)
                .max(12),
            itemGroup: Joi.string()
                .required()
                .min(3)
                .max(6),
            name: Joi.string()
                .max(120)
        }
    },


    // PATCH /api/items/:itemId
    updateItem: {
        body: {
            itemCode: Joi.string()
            .min(6)
            .max(10),
        barcode: Joi.string()
            .min(12)
            .max(12),
        itemGroup: Joi.string()
            .min(3)
            .max(6),
        name: Joi.string()
            .max(120)
        },
        params: {
            itemId: Joi.string().regex(/^[a-fA-F0-9]{24}$/).required(),
        },
    },
};
