
const caches = {};

const createCache = (cacheName) => {
    if (!caches[cacheName]) {
        caches[cacheName] = new Map();
    }
    return caches[cacheName];
};

module.exports={
    caches,
    createCache
}

