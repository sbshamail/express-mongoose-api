const caches = {};

const createCache = cacheName => {
  if (!caches[cacheName]) {
    caches[cacheName] = new Map();
  }
  return caches[cacheName];
};
const clearCache = cacheName => {
  if (caches[cacheName]) {
    caches[cacheName].clear();
  }
};

const removeCacheEntry = (cacheName, key) => {
  if (caches[cacheName]) {
    caches[cacheName].delete(key);
  }
};

const clearAllCaches = () => {
  Object.keys(caches).forEach(cacheName => {
    caches[cacheName].clear();
  });
};

module.exports = {
  caches,
  clearCache,
  createCache,
  removeCacheEntry,
  clearAllCaches
};
