import React, { useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Button,
  Image,
  ActivityIndicator,
  Alert,
  TextInput,
  Keyboard,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
  Platform,
} from "react-native";

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

  const [errors, setErrors] = useState<{ category?: boolean; location?: boolean }>({});

  const locationRef = useRef<TextInput>(null);
  const notesRef = useRef<TextInput>(null);

  const validate = () => {
    let valid = true;
    const newErrors: { category?: boolean; location?: boolean } = {};

    if (!category.trim()) {
      newErrors.category = true;
      valid = false;
    }

    if (!location.trim()) {
      newErrors.location = true;
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const pickAndUploadImage = async () => {
    const { granted } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!granted) {
      Alert.alert("Permission required", "Media library access is required.");
      return;
    }

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

  const postItem = async () => {
    Keyboard.dismiss();

    if (!uploadedUrl) {
      Alert.alert("Missing image", "Please upload an image first.");
      return;
    }

    if (!validate()) {
      Alert.alert("Missing info", "Category and location are required");
      return;
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
      Alert.alert("Error", error.message);
    } else {
      Alert.alert("Success", "Item posted successfully!");
      setImageUri(null);
      setUploadedUrl(null);
      setCategory("");
      setLocation("");
      setNotes("");
      setErrors({});
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <View style={styles.container}>
          <Text style={styles.title}>Found Item Post</Text>

          {imageUri && <Image source={{ uri: imageUri }} style={styles.image} />}

          <Button
            title={uploading ? "Uploading..." : "Pick & Upload Image"}
            onPress={pickAndUploadImage}
            disabled={uploading}
          />

          <TextInput
            style={[styles.input, errors.category && styles.errorInput]}
            placeholder="Category"
            value={category}
            onChangeText={(text) => {
              setCategory(text);
              if (errors.category) {
                setErrors((prev) => ({ ...prev, category: false }));
              }
            }}
            returnKeyType="next"
            onSubmitEditing={() => locationRef.current?.focus()}
            blurOnSubmit={false}
          />

          <TextInput
            ref={locationRef}
            style={[styles.input, errors.location && styles.errorInput]}
            placeholder="Location (ZIP)"
            value={location}
            onChangeText={(text) => {
              setLocation(text);
              if (errors.location) {
                setErrors((prev) => ({ ...prev, location: false }));
              }
            }}
            keyboardType="number-pad"
            returnKeyType="next"
            onSubmitEditing={() => notesRef.current?.focus()}
            blurOnSubmit={false}
          />

          <TextInput
            ref={notesRef}
            style={styles.input}
            placeholder="Notes (optional)"
            value={notes}
            onChangeText={setNotes}
            returnKeyType="done"
            onSubmitEditing={Keyboard.dismiss}
            multiline
          />

          <View style={{ marginTop: 10 }}>
            <Button title="Post Item" onPress={postItem} />
          </View>

          {uploading && (
            <ActivityIndicator
              style={{ marginTop: 16 }}
              size="large"
              color="#0000ff"
            />
          )}
        </View>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 28,
    marginBottom: 20,
    fontWeight: "700",
  },
  image: {
    width: 200,
    height: 200,
    marginBottom: 16,
    borderRadius: 12,
  },
  input: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 12,
    marginVertical: 6,
    borderRadius: 8,
    backgroundColor: "#fafafa",
  },
  errorInput: {
    borderColor: "red",
  },
});

export default FoundItemScreen;
