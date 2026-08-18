import { supabase } from "../supabase/supabase";

const BUCKET = "item-photos";

export const uploadImage = async (imageUri: string): Promise<string | null> => {
  try {
    const response = await fetch(imageUri);
    const blob = await response.blob();
    const fileExt = imageUri.split(".").pop()?.split("?")[0] || "jpg";
    const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${fileExt}`;

    const { error } = await supabase.storage.from(BUCKET).upload(fileName, blob, {
      contentType: blob.type || "image/jpeg",
    });

    if (error) {
      console.log("Supabase storage upload error:", error);
      return null;
    }

    const { data } = supabase.storage.from(BUCKET).getPublicUrl(fileName);
    return data.publicUrl;
  } catch (err) {
    console.log("Supabase storage upload error:", err);
    return null;
  }
};
