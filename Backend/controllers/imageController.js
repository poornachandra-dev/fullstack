import { uploadFileOnCloudinary } from '../helper/cloudinaryHelper.js';
import { generateImageHash } from '../utils/hashImage.js';
import { generateBlurHash } from '../utils/blurHashUtils.js';
// import Image from '../models/imageModel.js';
import Media from '../models/mediaModel.js';
import fs from 'fs';

const addImageController = async (req, res) => {
    try {
        // console.log('addImageController called');
        const tags = req.body['tags'];
        const userId = req.userId;
        const files = req.files; // Multer array upload

        if (!files || files.length === 0) {
            return res.status(400).json({ message: "No files uploaded." });
        }

        const uploadedMedia = [];
        // console.log(tags);

        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            const fileTags = Array.isArray(tags) ? tags[i] : tags;
            const fileType = file.mimetype.startsWith('image/') ? 'image' : 'video';
            const fileHash = fileType=== 'image' ? await generateImageHash(file.path):null;

            // Check for duplicate hash if it's an image
            if (fileType === 'image' && fileHash) {
                const existingMedia = await Media.findOne({ hash: fileHash });
                if (existingMedia) {
                    console.log(`Duplicate image detected: ${file.originalname}`);
                    continue; // Skip duplicate image
                }
            }


            try {
                // Upload the file to Cloudinary
                const result = await uploadFileOnCloudinary(file.path, fileType === 'image' ? 'Images' : 'Videos');
                
                // Generate blur hash only for images
                const blurHash = fileType === 'image' ? await generateBlurHash(file.path) : null;

                const newMedia = new Media({
                    media_url: result.secure_url,
                    public_id: result.public_id,
                    type: fileType,
                    uploadedBy: userId,
                    tags: fileTags ? fileTags.split(',') : [],
                    hash: fileType === 'image' ? fileHash : undefined, // Only images will have a hash
                    blurHash: blurHash, // Only images will have a blur hash
                });

                await newMedia.save();
                uploadedMedia.push(newMedia);
            } catch (uploadError) {
                console.error(`Error uploading file ${file.originalname}:`, uploadError);
                continue; // Skip this file and proceed with the next
            }

            
            // Retry mechanism for file deletion
            try {
                await fs.promises.unlink(file.path);
            } catch (error) {
                console.error(`Failed to delete the file from server`, error);
            }
        }
        // res.status(201).json({ success: true, images: uploadedImages });
        if (uploadedMedia.length > 0) {
            return res.status(201).json({ success: true, media: uploadedMedia });
        } else {
            return res.status(400).json({ success: false, message: 'No valid images were uploaded.' });
        }

    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: 'Media upload error' });
    }
};

export { addImageController };
