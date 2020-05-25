const mongoose = require("mongoose");
const redis = require("redis");
const util = require("util");
const keys = require("../config/keys");
const client = redis.createClient(keys.redisUrl);
client.hget = util.promisify(client.hget); //Passed as a refrence
const exec = mongoose.Query.prototype.exec;

mongoose.Query.prototype.cache = function (options = {}) {
  this.useCache = true;
  this.hashKey = JSON.stringify(options.key || "");
  return this; //To make it chainable
};

mongoose.Query.prototype.exec = async function () {
  if (this.useCache) {
    const key = JSON.stringify(
      Object.assign({}, this.getQuery(), {
        collection: this.mongooseCollection.name,
      })
    );
    //See if we have a value for key in redis
    const cacheValue = await client.hget(this.hashKey, key);
    //if yes return that
    if (cacheValue) {
      const doc = JSON.parse(cacheValue);
      return Array.isArray(doc)
        ? doc.map((doc) => new this.model(doc))
        : new this.model(doc);
    }
    //else issue the query and update redis with the result
    const result = await exec.apply(this, arguments);
    client.hset(this.hashKey, key, JSON.stringify(result), "EX", 10); //Seconds
    return result;
  }
  return exec.apply(this, arguments);
};

module.exports = {
  clearHash(hashKey) {
    client.del(JSON.stringify(hashKey));
  },
};
