const mongoose = require('mongoose')
const redis = require('redis')
const util = require('util')

const client = redis.createClient(process.env.REDISCLOUD_URL, {
  no_ready_check: true
})

client.hget = util.promisify(client.hget)

const exec = mongoose.Query.prototype.exec

mongoose.Query.prototype.cache = function (options = {}) {
  this.useCache = true
  this.hashKey = JSON.stringify(options.key || '')
  return this
}

mongoose.Query.prototype.exec = async function () {
  if (!this.useCache) {
    return exec.apply(this, arguments)
  }

  const key = JSON.stringify(
    Object.assign({}, this.getQuery(), this.getOptions(), {
      collection: this.mongooseCollection.name
    })
  )

  const cachedValue = await client.hget(this.hashKey, key)

  // make sure cached values return mongoose documents too
  if (cachedValue) {
    console.log('serving from cache')
    const doc = JSON.parse(cachedValue)

    if (typeof doc === 'number') {
      return doc
    }

    return Array.isArray(doc)
      ? doc.map(d => new this.model(d))
      : new this.model(doc)
  }

  const result = await exec.apply(this, arguments)
  client.hset(this.hashKey, key, JSON.stringify(result))
  client.expire(this.hashKey, 3600)
  return result
}

function clearHash(hashKey) {
  return client.del(JSON.stringify(hashKey))
}

module.exports = {
  clearHash,
  client
}
