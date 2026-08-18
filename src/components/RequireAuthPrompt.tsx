import { View, Text, Pressable, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import { BlurView } from "expo-blur";

interface Props {
  message: string;
}

const RequireAuthPrompt = ({ message }: Props) => {
  const navigation = useNavigation();

  return (
    <View style={styles.page}>
      <BlurView intensity={30} tint="light" style={styles.card}>
        <Text style={styles.title}>Sign in required</Text>
        <Text style={styles.subtitle}>{message}</Text>

        <Pressable onPress={() => navigation.navigate("Account" as never)}>
          <LinearGradient colors={["#618071ff", "#6e6e6eff"]} style={styles.button}>
            <Text style={styles.buttonText}>Go to Account</Text>
          </LinearGradient>
        </Pressable>
      </BlurView>
    </View>
  );
};

export default RequireAuthPrompt;

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: "#f0f2f6", alignItems: "center", justifyContent: "center", padding: 20 },
  card: { width: "100%", borderRadius: 24, padding: 24, backgroundColor: "rgba(255,255,255,0.9)" },
  title: { fontSize: 22, fontWeight: "800", textAlign: "center", marginBottom: 6 },
  subtitle: { textAlign: "center", color: "#666", marginBottom: 20 },
  button: { paddingVertical: 16, borderRadius: 14, alignItems: "center" },
  buttonText: { color: "white", fontSize: 16, fontWeight: "700", letterSpacing: 0.5 },
});
