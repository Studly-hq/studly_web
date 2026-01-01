/**
 * Cloudinary Upload Utility
 * 
 * Handles uploading images to Cloudinary using signed uploads.
 * Note: This implementation uses client-side signing which requires the API secret.
 * For production, consider moving the signature generation to your backend.
 */

import { CLOUDINARY_UPLOAD_URL, CLOUDINARY_API_KEY, validateCloudinaryConfig } from './cloudinaryConfig';

/**
 * Generate SHA-1 hash for signature (simplified version)
 * In production, this should be done on the backend for security
 */
const generateSignature = async (paramsToSign, apiSecret) => {
  const sortedParams = Object.keys(paramsToSign)
    .sort()
    .map(key => `${key}=${paramsToSign[key]}`)
    .join('&');
  
  const stringToSign = sortedParams + apiSecret;
  
  // Use Web Crypto API to generate SHA-1 hash
  const encoder = new TextEncoder();
  const data = encoder.encode(stringToSign);
  const hashBuffer = await crypto.subtle.digest('SHA-1', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  
  return hashHex;
};

/**
 * Upload an image file to Cloudinary using signed upload
 * @param {File} file - The image file to upload
 * @returns {Promise<string>} - The secure URL of the uploaded image
 */
export const uploadToCloudinary = async (file) => {
  try {
    // Validate configuration
    validateCloudinaryConfig();

    // Get API secret from environment (in production, do this on backend)
    const apiSecret = process.env.REACT_APP_CLOUDINARY_API_SECRET;
    if (!apiSecret) {
      throw new Error('Cloudinary API secret is not configured');
    }

    // Generate timestamp
    const timestamp = Math.round(Date.now() / 1000);

    // Parameters to sign (excluding file and api_key)
    const paramsToSign = {
      timestamp: timestamp,
      folder: 'studly/posts' // Optional: organize uploads in a folder
    };

    // Generate signature
    const signature = await generateSignature(paramsToSign, apiSecret);

    // Create form data
    const formData = new FormData();
    formData.append('file', file);
    formData.append('timestamp', timestamp);
    formData.append('api_key', CLOUDINARY_API_KEY);
    formData.append('signature', signature);
    formData.append('folder', 'studly/posts');

    // Upload to Cloudinary
    const response = await fetch(CLOUDINARY_UPLOAD_URL, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Cloudinary error response:', errorData);
      throw new Error(errorData.error?.message || 'Failed to upload image to Cloudinary');
    }

    const data = await response.json();
    
    // Return the secure URL
    return data.secure_url;
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    throw new Error(`Image upload failed: ${error.message}`);
  }
};

/**
 * Upload multiple images to Cloudinary in parallel
 * @param {File[]} files - Array of image files to upload
 * @returns {Promise<string[]>} - Array of secure URLs of uploaded images
 */
export const uploadMultipleToCloudinary = async (files) => {
  try {
    const uploadPromises = files.map(file => uploadToCloudinary(file));
    const urls = await Promise.all(uploadPromises);
    return urls;
  } catch (error) {
    console.error('Multiple upload error:', error);
    throw error;
  }
};
