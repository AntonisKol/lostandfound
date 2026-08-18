import React, { useEffect, useState } from "react";
import { View, ActivityIndicator, StyleSheet, Alert, Text } from "react-native";
import MapView, { Marker, Callout } from "react-native-maps";
import { supabase } from "../../supabase/supabase";
import { useNavigation } from "@react-navigation/native";
import { styles } from "./styled";

type ItemType = "found" | "lost";

interface Item {
  id: string;
  image_url?: string;
  category: string | null;
  location: string;
  notes?: string;
  created_at: string;
  type: ItemType;
  latitude: number;
  longitude: number;
}

const formatItems = (data: any[] | null, type: ItemType): Item[] =>
  (data || []).map((item) => ({
    ...item,
    type,
    latitude: item.latitude ? parseFloat(item.latitude) : 52.5200, // fallback Berlin
    longitude: item.longitude ? parseFloat(item.longitude) : 13.4050,
  }));

const MapScreen = () => {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  const fetchItems = async () => {
    setLoading(true);

    const [foundRes, lostRes] = await Promise.all([
      supabase.from("found_items").select("*"),
      supabase.from("lost_items").select("*"),
    ]);

    if (foundRes.error) {
      console.log("Error fetching found items:", foundRes.error);
      Alert.alert("Error fetching items", foundRes.error.message);
    }
    if (lostRes.error) {
      console.log("Error fetching lost items:", lostRes.error);
      Alert.alert("Error fetching items", lostRes.error.message);
    }

    setItems([
      ...formatItems(foundRes.data, "found"),
      ...formatItems(lostRes.data, "lost"),
    ]);
    setLoading(false);
  };

  useEffect(() => {
    fetchItems();

    const channel = supabase
      .channel("map_items_changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "found_items" },
        () => fetchItems()
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "lost_items" },
        () => fetchItems()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  if (loading) return <ActivityIndicator size="large" style={{ marginTop: 40 }} />;

  return (
    <MapView
      style={styles.map}
      initialRegion={{
        latitude: items[0]?.latitude || 52.5200,
        longitude: items[0]?.longitude || 13.4050,
        latitudeDelta: 0.1,
        longitudeDelta: 0.1,
      }}
    >
      {items.map((item) => (
        <Marker
          key={`${item.type}-${item.id}`}
          coordinate={{ latitude: item.latitude, longitude: item.longitude }}
          pinColor={item.type === "found" ? "gold" : "red"}
          onPress={() => navigation.navigate("ItemDetails", { ...item })}
        >
          <Callout>
            <View style={{ maxWidth: 200 }}>
              <Text style={{ fontWeight: "700" }}>
                {item.type === "found" ? "Found" : "Lost"} · {item.category || "Other"}
              </Text>
              <Text>{item.location}</Text>
              {item.notes ? <Text>{item.notes}</Text> : null}
            </View>
          </Callout>
        </Marker>
      ))}
    </MapView>
  );
};

 

export default MapScreen;
