import mongoose from 'mongoose';

const mediaSchema = new mongoose.Schema(
    {
        media_url: {
            type: String,
            required: true, // URL for accessing the media (image or video)
        },
        public_id: {
            type: String,
            required: true, // Cloudinary public ID for managing the file
        },
        type: {
            type: String,
            enum: ['image', 'video'], // Media type: image or video
            required: true,
        },
        uploadedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User', // Reference to the user who uploaded the media
            required: true,
        },
        tags: {
            type: [String],
            default: [], // Tags for categorization or filtering
        },
        hash: {
            type: String,
            unique: true, // Unique hash for deduplication (applies to images)
            sparse: true, // Optional field for videos (not hashed)
        },
        blurHash: {
            type: String,
            default: null, // BlurHash for placeholder images (only for images)
        },
        likes: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User', // Users who liked this media
            }
        ],
    },
    { timestamps: true } // Automatically manages `createdAt` and `updatedAt`
);

const Media = mongoose.models.Media || mongoose.model('Media', mediaSchema);

export default Media;
