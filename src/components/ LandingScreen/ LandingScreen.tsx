import { View, Text, StyleSheet } from "react-native";

export default function LandingScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Fundstück</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 60,
  },
});
