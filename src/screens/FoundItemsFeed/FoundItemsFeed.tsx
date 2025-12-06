import React, { useEffect, useState, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  ActivityIndicator,
  ScrollView,
  TouchableOpacity,
  Pressable,
} from "react-native";
import { supabase } from "../../supabase/supabase";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

interface FoundItem {
  id: string;
  image_url: string | null;
  category: string | null;
  location: string;
  notes?: string;
  created_at: string;
}

type RootStackParamList = {
  FoundItemDetails: {
    id: string;
    image_url: string | null;
    category: string;
    location: string;
    notes?: string;
    created_at: string;
  };
};

const CATEGORIES = [
  "All",
  "Phone",
  "Wallet",
  "Keys",
  "Bag / Backpack",
  "Clothing",
  "Jewelry",
  "Electronics",
  "Documents",
  "Glasses",
  "Other",
];

const FoundItemsFeed = () => {
  const [items, setItems] = useState<FoundItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("All");

  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const fetchItems = async () => {
    setLoading(true);

    const { data, error } = await supabase
      .from("found_items")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.log(error);
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

  const filteredItems = useMemo(() => {
    if (selectedCategory === "All") return items;
    return items.filter((item) => (item.category?.trim() || "Other") === selectedCategory);
  }, [items, selectedCategory]);

  const renderItem = ({ item }: { item: FoundItem }) => {
    const realCategory = item.category?.trim() || "Other";

    return (
      <Pressable
        style={styles.item}
        onPress={() => navigation.navigate("FoundItemDetails", {
          id: item.id,
          image_url: item.image_url,
          category: realCategory,
          location: item.location,
          notes: item.notes,
          created_at: item.created_at,
        })}
      >
        {item.image_url && <Image source={{ uri: item.image_url }} style={styles.image} />}
        <View style={{ flex: 1, marginLeft: 12 }}>
          <Text style={styles.category}>{realCategory}</Text>
          <Text style={styles.location}>{item.location}</Text>
          {item.notes ? <Text style={styles.notes}>{item.notes}</Text> : null}
        </View>
      </Pressable>
    );
  };

  if (loading)
    return <ActivityIndicator size="large" color="#000" style={{ marginTop: 40 }} />;

  return (
    <FlatList
      data={filteredItems}
      keyExtractor={(item) => item.id}
      renderItem={renderItem}
      contentContainerStyle={{ padding: 16, paddingTop: 60, paddingBottom: 120 }}
      ListEmptyComponent={<Text>No items found yet.</Text>}
      ListHeaderComponent={
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.categories}
        >
          {CATEGORIES.map((cat) => (
            <TouchableOpacity
              key={cat}
              onPress={() => setSelectedCategory(cat)}
              style={[
                styles.categoryButton,
                selectedCategory === cat && styles.categoryButtonActive,
              ]}
            >
              <Text
                style={[
                  styles.categoryText,
                  selectedCategory === cat && styles.categoryTextActive,
                ]}
              >
                {cat}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      }
    />
  );
};

const styles = StyleSheet.create({
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

export default FoundItemsFeed;
