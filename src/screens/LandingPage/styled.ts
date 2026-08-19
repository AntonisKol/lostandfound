import { StyleSheet } from "react-native";
import { colors } from "../../constants/theme";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.ink,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  title: {
    fontSize: 48,
    fontWeight: "800",
    color: colors.paper,
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 18,
    color: "rgba(246,241,231,0.75)",
    textAlign: "center",
    marginBottom: 40,
  },
  button: {
    backgroundColor: colors.twine,
    paddingVertical: 16,
    paddingHorizontal: 40,
    borderRadius: 14,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: "700",
    color: colors.ink,
  },
});