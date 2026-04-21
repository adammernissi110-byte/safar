const cloudinary = require('cloudinary').v2;
const multer = require('multer');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif|webp/;
  const extname = allowedTypes.test(file.mimetype.toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error('Only image files are allowed (jpeg, jpg, png, gif, webp)'));
  }
};

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter
});

const uploadToCloudinary = (file, folder = 'morocco-travel') => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload(
      file.buffer.toString('base64'),
      {
        folder,
        resource_type: 'auto'
      },
      (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve({
            url: result.secure_url,
            publicId: result.public_id
          });
        }
      }
    );
  });
};

const uploadMultipleToCloudinary = async (files, folder = 'morocco-travel') => {
  const uploadPromises = files.map(file => uploadToCloudinary(file, folder));
  return await Promise.all(uploadPromises);
};

module.exports = {
  upload,
  uploadToCloudinary,
  uploadMultipleToCloudinary,
  cloudinary
};
