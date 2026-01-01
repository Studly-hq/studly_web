/**
 * Cloudinary Configuration
 * 
 * Configuration settings for Cloudinary image uploads.
 */

export const CLOUDINARY_CLOUD_NAME = process.env.REACT_APP_CLOUDINARY_CLOUD_NAME || 'diyyc35fk';
export const CLOUDINARY_API_KEY = process.env.REACT_APP_CLOUDINARY_API_KEY || '153492438494613';

// Upload URL for uploads
export const CLOUDINARY_UPLOAD_URL = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`;

// Validate configuration
export const validateCloudinaryConfig = () => {
  if (!CLOUDINARY_CLOUD_NAME) {
    throw new Error('Cloudinary cloud name is not configured');
  }
  if (!CLOUDINARY_API_KEY) {
    throw new Error('Cloudinary API key is not configured');
  }
  return true;
};
