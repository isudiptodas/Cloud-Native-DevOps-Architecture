import { redisConnect } from '../config/redisConnect.js';

export const rateLimit = async (req, res, next) => {
    const ip = req.ip.startsWith('::ffff') ? req.ip.replace('::ffff:', '') : req.ip;
    const key = `rate:${ip}`;
    const limit = 15;
    const time = 60;

    const count = await redisConnect.incr(key);

    if (count === 1) {
        await redisConnect.expire(key, time);
    }

    if (count > limit) {
        return res.status(429).json({
            success: false,
            message: `Too many request`
        });
    }

    next();
}