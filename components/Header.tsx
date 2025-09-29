import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { LogOut } from 'lucide-react-native';
import { signOut } from '@/services/supabaseClient';

interface HeaderProps {
  showLogout?: boolean;
}

export default function Header({ showLogout = true }: HeaderProps) {
  const router = useRouter();

  const handleLogout = async () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Logout",
        onPress: async () => {
          const { error } = await signOut();
          if (error) {
            Alert.alert("Error", "Failed to logout");
          } else {
            router.replace("/landing");
          }
        },
      },
    ]);
  };

  return (
    <View style={styles.header}>
      <View style={styles.logoRow}>
        <Image
          source={require("../assets/images/favicon1.png")}
          style={styles.logoImage}
        />
        <Text style={styles.logoText}>
          YaadonKe<Text style={styles.logoAccent}>Rang</Text>
        </Text>
        <Text style={styles.subLogo}>by Indrasol</Text>
      </View>
      {showLogout && (
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <LogOut size={18} color="black" style={{ marginRight: 6 }} />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 40,
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  logoRow: { flexDirection: "row", alignItems: "center" },
  logoImage: { width: 30, height: 30, marginRight: 8 },
  logoText: { fontSize: 20, fontWeight: "bold", color: "#000" },
  logoAccent: { color: "#DC2626" },
  subLogo: { fontSize: 14, color: "#555", marginLeft: 6 },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 10,
  },
  logoutText: { color: "black", fontWeight: "600", fontSize: 14 },
});
