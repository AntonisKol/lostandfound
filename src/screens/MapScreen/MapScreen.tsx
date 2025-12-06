import React, { useEffect, useState } from "react";
import { View, ActivityIndicator, StyleSheet, Alert, Text } from "react-native";
import MapView, { Marker, Callout } from "react-native-maps";
import { supabase } from "../../supabase/supabase";
import { useNavigation } from "@react-navigation/native";
import { styles } from "./styled";

interface Item {
  id: string;
  image_url?: string;
  category: string | null;
  location: string;
  notes?: string;
  created_at: string;
  type: "found";
  latitude: number;
  longitude: number;
}

const MapScreen = () => {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  const fetchItems = async () => {
    setLoading(true);

    const { data, error } = await supabase
      .from("found_items")
      .select("*");

    if (error) {
      console.log("Error fetching found items:", error);
      Alert.alert("Error fetching items", error.message);
      setLoading(false);
      return;
    }

    const formattedItems: Item[] = (data || []).map((item: any) => ({
      ...item,
      type: "found",
      latitude: item.latitude ? parseFloat(item.latitude) : 52.5200, // fallback Berlin
      longitude: item.longitude ? parseFloat(item.longitude) : 13.4050,
    }));

    setItems(formattedItems);
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
          key={item.id}
          coordinate={{ latitude: item.latitude, longitude: item.longitude }}
          pinColor="yellow"
          onPress={() => navigation.navigate("FoundItemDetails", { ...item })}
        >
          <Callout>
            <View style={{ maxWidth: 200 }}>
              <Text style={{ fontWeight: "700" }}>{item.category || "Other"}</Text>
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
