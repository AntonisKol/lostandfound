import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  page: { flexGrow: 1, backgroundColor: "#f0f2f6", alignItems: "center", justifyContent: "center", padding: 20 },
  card: { width: "100%", borderRadius: 24, padding: 24, backgroundColor: "rgba(255,255,255,0.9)" },
  title: { fontSize: 26, fontWeight: "800", textAlign: "center", marginBottom: 4 },
  subtitle: { textAlign: "center", color: "#666", marginBottom: 16 },
  formGroup: { marginBottom: 12 },
  label: { marginBottom: 6, fontWeight: "600" },
  input: { backgroundColor: "#fff", borderRadius: 12, borderWidth: 1, borderColor: "#ddd", padding: 12, fontSize: 15 },
  errorInput: { borderColor: "#ef4444" },
  submitButton: { marginTop: 15, paddingVertical: 16, borderRadius: 14, alignItems: "center" },
  submitText: { color: "white", fontSize: 16, fontWeight: "700", letterSpacing: 0.5 },
  switchModeText: { textAlign: "center", marginTop: 16, color: "#618071ff", fontWeight: "600" },
  profileLabel: { marginTop: 10, fontWeight: "700", fontSize: 14, color: "#666" },
  profileValue: { fontSize: 16, marginBottom: 4 },
  signOutButton: { marginTop: 24, paddingVertical: 16, borderRadius: 14, alignItems: "center", backgroundColor: "#FF4C4C" },
  signOutText: { color: "white", fontSize: 16, fontWeight: "700" },
});
