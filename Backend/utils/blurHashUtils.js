import { encode } from 'blurhash';
import { createCanvas, loadImage } from 'canvas';

export const generateBlurHash = async (imagePath) => {
    const image = await loadImage(imagePath);
    const canvas = createCanvas(image.width, image.height);
    const ctx = canvas.getContext('2d');
    ctx.drawImage(image, 0, 0);
    const imageData = ctx.getImageData(0, 0, image.width, image.height);
    return encode(imageData.data, image.width, image.height, 4, 4);
}; 