import multer from "multer";
import {v4 as uuidv4} from 'uuid';
import path from 'path';

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'public/uploads')
    },
    filename: function (req, file, cb) {
      const newfileName = uuidv4() + path.extname(file.originalname);
      cb(null, newfileName)
    }
  })
  
export const uploader = multer({ storage: storage })