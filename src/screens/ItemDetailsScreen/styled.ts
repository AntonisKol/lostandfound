import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: { padding: 20, paddingTop: 60, alignItems: "center", backgroundColor: "#fff" },
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    alignSelf: "stretch",
    marginBottom: 16,
  },
  backText: { fontSize: 16, color: "#618071ff", fontWeight: "600" },
  topBarTitle: { fontSize: 16, fontWeight: "700" },
  topBarSpacer: { width: 50 },
  image: { width: 300, height: 300, borderRadius: 12, marginBottom: 20 },
  badge: { paddingHorizontal: 14, paddingVertical: 4, borderRadius: 20, marginBottom: 10 },
  badgeFound: { backgroundColor: "#618071ff" },
  badgeLost: { backgroundColor: "#FF4C4C" },
  badgeText: { color: "white", fontWeight: "700", letterSpacing: 0.5 },
  label: { fontWeight: "700", fontSize: 16, marginTop: 10 },
  text: { fontSize: 16, marginBottom: 5 },
});
