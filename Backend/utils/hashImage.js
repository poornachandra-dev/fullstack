import crypto from 'crypto';
import sharp from 'sharp';

export const generateImageHash = async (filePath) => {
    const imageBuffer = await sharp(filePath).toBuffer();
    const hash = crypto.createHash('sha256').update(imageBuffer).digest('hex');
    return hash;
};
