import { useRef, useState } from "react";
import {
  View,
  Text,
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
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import { BlurView } from "expo-blur";
import * as ImagePicker from "expo-image-picker";
import { uploadImageToCloudinary } from "../../utils/cloudinary";
import { supabase } from "../../supabase/supabase";
import { styles } from "./styled";

// @TODO: Move to constants file
// @TODO: Rivise Funcionality

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
  const navigation = useNavigation();

  const validate = () => {
    let valid = true;
    const newErrors: { category?: boolean; location?: boolean } = {};
    if (!category.trim()) { newErrors.category = true; valid = false; }
    if (!location.trim()) { newErrors.location = true; valid = false; }
    setErrors(newErrors);
    return valid;
  };

  const pickImage = async (fromCamera: boolean) => {
    const permission = fromCamera
      ? await ImagePicker.requestCameraPermissionsAsync()
      : await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permission.granted) {
      Alert.alert("Permission required", "Camera or media access is required.");
      return;
    }

    const result = fromCamera
      ? await ImagePicker.launchCameraAsync({ allowsEditing: true, quality: 0.7 })
      : await ImagePicker.launchImageLibraryAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Images, allowsEditing: true, quality: 0.7 });

    if (!result.canceled && result.assets.length > 0) {
      const uri = result.assets[0].uri;
      setImageUri(uri);
      setUploading(true);
      const url = await uploadImageToCloudinary(uri);
      setUploading(false);
      if (url) setUploadedUrl(url);
      else Alert.alert("Error", "Upload failed");
    }
  };

  const pickImageOption = () => {
    Alert.alert("Add Photo", "Choose an option", [
      { text: "Camera", onPress: () => pickImage(true) },
      { text: "Library", onPress: () => pickImage(false) },
      { text: "Cancel", style: "cancel" },
    ]);
  };

  // Get coordinates from ZIP code
  const fetchCoordinates = async (zip: string) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?postalcode=${zip}&country=Germany&format=json&limit=1`
      );
      const data = await response.json();
      if (data.length > 0) {
        return { latitude: parseFloat(data[0].lat), longitude: parseFloat(data[0].lon) };
      } else {
        return { latitude: 52.5200, longitude: 13.4050 }; // fallback Berlin
      }
    } catch (error) {
      console.error("Error fetching coordinates:", error);
      return { latitude: 52.5200, longitude: 13.4050 };
    }
  };

  const saveItem = async () => {
    Keyboard.dismiss();

    if (!validate()) {
      Alert.alert("Missing info", "Category and Location are required.");
      return;
    }

    setUploading(true);
    const coords = await fetchCoordinates(location);

    const { error } = await supabase.from("found_items").insert([{
      image_url: uploadedUrl,
      category,
      location,
      notes,
      latitude: coords.latitude,
      longitude: coords.longitude,
    }]);
    setUploading(false);

    if (error) Alert.alert("Error", error.message);
    else {
      Alert.alert("Success", "Item saved!");
      setImageUri(null);
      setUploadedUrl(null);
      setCategory("Other");
      setLocation("");
      setNotes("");
      setErrors({});
      navigation.navigate("Feed");  
    }
  };

  const renderCategoryChip = (cat: string) => {
    const selected = category === cat;
    return (
      <Pressable
        key={cat}
        onPress={() => { setCategory(cat); if (errors.category) setErrors(prev => ({ ...prev, category: false })); }}
        style={[styles.chip, selected && styles.chipSelected]}
      >
        <Text style={[styles.chipText, selected && styles.chipTextSelected]}>{cat}</Text>
      </Pressable>
    );
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : undefined}>
        <ScrollView contentContainerStyle={styles.page}>
          <BlurView intensity={30} tint="light" style={styles.card}>
            <Text style={styles.title}>Found Item</Text>
            <Text style={styles.subtitle}>Post something you found</Text>

            <Pressable style={styles.imageBox} onPress={pickImageOption}>
              {imageUri ? <Image source={{ uri: imageUri }} style={styles.image} /> : <Text style={styles.imageText}>Tap to add photo</Text>}
              {uploading && (
                <View style={styles.loadingOverlay}>
                  <ActivityIndicator size="large" color="white" />
                  <Text style={styles.loadingText}>Uploading...</Text>
                </View>
              )}
            </Pressable>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Category *</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipContainer}>
                {CATEGORIES.map(renderCategoryChip)}
              </ScrollView>
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Exact Location Found*</Text>
              <TextInput
                ref={locationRef}
                style={[styles.input, errors.location && styles.errorInput]}
                placeholder="Street name, shop name, metro, etc."
                value={location}
                onChangeText={text => { setLocation(text); if (errors.location) setErrors(prev => ({ ...prev, location: false })); }}
                returnKeyType="next"
                onSubmitEditing={() => notesRef.current?.focus()}
              />
            </View>

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
              <LinearGradient colors={["#618071ff", "#6e6e6eff"]} style={styles.saveButton}>
                <Text style={styles.saveText}>Report Found Item</Text>
              </LinearGradient>
            </Pressable>
          </BlurView>
        </ScrollView>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
};

export default FoundItemScreen;
