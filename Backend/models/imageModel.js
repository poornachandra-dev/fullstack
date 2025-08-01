import mongoose from 'mongoose';

const imageSchema = new mongoose.Schema({
  picture: {
    picture_url: {
      type: String,
      required: true,
    },
    public_id: {
      type: String,
      required: true,
    }
  },
  uploadedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  uploadDate: {
    type: Date,
    default: Date.now,
  },
  likes: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User' 
  }],
  tags: [{
    type: String,
  }],
  hash: {
    type: String,
    required: true,
    unique: true,
  },
  blurHash:{
    type: String,
    required: true,
  }
});

const Image = mongoose.models.Image || mongoose.model('Image', imageSchema);

export default Image;
