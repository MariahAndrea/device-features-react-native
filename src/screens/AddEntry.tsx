import AsyncStorage from "@react-native-async-storage/async-storage";
import * as ImagePicker from "expo-image-picker";
import * as Location from "expo-location";
import * as Notifications from "expo-notifications";
import { Camera, MapPin, Save } from "lucide-react-native";
import React, { useEffect, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    Image,
    Keyboard,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    TouchableWithoutFeedback,
    View,
} from "react-native";
import { useTheme } from "../components/ThemeProvider";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export default function AddEntryScreen({ navigation, route }: any) {
  const { colors } = useTheme();
  const editItem = route.params?.editItem;

  const [title, setTitle] = useState(editItem?.title || "");
  const [image, setImage] = useState(editItem?.image || null);
  const [address, setAddress] = useState(editItem?.address || "");
  const [desc, setDesc] = useState(editItem?.desc || "");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    (async () => {
      await Notifications.requestPermissionsAsync();
    })();
  }, []);

  const pickImage = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted")
      return Alert.alert("Error", "Camera permission needed");
    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.7,
    });
    if (!result.canceled) {
      setImage(result.assets[0].uri);
      if (!address) getAutoLocation();
    }
  };

  const getAutoLocation = async () => {
    setLoading(true);
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === "granted") {
        const loc = await Location.getCurrentPositionAsync({});
        const [geo] = await Location.reverseGeocodeAsync({
          latitude: loc.coords.latitude,
          longitude: loc.coords.longitude,
        });
        setAddress(`${geo.name || ""} ${geo.street || ""}, ${geo.city}`);
      }
    } catch (e) {
      Alert.alert("GPS", "Manual entry required.");
    }
    setLoading(false);
  };

  const onSave = async () => {
    if (!title.trim() || !image || !address)
      return Alert.alert("Validation", "Required: Title, Photo, Location");
    const raw = await AsyncStorage.getItem("@travel_diary");
    let data = raw ? JSON.parse(raw) : [];
    const entry = {
      id: editItem?.id || Date.now().toString(),
      title,
      image,
      address,
      desc,
      timestamp: editItem?.timestamp || Date.now(),
      dateText:
        editItem?.dateText ||
        new Date().toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        }),
    };
    data = editItem
      ? data.map((e: any) => (e.id === editItem.id ? entry : e))
      : [entry, ...data];
    await AsyncStorage.setItem("@travel_diary", JSON.stringify(data));

    await Notifications.scheduleNotificationAsync({
      content: {
        title: "Memory Saved!",
        body: `"${title}" has been added.`,
      },
      trigger: null,
    });
    navigation.goBack();
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1, backgroundColor: colors.bg }}
      keyboardVerticalOffset={90}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView contentContainerStyle={{ padding: 20 }}>
          <TouchableOpacity
            onPress={pickImage}
            style={[
              styles.imgBox,
              { backgroundColor: colors.card, borderColor: colors.border },
            ]}
          >
            {image ? (
              <Image
                source={{ uri: image }}
                style={{ width: "100%", height: "100%" }}
                resizeMode="contain"
              />
            ) : (
              <View style={{ alignItems: "center" }}>
                <Camera color={colors.primary} size={48} />
                <Text style={{ color: colors.sub }}>Capture & Crop</Text>
              </View>
            )}
          </TouchableOpacity>
          <Text style={[styles.label, { color: colors.text }]}>Trip Title</Text>
          <TextInput
            style={[
              styles.input,
              {
                backgroundColor: colors.card,
                color: colors.text,
                borderColor: colors.border,
              },
            ]}
            value={title}
            onChangeText={setTitle}
            placeholder="Enter title"
            placeholderTextColor={colors.sub}
          />
          <Text style={[styles.label, { color: colors.text }]}>
            Description
          </Text>
          <TextInput
            style={[
              styles.input,
              {
                backgroundColor: colors.card,
                color: colors.text,
                borderColor: colors.border,
                minHeight: 80,
              },
            ]}
            value={desc}
            onChangeText={setDesc}
            placeholder="Enter description"
            placeholderTextColor={colors.sub}
            multiline
          />
          <Text style={[styles.label, { color: colors.text }]}>Location</Text>
          <View style={{ flexDirection: "row", gap: 10 }}>
            <TextInput
              style={[
                styles.input,
                {
                  backgroundColor: colors.card,
                  color: colors.text,
                  borderColor: colors.border,
                  flex: 1,
                },
              ]}
              value={address}
              onChangeText={setAddress}
              placeholder="Address"
              placeholderTextColor={colors.sub}
            />
            <TouchableOpacity
              onPress={getAutoLocation}
              style={[styles.locBtn, { backgroundColor: colors.primary }]}
            >
              {loading ? (
                <ActivityIndicator color="#FFF" />
              ) : (
                <MapPin color="#FFF" size={24} />
              )}
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            onPress={onSave}
            style={[styles.saveBtn, { backgroundColor: colors.primary }]}
          >
            <Save color="#FFF" size={20} />
            <Text style={{ color: "#FFF", fontWeight: "bold" }}>
              Save Memory
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  imgBox: {
    height: 260,
    borderRadius: 24,
    borderWidth: 1,
    borderStyle: "dashed",
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },
  label: { fontWeight: "700", marginTop: 18, marginBottom: 6 },
  input: { padding: 14, borderRadius: 12, fontSize: 16, borderWidth: 1 },
  locBtn: {
    borderRadius: 12,
    paddingHorizontal: 15,
    justifyContent: "center",
    alignItems: "center",
  },
  saveBtn: {
    height: 58,
    borderRadius: 18,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
    marginTop: 35,
    marginBottom: 60,
  },
});
