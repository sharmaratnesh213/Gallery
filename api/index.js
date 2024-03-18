const express = require('express');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const dotenv = require('dotenv');
const cors = require('cors');

// Load environment variables
dotenv.config();

const app = express();

app.use(cors());

// Configure Multer for file uploads
const upload = multer();

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

// POST endpoint for image upload
app.post('/upload', upload.single('image'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded' });
    }

    const imageFile = req.file.buffer; // Get the image data from Multer

    cloudinary.uploader.upload_stream({ resource_type: 'auto' }, (error, result) => {
        if (error) {
            return res.status(500).json({ message: 'Upload to Cloudinary failed' });
        }

        res.status(200).json({ url: result.secure_url });
    }).end(imageFile);
});

app.get('/getImages', (req, res) => {
    cloudinary.api.resources({ type: 'upload', max_results: 500 }, (error, result) => {
        if (error) {
            return res.status(500).json({ message: 'Cloudinary API error' });
        }

        res.status(200).json(result.resources);
    });
});

const PORT = 5000;

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});
