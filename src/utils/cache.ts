import TTLCache from '@isaacs/ttlcache'
const cache = new TTLCache<string, number>({ ttl: 1000 * 60 * 3 })

export default cache
