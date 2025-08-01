import express from "express";
import axios from 'axios';
import authMiddleware from "../middlewares/authMiddleware.js";
import aiGenImageModel from "../models/aiGenImageModel.js";
const aigenRouter = express.Router();


aigenRouter.post('/generate-images', authMiddleware, async (req, res) => {
    const { userPrompt, imgCount } = req.body;
  
    const options = {
      method: 'POST',
      url: 'https://api.monsterapi.ai/v1/generate/txt2img',
      headers: {
        'Authorization': `Bearer ${process.env.AIGEN_API_TOKEN}`,
        'Content-Type': 'application/json'
      },
      data: {
        "aspect_ratio":"square",
        "prompt": userPrompt,
        "samples": imgCount,
        "safe_filter": true,
      }
    };
  
    try {
      const response = await axios.request(options);
      const { process_id, status_url } = response.data;
      res.status(200).json({ process_id, status_url });
    } catch (error) {
      console.error('Error generating images:', error);
      res.status(500).json({ message: 'Error generating images', error });
    }
  });

  // Endpoint to fetch image generation status
aigenRouter.get('/task-status', authMiddleware, async (req, res) => {
    const { statusUrl } = req.query;
  
    const options = {
      method: 'GET',
      url: statusUrl,
      headers: {
        'Authorization': `Bearer ${process.env.AIGEN_API_TOKEN}`,
        'Accept': 'application/json'
      }
    };
  
    try {
      const response = await axios.request(options);
      res.status(200).json(response.data);
    } catch (error) {
      console.error('Error fetching task status:', error);
      res.status(500).json({ message: 'Error fetching task status', error });
    }
});

aigenRouter.post('/store-images', authMiddleware, async (req, res) => {
  const { images } = req.body;
  const createdBy = req.userId;

  try {
    // Store images in MongoDB
    const imageDocs = images.map(imgUrl => ({
      aigen_picture_url: imgUrl,
      createdBy
    }));

    await aiGenImageModel.insertMany(imageDocs);

    res.status(200).json({ message: 'Images stored successfully' });
  } catch (error) {
    console.error('Error storing images:', error);
    res.status(500).json({ message: 'Error storing images', error });
  }
});

  
export default aigenRouter;