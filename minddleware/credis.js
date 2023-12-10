const redisClient = require('../config/redisClient');

const cacheData = async (req, res, next) => {
  let result;
  try {
    console.log(redisClient);
    const cacheResult = await redisClient.get("posts");
    if (cacheResult) {
      result = JSON.parse(cacheResult);
      res.status(200).json({ message: "ok", data: result });
    } else {
    }
    next();
  } catch (err) {
    console.log(err);
    res.status(404).json({ message: "Error in credis" });
  }
};

module.exports = cacheData;
