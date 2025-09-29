// screens/ImageComparisonScreen.tsx
import React from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity, Share } from "react-native";
import { Download, RefreshCw } from "lucide-react-native";

interface Props {
  original: string;
  colorized: string;
  onNewPhoto: () => void;
}

export default function ImageComparisonScreen({ original, colorized, onNewPhoto }: Props) {
  const handleShare = async () => {
    try {
      await Share.share({
        message: "Check out my revived memory! https://yaadonkerang.indrasol.com",
        url: colorized,
      });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Memory Successfully Revived!</Text>
      <Image source={{ uri: original }} style={styles.image} resizeMode="contain" />
      <Image source={{ uri: colorized }} style={styles.image} resizeMode="contain" />
      
      <View style={styles.actions}>
        <TouchableOpacity style={styles.button} onPress={handleShare}>
          <Text style={styles.buttonText}>Share</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={onNewPhoto}>
          <Text style={styles.buttonText}>Revive Another</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: "center", padding: 20 },
  title: { fontSize: 18, fontWeight: "600", marginBottom: 20 },
  image: { width: "100%", height: 250, marginBottom: 20, borderRadius: 12 },
  actions: { flexDirection: "row", gap: 10 },
  button: { padding: 12, backgroundColor: "#EF4444", borderRadius: 8 },
  buttonText: { color: "#fff", fontWeight: "600" },
});
