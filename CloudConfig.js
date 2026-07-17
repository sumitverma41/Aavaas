// PROCESS OF STORING OUR FILE TO CLOUDINARY CLOUD STORAGE


const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');


cloudinary.config({
    //YHA KEY KE NAME DEFAULT YHI LIKHNA HAI
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET
})

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'Wanderlust_dev',
    allowedFormats:["png","jpg","jpeg"] ,// supports promises as well
   
  },
});

module.exports={
    cloudinary,
    storage
}