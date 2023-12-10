const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const redisClient = require('./config/redisClient');

const router = require("./router/init");

const app = express();
const port = 9000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({}));

// Init catch data
(async () => {
  redisClient.on("error", (error) => console.error("Error redis" + error));
  await redisClient.connect();
})();

router(app);

mongoose
  .connect(
    "mongodb+srv://thuantruong:gMOcUbEFedwxY8RV@cluster0.gl2bqhl.mongodb.net/blogs-app?retryWrites=true&w=majority"
  )
  .then(() => {
    app.listen(port, () => {
      console.log(`Server is running on port: ${port}`);
    });
  })
  .catch((err) => console.log(err));

