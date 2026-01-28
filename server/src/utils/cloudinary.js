const cloudinary = require('cloudinary').v2;

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const uploadToCloudinary = async (file, folder) => {
    return new Promise((resolve, reject) => {
        cloudinary.uploader.upload(file, { folder, resource_type: "auto" }, (error, result) => {
            if (error) reject(error);
            else resolve({
                public_id: result.public_id,
                url: result.secure_url
            });
        });
    });
};

const deleteFromCloudinary = async (public_id, resource_type = "image") => {
    return new Promise((resolve, reject) => {
        cloudinary.uploader.destroy(public_id, { resource_type }, (error, result) => {
            if (error) reject(error);
            else resolve(result);
        });
    });
};

module.exports = { uploadToCloudinary, deleteFromCloudinary, cloudinary };
