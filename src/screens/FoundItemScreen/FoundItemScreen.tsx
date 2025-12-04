import React, { useState } from "react";
import { View, Text, StyleSheet, Button, Image, ActivityIndicator, Alert, TextInput } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { uploadImageToCloudinary } from "../../utils/cloudinary";
import { supabase } from "../../supabase/supabase";

 const FoundItemScreen = () => {
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [category, setCategory] = useState("");
  const [location, setLocation] = useState("");
  const [notes, setNotes] = useState("");

  const pickAndUploadImage = async () => {
    const { granted } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!granted) return alert("Permission required!");

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.7,
    });

    if (!result.canceled && result.assets.length > 0) {
      const uri = result.assets[0].uri;
      setImageUri(uri);
      setUploading(true);
      const url = await uploadImageToCloudinary(uri);
      setUploading(false);
      if (url) {
        setUploadedUrl(url);
        Alert.alert("Success", "Image uploaded!");
      } else {
        Alert.alert("Error", "Upload failed");
      }
    }
  };

  const saveItem = async () => {
    if (!uploadedUrl || !category || !location) {
      return alert("Upload image and fill category + location");
    }
    const { error } = await supabase.from("found_items").insert([
      {
        image_url: uploadedUrl,
        category,
        location,
        notes,
      },
    ]);
    if (error) {
      alert("Failed to save item: " + error.message);
    } else {
      alert("Item saved successfully!");
      setImageUri(null);
      setUploadedUrl(null);
      setCategory("");
      setLocation("");
      setNotes("");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Found Item Post</Text>
      {imageUri && <Image source={{ uri: imageUri }} style={styles.image} />}
      <Button title={uploading ? "Uploading..." : "Pick & Upload Image"} onPress={pickAndUploadImage} disabled={uploading} />
      <TextInput style={styles.input} placeholder="Category" value={category} onChangeText={setCategory} />
      <TextInput style={styles.input} placeholder="Location (ZIP)" value={location} onChangeText={setLocation} />
      <TextInput style={styles.input} placeholder="Notes (optional)" value={notes} onChangeText={setNotes} />
      <Button title="Save Item" onPress={saveItem} />
      {uploading && <ActivityIndicator style={{ marginTop: 16 }} size="large" color="#0000ff" />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fff", alignItems: "center", justifyContent: "center" },
  title: { fontSize: 28, marginBottom: 20, fontWeight: "700" },
  image: { width: 200, height: 200, marginBottom: 16, borderRadius: 12 },
  input: { width: "100%", borderWidth: 1, borderColor: "#ccc", padding: 8, marginVertical: 6, borderRadius: 8 },
});
export default FoundItemScreen;