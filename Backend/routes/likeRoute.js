import express from 'express';
import authMiddleware from '../middlewares/authMiddleware.js';
// import Image from'../models/imageModel.js';
import Media from '../models/mediaModel.js';

const likeRoute = express.Router();

likeRoute.post('/', authMiddleware, async (req, res) => {
  const { mediaId } = req.body;
  const userId = req.userId;
  
  try {
    const media = await Media.findById(mediaId);

    if (!media) {
      return res.status(404).json({ success: false, message: 'Media not found' });
    }

    // Check if the user has already liked the image.
    const isLiked = media.likes.includes(userId);

    // Toggle like/unlike
    if (isLiked) {
      media.likes.pull(userId); // Unlike (remove userId from likes array)
    } else {
      media.likes.push(userId); // Like (add userId to likes array)
    }

    await media.save();

    res.status(200).json({
      success: true,
      isLiked: !isLiked,
      likesCount: media.likes.length,
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
});

export default likeRoute;
