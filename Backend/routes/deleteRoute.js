import express from 'express'
import authMiddleware from '../middlewares/authMiddleware.js';
// import Image from '../models/imageModel.js';
import Media from '../models/mediaModel.js';



const deleteRoute = express.Router();

deleteRoute.delete('/:imgId',authMiddleware,async (req,res) => {
    const imageId = req.params.imgId;
    const userId = req.userId;
    try{
        const media = await Media.findOneAndDelete({ _id: imageId,uploadedBy: userId});
        if(!media){
            return res.status(404).json({message: 'Media not found!'});
        }

        await Media.deleteOne({_id:imageId,usrId:userId});
        return res.json({message: 'Media deleted successfully!'});
    }catch(error){
        res.status(500).json({ message: 'Internal Server Error', error: error.message });s
    }
});
deleteRoute.delete('/delete-account',authMiddleware,async (req,res) => {
    const userId = req.userId;
    try{
        await UserModel.deleteOne({_id:userId});
        return res.json({message: 'Account deleted successfully!'});
    }catch(error){
        res.status(500).json({ message: 'Internal Server Error', error: error.message });s
    }
});

export default deleteRoute;