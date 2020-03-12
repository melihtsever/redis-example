const { clearHash } = require('../config/cache');

module.exports = async (req, res, next) => {
    await next();

    clearHash(req.params.itemId);
};