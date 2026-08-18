import { useMemo, useState } from "react";
import {
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
  FlatList,
} from "react-native";
import { BERLIN_ZIP_CODES } from "../constants/berlinZipCodes";

interface Props {
  value: string;
  onChange: (zip: string) => void;
  placeholder?: string;
  style?: any;
}

const ZipCodePicker = ({ value, onChange, placeholder = "Select ZIP code", style }: Props) => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return BERLIN_ZIP_CODES;
    return BERLIN_ZIP_CODES.filter(
      (z) => z.zip.includes(q) || z.area.toLowerCase().includes(q)
    );
  }, [search]);

  const selected = BERLIN_ZIP_CODES.find((z) => z.zip === value);

  return (
    <>
      <Pressable style={style} onPress={() => setOpen(true)}>
        <Text style={selected ? styles.valueText : styles.placeholderText}>
          {selected ? `${selected.zip} · ${selected.area}` : placeholder}
        </Text>
      </Pressable>

      <Modal visible={open} animationType="slide" onRequestClose={() => setOpen(false)}>
        <View style={styles.modal}>
          <Text style={styles.title}>Select ZIP code</Text>
          <TextInput
            style={styles.search}
            placeholder="Search by ZIP or area..."
            value={search}
            onChangeText={setSearch}
            autoFocus
          />
          <FlatList
            data={filtered}
            keyExtractor={(item) => item.zip}
            keyboardShouldPersistTaps="handled"
            renderItem={({ item }) => (
              <Pressable
                style={[styles.row, item.zip === value && styles.rowSelected]}
                onPress={() => {
                  onChange(item.zip);
                  setSearch("");
                  setOpen(false);
                }}
              >
                <Text style={styles.rowZip}>{item.zip}</Text>
                <Text style={styles.rowArea}>{item.area}</Text>
              </Pressable>
            )}
            ListEmptyComponent={<Text style={styles.empty}>No matching ZIP codes.</Text>}
          />
          <Pressable style={styles.closeButton} onPress={() => setOpen(false)}>
            <Text style={styles.closeButtonText}>Cancel</Text>
          </Pressable>
        </View>
      </Modal>
    </>
  );
};

export default ZipCodePicker;

const styles = StyleSheet.create({
  valueText: { fontSize: 15, color: "#111" },
  placeholderText: { fontSize: 15, color: "#888" },
  modal: { flex: 1, backgroundColor: "#fff", paddingTop: 60, paddingHorizontal: 20 },
  title: { fontSize: 20, fontWeight: "700", marginBottom: 16 },
  search: {
    backgroundColor: "#f0f0f0",
    borderRadius: 12,
    padding: 12,
    fontSize: 15,
    marginBottom: 12,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  rowSelected: { backgroundColor: "#f5f5f5" },
  rowZip: { fontSize: 15, fontWeight: "600" },
  rowArea: { fontSize: 15, color: "#666" },
  empty: { textAlign: "center", color: "#888", marginTop: 40 },
  closeButton: { paddingVertical: 16, alignItems: "center" },
  closeButtonText: { fontSize: 16, color: "#618071ff", fontWeight: "600" },
});
