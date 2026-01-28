import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs'

const uplodOnCloudnery = async (file) => {
    try {
        cloudinary.config({
            cloud_name: process.env.COLUDNERY_NAME,
            api_key: process.env.COLUDNERY_API_KEY,
            api_secret: process.env.COLUDNERY_API_SECURETY
        });

        const result = await cloudinary.uploader
            .upload(file, {
                resource_type: "auto",
            });

        fs.unlinkSync(file);

        return result.secure_url;
    } catch (error) {
        fs.unlinkSync(file);
        console.log(error);
    }
}

export default uplodOnCloudnery;