import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, FlatList, Image, ActivityIndicator } from "react-native";
import { supabase } from "../../supabase/supabase";

interface FoundItem {
  id: string;
  image_url: string;
  category: string;
  location: string;
  notes?: string;
  created_at: string;
}

const FoundItemsFeed = () => {
  const [items, setItems] = useState<FoundItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchItems = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("found_items")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.log(error);
      alert("Error fetching items");
    } else {
      setItems(data as FoundItem[]);
    }
    setLoading(false);
  };

  useEffect(() => {
  fetchItems();

  const channel = supabase
    .channel("found_items_changes")
    .on(
      "postgres_changes",
      { event: "*", schema: "public", table: "found_items" },
      () => fetchItems()
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}, []);


  const renderItem = ({ item }: { item: FoundItem }) => (
    <View style={styles.item}>
      {item.image_url && <Image source={{ uri: item.image_url }} style={styles.image} />}
      <View style={{ flex: 1, marginLeft: 10 }}>
        <Text style={styles.category}>{item.category}</Text>
        <Text style={styles.location}>{item.location}</Text>
        {item.notes ? <Text style={styles.notes}>{item.notes}</Text> : null}
      </View>
    </View>
  );

  if (loading) return <ActivityIndicator size="large" color="#0000ff" style={{ marginTop: 20 }} />;

  return (
    <FlatList
      data={items}
      keyExtractor={(item) => item.id}
      renderItem={renderItem}
      contentContainerStyle={{ padding: 20 }}
      ListEmptyComponent={<Text>No items found yet.</Text>}
    />
  );
}

const styles = StyleSheet.create({
  item: {
    flexDirection: "row",
    marginBottom: 16,
    backgroundColor: "#f8f8f8",
    borderRadius: 12,
    padding: 10,
    alignItems: "center",
  },
  image: { width: 80, height: 80, borderRadius: 8 },
  category: { fontWeight: "700", fontSize: 16 },
  location: { color: "#555" },
  notes: { fontStyle: "italic", color: "#333" },
});


export default FoundItemsFeed;