import axios from "axios";
import { CLOUDINARY_CLOUD_NAME, CLOUDINARY_UPLOAD_PRESET } from "@env";

export const uploadImageToCloudinary = async (imageUri: string): Promise<string | null> => {
  const data = new FormData();
  data.append("file", {
    uri: imageUri,
    type: "image/jpeg",
    name: "upload.jpg",
  } as any);
  data.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);

  try {
    const res = await axios.post(
      `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
      data,
      { headers: { "Content-Type": "multipart/form-data" } }
    );
    return res.data.secure_url;
  } catch (err) {
    console.log("Cloudinary upload error:", err);
    return null;
  }
};
