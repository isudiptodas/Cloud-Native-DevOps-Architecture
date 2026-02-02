import jwt from 'jsonwebtoken';

export const authenticate = async (req, res, next) => {

    const token = req.cookies.token;

    if (!token) {
        return res.status(403).json({
            success: false,
            message: 'token missing'
        });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.userData = decoded;

        return next();
    }
    catch (err) {
        console.log(err);
        return res.status(401).json({
            success: false,
            message: 'Error validating token'
        });
    }
}
