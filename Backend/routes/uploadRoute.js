import express from 'express'
import { addImageController } from '../controllers/imageController.js';
import { uploader } from '../middlewares/multerMiddleware.js';
import authMiddleware from '../middlewares/authMiddleware.js';
const uploadRoute = express.Router();

uploadRoute.post("/",authMiddleware,uploader.array('files',10),addImageController);

export default uploadRoute; 
