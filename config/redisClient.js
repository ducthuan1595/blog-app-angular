const redis = require('redis');

const redisClient = redis.createClient(
  {
    url: "redis://default:6r791l3pGkQ2Genm3EO0LlDtcAsbe1PV@redis-13020.c1.asia-northeast1-1.gce.cloud.redislabs.com:13020",
  }
);

module.exports = redisClient;