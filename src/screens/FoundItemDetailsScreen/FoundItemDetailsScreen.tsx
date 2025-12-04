 import { Text, StyleSheet, Image, ScrollView, Button } from "react-native";
import { useRoute, RouteProp } from "@react-navigation/native";

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
  const route = useRoute<RouteProp<RootStackParamList, "FoundItemDetails">>();
  const { image_url, category, location, notes } = route.params;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {image_url && <Image source={{ uri: image_url }} style={styles.image} />}
      <Text style={styles.label}>Category:</Text>
      <Text style={styles.text}>{category}</Text>

      <Text style={styles.label}>Location:</Text>
      <Text style={styles.text}>{location}</Text>

      {notes ? (
        <>
          <Text style={styles.label}>Notes:</Text>
          <Text style={styles.text}>{notes}</Text>
        </>
      ) : null}

      <Button title="Claim / Contact Finder" onPress={() => alert("Feature coming soon!")} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { padding: 20, alignItems: "center", backgroundColor: "#fff" },
  image: { width: 300, height: 300, borderRadius: 12, marginBottom: 20 },
  label: { fontWeight: "700", fontSize: 16, marginTop: 10 },
  text: { fontSize: 16, marginBottom: 5 },
});

export default FoundItemDetailsScreen;
