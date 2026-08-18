import { Text, Image, ScrollView, Button, View, Alert } from "react-native";
import { useRoute } from "@react-navigation/native";
import { styles } from "./styled";
import React from "react";

export type ItemType = "found" | "lost";

type RootStackParamList = {
  ItemDetails: {
    id: string;
    type: ItemType;
    image_url: string | null;
    category: string | null;
    location: string;
    notes?: string;
    created_at: string;
  };
};

const ItemDetailsScreen = () => {
  const route = useRoute();
  const { type, image_url, category, location, notes } =
    route.params as RootStackParamList["ItemDetails"];

  const isFound = type === "found";

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={[styles.badge, isFound ? styles.badgeFound : styles.badgeLost]}>
        <Text style={styles.badgeText}>{isFound ? "FOUND" : "LOST"}</Text>
      </View>

      {image_url && <Image source={{ uri: image_url }} style={styles.image} />}

      <Text style={styles.label}>Category:</Text>
      <Text style={styles.text}>{category || "Other"}</Text>

      <Text style={styles.label}>{isFound ? "Location found:" : "Last seen near:"}</Text>
      <Text style={styles.text}>{location}</Text>

      {notes && (
        <>
          <Text style={styles.label}>Notes:</Text>
          <Text style={styles.text}>{notes}</Text>
        </>
      )}

      <Button
        title={isFound ? "Claim / Contact Finder" : "This is mine / Contact reporter"}
        onPress={() => Alert.alert("Coming soon", "This feature isn't available yet.")}
      />
    </ScrollView>
  );
};

export default ItemDetailsScreen;
