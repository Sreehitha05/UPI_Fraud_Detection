const buckets = new Map();

const createRateLimit = ({
    windowMs = 60_000,
    max = 30,
    keyGenerator = (req) => `${req.ip}:${req.path}`
}) => {
    return (req, res, next) => {
        const key = keyGenerator(req);
        const now = Date.now();
        let bucket = buckets.get(key);

        if (!bucket || now > bucket.resetAt) {
            bucket = { count: 0, resetAt: now + windowMs };
            buckets.set(key, bucket);
        }

        bucket.count += 1;

        if (bucket.count > max) {
            return res.status(429).json({
                message: "Too many requests. Please wait and try again."
            });
        }

        next();
    };
};

setInterval(() => {
    const now = Date.now();

    for (const [key, bucket] of buckets.entries()) {
        if (now > bucket.resetAt) {
            buckets.delete(key);
        }
    }
}, 60_000).unref();

module.exports = createRateLimit;
