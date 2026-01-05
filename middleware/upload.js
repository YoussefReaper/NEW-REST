const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const profileStorage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'profile_pictures',
        allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
        transformation: [{ width: 500, height: 500, crop: 'limit'}]
    }
});

const backgroundStorage = new CloudinaryStorage({
    cloudinary,
    params: async (req,file) => {
        const isVideo = file.mimetype.startsWith('video/');
        return {
            folder: 'backgrounds',
            allowed_formats: ['jpg', 'jpeg', 'png', 'webp', 'mp4', 'webm'],
            resource_type: isVideo ? 'video' : 'image',
            transformation: [{ width: 1920, height: 1080, crop: 'limit'}]
        };
    }
});

const bannerStorage = new CloudinaryStorage({
    cloudinary,
    params: async (req,file) => {
        return {
            folder: 'banners',
            allowed_formats: ['jpg', 'jpeg', 'png', 'webp',],
            transformation: [{ width: 600, height: 300, crop: 'limit'}]
        };
    }
});

const uploadProfile = multer({ storage: profileStorage });
const uploadBackground = multer({ storage: backgroundStorage });
const uploadBanner = multer({ storage: bannerStorage });

module.exports = { uploadProfile, uploadBackground, uploadBanner };