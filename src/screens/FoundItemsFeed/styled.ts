import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  categories: {
    marginBottom: 16,
  },
  categoryButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: "#eee",
    borderRadius: 20,
    marginRight: 10,
  },
  categoryButtonActive: {
    backgroundColor: "#000",
  },
  categoryText: {
    color: "#000",
    fontWeight: "600",
  },
  categoryTextActive: {
    color: "#fff",
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    backgroundColor: "#f8f8f8",
    borderRadius: 18,
    padding: 14,
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 12,
  },
  badge: {
    alignSelf: "flex-start",
    paddingHorizontal: 10,
    paddingVertical: 2,
    borderRadius: 12,
    marginBottom: 4,
  },
  badgeFound: {
    backgroundColor: "#618071ff",
  },
  badgeLost: {
    backgroundColor: "#FF4C4C",
  },
  badgeText: {
    color: "white",
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
  category: {
    fontWeight: "700",
    fontSize: 16,
    marginBottom: 2,
  },
  location: {
    color: "#555",
  },
  notes: {
    marginTop: 4,
    fontStyle: "italic",
    color: "#333",
  },
});
