import { useRef, useState } from "react";
import {
  View,
  Text,
  Image,
  Alert,
  TextInput,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { BlurView } from "expo-blur";
import * as ImagePicker from "expo-image-picker";
import { styles } from "./styled";
import { useNavigation } from "@react-navigation/native";
import { uploadImage } from "../../utils/storage";
import { fetchCoordinates } from "../../utils/geocode";
import { supabase } from "../../supabase/supabase";
import { CATEGORIES } from "../../constants/categories";
import DismissKeyboardOnTap from "../../components/DismissKeyboardOnTap";
import ZipCodePicker from "../../components/ZipCodePicker";

const LostItemScreen = () => {
  const navigation = useNavigation();
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  const [category, setCategory] = useState("Other");
  const [location, setLocation] = useState("");
  const [notes, setNotes] = useState("");

  const [errors, setErrors] = useState<{ category?: boolean; location?: boolean; notes?: boolean }>({});
  const notesRef = useRef<TextInput>(null);

  const validate = () => {
    let valid = true;
    const newErrors: { category?: boolean; location?: boolean; notes?: boolean } = {};

    if (!category.trim()) {
      newErrors.category = true;
      valid = false;
    }
    if (!location.trim()) {
      newErrors.location = true;
      valid = false;
    }
    if (!notes.trim()) {
      newErrors.notes = true;
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const pickImage = async () => {
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
      const url = await uploadImage(uri);
      setUploading(false);
      if (url) setUploadedUrl(url);
      else Alert.alert("Error", "Upload failed");
    }
  };

  const saveItem = async () => {
    Keyboard.dismiss();

    if (!validate()) {
      Alert.alert("Missing info", "Please fill all required fields.");
      return;
    }

    setUploading(true);
    const coords = await fetchCoordinates(location);

    const { error } = await supabase.from("lost_items").insert([{
      image_url: uploadedUrl,
      category,
      location,
      notes,
      latitude: coords.latitude,
      longitude: coords.longitude,
    }]);
    setUploading(false);

    if (error) {
      Alert.alert("Error", error.message);
      return;
    }

    Alert.alert("Success", "Lost item saved!");
    setImageUri(null);
    setUploadedUrl(null);
    setCategory("Other");
    setLocation("");
    setNotes("");
    setErrors({});
    navigation.navigate("Feed");
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
        style={[styles.chip, selected && styles.chipSelected]}
      >
        <Text style={[styles.chipText, selected && styles.chipTextSelected]}>{cat}</Text>
      </Pressable>
    );
  };

  
  return (
    <DismissKeyboardOnTap>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView contentContainerStyle={styles.page}>
          <BlurView intensity={30} tint="light" style={styles.card}>
            <Text style={styles.title}>Lost Item</Text>
            <Text style={styles.subtitle}>Report something you lost</Text>

            {/* Optional Image */}
            <Pressable style={styles.imageBox} onPress={pickImage}>
              {imageUri ? (
                <Image source={{ uri: imageUri }} style={styles.image} />
              ) : (
                <Text style={styles.imageText}>Tap to add photo (optional)</Text>
              )}
              {uploading && (
                <View style={styles.loadingOverlay}>
                  <ActivityIndicator size="large" color="white" />
                  <Text style={styles.loadingText}>Uploading...</Text>
                </View>
              )}
            </Pressable>

            {/* Category */}
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
              <Text style={styles.label}>Possible ZIP code*</Text>
              <ZipCodePicker
                style={[styles.input, errors.location && styles.errorInput]}
                value={location}
                onChange={(zip) => {
                  setLocation(zip);
                  if (errors.location) setErrors((prev) => ({ ...prev, location: false }));
                }}
              />
            </View>

            {/* Description/Notes */}
            <View style={styles.formGroup}>
              <Text style={styles.label}>Description*</Text>
              <TextInput
                ref={notesRef}
                style={[styles.input, styles.noteInput, errors.notes && styles.errorInput]}
                placeholder="Color, brand, condition..."
                value={notes}
                onChangeText={setNotes}
                multiline
                returnKeyType="done"
              />
            </View>

            <Pressable disabled={uploading} onPress={saveItem}>
              <LinearGradient
                colors={["#FF6B6B", "#FF4C4C"]}
                style={styles.saveButton}
              >
                <Text style={styles.saveText}>Report Lost Item</Text>
              </LinearGradient>
            </Pressable>
          </BlurView>
        </ScrollView>
      </KeyboardAvoidingView>
    </DismissKeyboardOnTap>
  );
};

export default LostItemScreen;
