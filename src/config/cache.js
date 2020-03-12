const mongoose = require('mongoose');
const redisClient = require('redis');
const util = require('util');
const { redis } = require('./vars');

const client = redisClient.createClient(redis.uri);
client.hget = util.promisify(client.hget);
const exec = mongoose.Query.prototype.exec;

mongoose.Query.prototype.cache = function (options = {}) {
    this.useCache = true;
    this.hashKey = JSON.stringify(options.key || '');
    return this;
};

mongoose.Query.prototype.exec = async function () {
    if (!this.useCache) {
        return exec.apply(this, arguments);
    }
    //let options = ;
    // console.log(options);

    // const key = JSON.stringify(
    //     Object.assign({},
    //         { filters: this.getQuery() },
    //         { collection: this.mongooseCollection.name },
    //         { options: this._optionsForExec() }
    //     )
    // );
    const key = JSON.stringify(
        Object.assign({}, this.getQuery(), {
            collection: this.mongooseCollection.name
        })
    );

    // See if we have a value for 'key' in redis
    const cacheValue = await client.hget(this.hashKey, key);

    // If we do, return that
    if (cacheValue) {
        const doc = JSON.parse(cacheValue);

        return Array.isArray(doc)
            ? doc.map(d => new this.model(d))
            : new this.model(doc);
    }

    // Otherwise, issue the query and store the result in redis
    const result = await exec.apply(this, arguments);

    client.hset(this.hashKey, key, JSON.stringify(result));

    return result;
};

module.exports = {
    clearHash(hashKey) {
        client.del(JSON.stringify(hashKey));
    }
};