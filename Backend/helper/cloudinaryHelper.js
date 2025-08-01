import cloudinary from '../config/cloudinaryconfig.js';

const uploadFileOnCloudinary = async (filePath, folderName) => {
    try {
        // Determine the file type based on the file extension
        const fileType = filePath.toLowerCase().endsWith('.mp4') || filePath.toLowerCase().endsWith('.mov') || filePath.toLowerCase().endsWith('.avi') ? 'video' : 'image';

        const options = {
            folder: folderName,
        };

        // Add specific options for video files if needed
        if (fileType === 'video') {
            options.resource_type = 'video'; // Explicitly specify that it's a video
            // You can add other video-specific options here if needed
        }

        // Upload the file to Cloudinary
        const result = await cloudinary.uploader.upload(filePath, options);
        
        // Return the result which contains details like secure_url, public_id, etc.
        return result;
    } catch (error) {
        console.error('Error uploading to Cloudinary:', error);
        throw new Error(error.message || 'Cloudinary upload error');
    }
};

export { uploadFileOnCloudinary };
