const { Redis } = require('ioredis');

const getRedisUrl = () => {
  if (process.env.REDIS_URL) {
    console.log('redis connected');
    return process.env.REDIS_URL;
  }
  console.log('Redis URL is not defined');
  return null;
};
const redisOptions = {
  password: process.env.REDIS_PASSWORD || '' // Replace "your_redis_password" with your actual Redis password
};

try {
  exports.redis = new Redis(getRedisUrl(), redisOptions);
} catch (error) {
  console.error('Error connecting to Redis:', error);
}

// const { createClient } = require('redis');
// let redis ={}

// module.exports = async function getRedisClient() {
//     const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379'; // Default to localhost if REDIS_URL is not defined
//     const redisOptions = {
//         url: redisUrl,
//         password: process.env.REDIS_PASSWORD || '' // Your Redis password
//     };

//     const client = createClient(redisOptions);
//     client.on('error', (err) => console.error('Redis Client Error', err));

//     try {
//        redis= await client.connect();
//         console.log('Redis connected');
//     } catch (error) {
//         console.error('Error connecting to Redis:', error);
//         throw error; // Throw the error to handle it in the calling code
//     }

//     return client;
// };
