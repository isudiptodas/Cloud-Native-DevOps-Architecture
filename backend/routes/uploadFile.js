import express from 'express';
import { connectDB } from '../config/connectDB.js';
import multer from 'multer';
import pdfParse from 'pdf-parse';

const router = express.Router();

router.post('/api/upload-file', multer({ storage: multer.memoryStorage() }).single('file'), async (req, res) => {

    if (!req.file) {
        return res.status(400).json({
            message: "No file uploaded"
        });
    }

    try {

        const data = pdfParse(req.file.buffer);
        console.log(data);

        return res.status(200).json({
            success: true,
            message: "User created successfull",
        });

    } catch (err) {
        console.log(err);
        return res.status(500).json({
            success: false,
            message: "Something went wrong",
        });
    }
});

export default router;