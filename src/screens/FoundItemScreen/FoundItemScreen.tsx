import React, { useState } from "react";
import { View, Text, StyleSheet, Button, Image,   } from "react-native";
import * as ImagePicker from "expo-image-picker";

export default function FoundItemScreen() {
  const [imageUri, setImageUri] = useState<string | null>(null);

  const pickImage = async () => {
     const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      alert("Permission to access gallery is required!");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.7,
    });

    if (!result.canceled && result.assets.length > 0) {
      setImageUri(result.assets[0].uri);
    }
  };

   

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Found Item Post</Text>
      {imageUri && <Image source={{ uri: imageUri }} style={styles.image} />}
      <Button title="Pick Image" onPress={pickImage} />
      </View>
  );
}

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
});
