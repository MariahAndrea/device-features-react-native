import AsyncStorage from "@react-native-async-storage/async-storage";
import {
    ArrowUpDown,
    Calendar,
    Edit3,
    MapPin,
    Plus,
    Search,
    Trash2,
} from "lucide-react-native";
import React, { useEffect, useMemo, useState } from "react";
import {
    Alert,
    FlatList,
    Image,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { useTheme } from "../components/ThemeProvider";
import { TravelEntry } from "../types";

export default function HomeScreen({ navigation }: any) {
  const { colors } = useTheme();
  const [entries, setEntries] = useState<TravelEntry[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isAscending, setIsAscending] = useState(false);

  const loadData = async () => {
    const data = await AsyncStorage.getItem("@travel_diary");
    setEntries(data ? JSON.parse(data) : []);
  };

  useEffect(() => {
    const unsub = navigation.addListener("focus", loadData);
    return unsub;
  }, [navigation]);

  const confirmDelete = (id: string) => {
    Alert.alert("Delete Memory", "Are you sure?", [
      { text: "Cancel", style: "cancel" },
      { text: "Delete", style: "destructive", onPress: () => removeEntry(id) },
    ]);
  };

  const removeEntry = async (id: string) => {
    const updated = entries.filter((e) => e.id !== id);
    await AsyncStorage.setItem("@travel_diary", JSON.stringify(updated));
    setEntries(updated);
  };

  const filteredEntries = useMemo(() => {
    let result = entries.filter((item) => {
      const content =
        `${item.title} ${item.address} ${item.dateText}`.toLowerCase();
      return content.includes(searchQuery.toLowerCase());
    });
    return result.sort((a, b) =>
      isAscending ? a.timestamp - b.timestamp : b.timestamp - a.timestamp,
    );
  }, [entries, searchQuery, isAscending]);

  return (
    <View
      style={{ flex: 1, backgroundColor: colors.bg, paddingHorizontal: 15 }}
    >
      <View style={styles.headerRow}>
        <View
          style={[
            styles.searchBar,
            { backgroundColor: colors.card, borderColor: colors.border },
          ]}
        >
          <Search size={18} color={colors.sub} />
          <TextInput
            placeholder="Search trips..."
            placeholderTextColor={colors.sub}
            style={{ color: colors.text, flex: 1, marginLeft: 10 }}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
        <TouchableOpacity
          style={[styles.sortBtn, { backgroundColor: colors.primary }]}
          onPress={() => setIsAscending(!isAscending)}
        >
          <ArrowUpDown size={20} color="#FFF" />
        </TouchableOpacity>
      </View>

      <FlatList
        data={filteredEntries}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listPadding} // FIX: Adds scrollable space at bottom
        renderItem={({ item }) => (
          <View style={[styles.card, { backgroundColor: colors.card }]}>
            <Image
              source={{ uri: item.image }}
              style={styles.image}
              resizeMode="cover"
            />
            <View style={{ padding: 15 }}>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <Text
                  style={{
                    color: colors.text,
                    fontSize: 18,
                    fontWeight: "800",
                    flex: 1,
                  }}
                >
                  {item.title}
                </Text>
                <View style={styles.dateBadge}>
                  <Calendar size={12} color={colors.sub} />
                  <Text
                    style={{ color: colors.sub, fontSize: 12, marginLeft: 4 }}
                  >
                    {item.dateText}
                  </Text>
                </View>
              </View>
              {item.desc ? (
                <Text style={{ color: colors.sub, marginTop: 4 }}>
                  {item.desc}
                </Text>
              ) : null}
              <View style={styles.locRow}>
                <MapPin size={14} color={colors.primary} />
                <Text
                  style={{ color: colors.sub, marginLeft: 4, fontSize: 13 }}
                >
                  {item.address}
                </Text>
              </View>
              <View style={styles.actionRow}>
                <TouchableOpacity
                  onPress={() =>
                    navigation.navigate("AddEntry", { editItem: item })
                  }
                >
                  <Edit3 color={colors.primary} size={22} />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => confirmDelete(item.id)}>
                  <Trash2 color={colors.danger} size={22} />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}
        ListEmptyComponent={
          <Text
            style={{ textAlign: "center", color: colors.sub, marginTop: 100 }}
          >
            No entries yet. Click on '+' to add.
          </Text>
        }
      />
      <TouchableOpacity
        style={[styles.fab, { backgroundColor: colors.primary }]}
        onPress={() => navigation.navigate("AddEntry", { editItem: undefined })}
      >
        <Plus color="#FFF" size={32} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  headerRow: { flexDirection: "row", gap: 10, marginVertical: 15 },
  searchBar: {
    flex: 1,
    height: 50,
    borderRadius: 15,
    borderWidth: 1,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 15,
  },
  sortBtn: {
    width: 50,
    height: 50,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    borderRadius: 20,
    marginBottom: 20,
    overflow: "hidden",
    elevation: 4,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  image: { width: "100%", height: 200 },
  dateBadge: { flexDirection: "row", alignItems: "center" },
  locRow: { flexDirection: "row", alignItems: "center", marginTop: 10 },
  actionRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 20,
    marginTop: 12,
  },
  fab: {
    position: "absolute",
    bottom: 30,
    right: 20,
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: "center",
    alignItems: "center",
    elevation: 8,
  },
  listPadding: {
    paddingBottom: 80,
  },
});
