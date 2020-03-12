

module.exports = {
  env: process.env.NODE_ENV,
  port: process.env.PORT,
  mongo: {
    uri: process.env.MONGO_URI,
  },
  redis: {
    uri: process.env.REDIS_URI,
  },
  logs: process.env.NODE_ENV === 'production' ? 'combined' : 'dev'
};
