const redis = require("redis");

const { promisify } = require("util");

//1. Connect to the redis server
const redisClient = redis.createClient(
    15740,
  "redis-15740.c301.ap-south-1-1.ec2.cloud.redislabs.com",
  { no_ready_check: true }
);
redisClient.auth("sa4jInlZj18rT1xjrPSMFCWzi79WZcIT", function (err) {
  if (err) throw err;
});

redisClient.on("connect", async function() {   // can not use any other thing other than  "connect"
  console.log("Connected to Redis.");
});


//2. Prepare the functions for each command

const SET_ASYNC = promisify(redisClient.SETEX).bind(redisClient);    // bind() is the function of javascript
const GET_ASYNC = promisify(redisClient.GET).bind(redisClient);      


module.exports={SET_ASYNC,GET_ASYNC}


