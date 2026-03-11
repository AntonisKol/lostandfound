import { Text, Image, ScrollView, Button } from "react-native";
import { useRoute } from "@react-navigation/native";
import { styles } from "./styled";
import React from "react";

type RootStackParamList = {
  FoundItemDetails: {
    id: string;
    image_url: string;
    category: string;
    location: string;
    notes?: string;
    created_at: string;
  };
};

const FoundItemDetailsScreen = () => {
  const route = useRoute();
  const { image_url, category, location, notes } =
    route.params as RootStackParamList["FoundItemDetails"];

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {image_url && <Image source={{ uri: image_url }} style={styles.image} />}

      <Text style={styles.label}>Category:</Text>
      <Text style={styles.text}>{category}</Text>

      <Text style={styles.label}>Location found:</Text>
      <Text style={styles.text}>{location}</Text>

      {notes && (
        <>
          <Text style={styles.label}>Notes:</Text>
          <Text style={styles.text}>{notes}</Text>
        </>
      )}

      <Button
        title="Claim / Contact Finder"
        onPress={() => alert("Feature coming soon!")}
      />
    </ScrollView>
  );
};

export default FoundItemDetailsScreen;
