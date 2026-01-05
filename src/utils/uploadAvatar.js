import { CLOUDINARY_UPLOAD_URL, CLOUDINARY_API_KEY, validateCloudinaryConfig } from './cloudinaryConfig';

const generateSignature = async (paramsToSign, apiSecret) => {
  const sortedParams = Object.keys(paramsToSign)
    .sort()
    .map(key => `${key}=${paramsToSign[key]}`)
    .join('&');
  
  const stringToSign = sortedParams + apiSecret;
  
  const encoder = new TextEncoder();
  const data = encoder.encode(stringToSign);
  const hashBuffer = await crypto.subtle.digest('SHA-1', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  
  return hashHex;
};

export const uploadAvatarToCloudinary = async (file) => {
  try {
    validateCloudinaryConfig();

    const apiSecret = process.env.REACT_APP_CLOUDINARY_API_SECRET;
    if (!apiSecret) {
      throw new Error('Cloudinary API secret is not configured');
    }

    const timestamp = Math.round(Date.now() / 1000);

    const paramsToSign = {
      timestamp: timestamp,
      folder: 'studly/avatars'
    };

    const signature = await generateSignature(paramsToSign, apiSecret);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('timestamp', timestamp);
    formData.append('api_key', CLOUDINARY_API_KEY);
    formData.append('signature', signature);
    formData.append('folder', 'studly/avatars');

    const response = await fetch(CLOUDINARY_UPLOAD_URL, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Cloudinary error response:', errorData);
      throw new Error(errorData.error?.message || 'Failed to upload avatar to Cloudinary');
    }

    const data = await response.json();
    
    return data.secure_url;
  } catch (error) {
    console.error('Cloudinary avatar upload error:', error);
    throw new Error(`Avatar upload failed: ${error.message}`);
  }
};
