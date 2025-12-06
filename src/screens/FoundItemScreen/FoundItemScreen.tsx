import React, { useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  Alert,
  TextInput,
  Keyboard,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ActivityIndicator,
  ScrollView,
  FlatList,
} from "react-native";

import { LinearGradient } from "expo-linear-gradient";
import { BlurView } from "expo-blur";
import * as ImagePicker from "expo-image-picker";
import { uploadImageToCloudinary } from "../../utils/cloudinary";
import { supabase } from "../../supabase/supabase";

const CATEGORIES = [
  "Phone",
  "Wallet",
  "Keys",
  "Bag / Backpack",
  "Clothing",
  "Jewelry",
  "Electronics",
  "Documents",
  "Glasses", 
   "Other",
];

const FoundItemScreen = () => {
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  const [category, setCategory] = useState("Other");
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
      } else {
        Alert.alert("Error", "Upload failed");
      }
    }
  };

  const saveItem = async () => {
    Keyboard.dismiss();

    if (!uploadedUrl) {
      Alert.alert("Missing image", "Please upload an image first.");
      return;
    }

    if (!validate()) {
      Alert.alert("Missing info", "Category and Location are required.");
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
      Alert.alert("Success", "Item saved!");
      setImageUri(null);
      setUploadedUrl(null);
      setCategory("Other");
      setLocation("");
      setNotes("");
      setErrors({});
    }
  };

  const renderCategoryChip = (cat: string) => {
    const selected = category === cat;
    return (
      <Pressable
        key={cat}
        onPress={() => {
          setCategory(cat);
          if (errors.category) setErrors((prev) => ({ ...prev, category: false }));
        }}
        style={[
          styles.chip,
          selected && styles.chipSelected,
        ]}
      >
        <Text style={[styles.chipText, selected && styles.chipTextSelected]}>{cat}</Text>
      </Pressable>
    );
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView contentContainerStyle={styles.page}>
          <BlurView intensity={30} tint="light" style={styles.card}>
            <Text style={styles.title}>Found Item</Text>
            <Text style={styles.subtitle}>Post something you found</Text>

            {/* Image preview */}
            <Pressable style={styles.imageBox} onPress={pickAndUploadImage}>
              {imageUri ? (
                <Image source={{ uri: imageUri }} style={styles.image} />
              ) : (
                <Text style={styles.imageText}>Tap to add photo</Text>
              )}
              {uploading && (
                <View style={styles.loadingOverlay}>
                  <ActivityIndicator size="large" color="white" />
                  <Text style={styles.loadingText}>Uploading...</Text>
                </View>
              )}
            </Pressable>

            {/* Category Chips */}
            <View style={styles.formGroup}>
              <Text style={styles.label}>Category *</Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.chipContainer}
              >
                {CATEGORIES.map(renderCategoryChip)}
              </ScrollView>
            </View>

            {/* Location */}
            <View style={styles.formGroup}>
              <Text style={styles.label}>Location (ZIP) *</Text>
              <TextInput
                ref={locationRef}
                style={[styles.input, errors.location && styles.errorInput]}
                placeholder="e.g. 10001"
                keyboardType="number-pad"
                value={location}
                onChangeText={(text) => {
                  setLocation(text);
                  if (errors.location)
                    setErrors((prev) => ({ ...prev, location: false }));
                }}
                returnKeyType="next"
                onSubmitEditing={() => notesRef.current?.focus()}
              />
            </View>

            {/* Notes */}
            <View style={styles.formGroup}>
              <Text style={styles.label}>Notes</Text>
              <TextInput
                ref={notesRef}
                style={[styles.input, styles.noteInput]}
                placeholder="Color, brand, condition..."
                value={notes}
                onChangeText={setNotes}
                multiline
                returnKeyType="done"
              />
            </View>

            <Pressable disabled={uploading} onPress={saveItem}>
              <LinearGradient
                colors={["#616980ff", "#302e2eff"]}
                style={styles.saveButton}
              >
                <Text style={styles.saveText}>Post Item</Text>
              </LinearGradient>
            </Pressable>
          </BlurView>
        </ScrollView>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  page: {
    flexGrow: 1,
    backgroundColor: "#f0f2f6",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },

  card: {
    width: "100%",
    borderRadius: 24,
    padding: 24,
    backgroundColor: "rgba(255,255,255,0.9)",
  },

  title: {
    fontSize: 26,
    fontWeight: "800",
    textAlign: "center",
    marginBottom: 4,
  },

  subtitle: {
    textAlign: "center",
    color: "#666",
    marginBottom: 16,
  },

  imageBox: {
    width: "100%",
    height: 220,
    backgroundColor: "#e5e7eb",
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
    overflow: "hidden",
  },

  image: {
    width: "100%",
    height: "100%",
  },

  imageText: {
    color: "#444",
    fontSize: 16,
    fontWeight: "600",
  },

  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.4)",
    alignItems: "center",
    justifyContent: "center",
  },

  loadingText: {
    marginTop: 10,
    color: "white",
    fontWeight: "600",
  },

  formGroup: {
    marginBottom: 12,
  },

  label: {
    marginBottom: 6,
    fontWeight: "600",
  },

  chipContainer: {
    flexDirection: "row",
    marginVertical: 6,
  },

  chip: {
    paddingVertical: 6,
    paddingHorizontal: 14,
    backgroundColor: "#f0f0f0",
    borderRadius: 20,
    marginRight: 10,
  },

  chipSelected: {
    backgroundColor: "#616980ff",
  },

  chipText: {
    color: "#444",
    fontWeight: "500",
  },

  chipTextSelected: {
    color: "white",
    fontWeight: "700",
  },

  input: {
    backgroundColor: "#fff",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 12,
    fontSize: 15,
  },

  noteInput: {
    minHeight: 80,
    textAlignVertical: "top",
  },

  errorInput: {
    borderColor: "#ef4444",
  },

  saveButton: {
    marginTop: 15,
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: "center",
  },

  saveText: {
    color: "white",
    fontSize: 16,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
});

export default FoundItemScreen;
