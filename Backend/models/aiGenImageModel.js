import mongoose from "mongoose";

const aiGenImageSchema = new mongoose.Schema({
    aigen_picture_url:{
        type: String,
        required: true,
    },
    createdBy :{ 
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
})

const aiGenImageModel = mongoose.models.aiImage || mongoose.model('aiImage', aiGenImageSchema);

export default aiGenImageModel;
