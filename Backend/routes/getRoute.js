import express from 'express';
import authMiddleware from '../middlewares/authMiddleware.js';
// import Image from '../models/imageModel.js';
import Media from '../models/mediaModel.js';

import UserModel from '../models/userModel.js';
import aiGenImageModel from '../models/aiGenImageModel.js';


const getRoute = express.Router();

getRoute.get('/my-uploads',authMiddleware,async (req,res) => {
    const userId = req.userId;
    try{
        const myMedia = await Media.find({uploadedBy:userId});
        
        res.status(200).json({
            success: true,
            mymedia: myMedia,
            message: "Images fetched successfully"
            });

    }catch(error){
        console.log(error);
    }    
});
 
getRoute.get('/get-home-media',async (req,res) => {
    try{
        const media = await Media.aggregate([{ $match: { type: { $ne: "video" } } },{$sample:{size:15}}]);
        res.status(200).json({
            success: true,
            media,
            message: "Media fetched successfully"
            });
    }catch(error){
        console.log(error);
    }
});

getRoute.get('/get-all-media', authMiddleware, async (req, res) => {
    try {
        const { page = 1, limit = 20, search = '' } = req.query;
        const userId = req.userId;

        // Create a search query object
        const searchQuery = search
            ? { tags: { $regex: new RegExp(search, 'i') } }
            : {};

        
        // Fetch images with pagination
        
        const media = await Media.find(searchQuery)
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(Number(limit));

        // Fetch user details for each image
        const meidaWithUserNames = await Promise.all(media.map(async (item) => {
            const user = await UserModel.findById(item.uploadedBy);
            return {
                _id: item._id,
                url: item.media_url,
                uploader: user.name,
                isLiked: item.likes.includes(userId),
                blurHash: item.blurHash,
                type: item.type,
            };
        }));

        res.status(200).json({
            success: true,
            media: meidaWithUserNames,
            message: "Media fetched successfully"
        });
    } catch (error) {
        console.error('Error in get-media:', error.message);
        res.status(500).json({ success: false, message: 'Internal Server Error', error: error.toString() });
    }    
});

getRoute.get('/fav-media',authMiddleware,async (req,res) => {
    const userId = req.userId;
    try{
        const fav_media = await Media.find({likes:{ $in: userId }});
        
        res.status(200).json({
            success: true,
            media: fav_media,
            message: "Favourite Media fetched successfully"
            });

    }catch(error){
        console.log(error);
    }    
});

getRoute.get('/get-aigen-images',authMiddleware,async (req,res) => {
    const userId = req.userId;
    try{
        const aiimages = await aiGenImageModel.find({createdBy: userId}).sort({ createdAt : -1 });
        
        res.status(200).json({
            success: true,
            uid: userId,
            images: aiimages,
            message: "Ai-Images fetched successfully"
            });

    }catch(error){
        console.log(error);
    }
});

getRoute.get('/get-all-aigen-images/',authMiddleware,async (req,res) => {
    try{
        const { page = 1, limit = 20 } = req.query;

        const aiimages = await aiGenImageModel.find({})
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(Number(limit));

        // const aiimages = await aiGenImageModel.find({}).sort({ createdAt : -1 });
        
        res.status(200).json({
            success: true,
            images: aiimages,
            message: "Ai-Images fetched successfully"
            });

    }catch(error){
        console.log(error);
    }
})

getRoute.get('/random-image',async (req,res) => {
    try{
        const RandomImg = await Image.aggregate([{ $sample: { size: 1 } }]);
        const user = await UserModel.findById(RandomImg[0].uploadedBy);
        res.status(200).json({
            success: true,
            RandomImg: {
                url: RandomImg[0].picture.picture_url,
                uploader: user.name
            },
            message: "Random Image fetched successfully"
            });
    }catch(error){
        console.log(error);
    }
});

export default getRoute;