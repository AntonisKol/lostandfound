import { StyleSheet } from "react-native";
import { colors } from "../../constants/theme";

export const styles = StyleSheet.create({
  page: { flexGrow: 1, backgroundColor: colors.paper, alignItems: "center", justifyContent: "center", padding: 20 },
  card: { width: "100%", borderRadius: 24, padding: 24, backgroundColor: "rgba(255,255,255,0.9)" },
  title: { fontSize: 26, fontWeight: "800", textAlign: "center", marginBottom: 4, color: colors.ink },
  subtitle: { textAlign: "center", color: colors.inkSoft, marginBottom: 16 },
  formGroup: { marginBottom: 12 },
  label: { marginBottom: 6, fontWeight: "600", color: colors.ink },
  input: { backgroundColor: colors.surface, borderRadius: 12, borderWidth: 1, borderColor: colors.border, padding: 12, fontSize: 15 },
  errorInput: { borderColor: colors.lost },
  submitButton: { marginTop: 15, paddingVertical: 16, borderRadius: 14, alignItems: "center", backgroundColor: colors.stamp },
  submitText: { color: "white", fontSize: 16, fontWeight: "700", letterSpacing: 0.5 },
  switchModeText: { textAlign: "center", marginTop: 16, color: colors.stamp, fontWeight: "600" },
  profileLabel: { marginTop: 10, fontWeight: "700", fontSize: 14, color: colors.inkSoft },
  profileValue: { fontSize: 16, marginBottom: 4, color: colors.ink },
  signOutButton: { marginTop: 24, paddingVertical: 16, borderRadius: 14, alignItems: "center", backgroundColor: colors.lost },
  signOutText: { color: "white", fontSize: 16, fontWeight: "700" },
});
