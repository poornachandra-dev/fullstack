import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

const authMiddleware = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            console.error('Authorization header missing or malformed'); // Log for debugging
            return res.status(401).json({ message: 'Authorization header missing or malformed' });
        }

        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRECT);

        req.userId = decoded.id;

        next();
    } catch (error) {
        console.error('Error verifying token:', error); // Log for debugging
        return res.status(401).json({ message: 'Unauthorized' });
    }
};

export default authMiddleware;
