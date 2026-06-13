const { Jimp } = require('jimp');

async function removeBackground() {
  const imagePath = 'src/assets/logo.png';
  const publicImagePath = 'public/logo.png';
  
  try {
    const image = await Jimp.read(imagePath);
    
    // Iterate over all pixels
    image.scan(0, 0, image.bitmap.width, image.bitmap.height, function (x, y, idx) {
      const red = image.bitmap.data[idx + 0];
      const green = image.bitmap.data[idx + 1];
      const blue = image.bitmap.data[idx + 2];
      
      // Black threshold
      if (red < 20 && green < 20 && blue < 20) {
        image.bitmap.data[idx + 3] = 0; // Set alpha to 0 (transparent)
      }
    });

    await image.write(imagePath);
    await image.write(publicImagePath);
    console.log('Background removed successfully.');
  } catch (error) {
    console.error('Error removing background:', error);
  }
}

removeBackground();
