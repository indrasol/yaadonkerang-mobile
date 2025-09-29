import { Tabs } from 'expo-router';

export default function TabLayout() {
  return (
    <Tabs screenOptions={{ headerShown: false }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          href: null, // This hides the tab since we're using stack navigation
        }}
      />
    </Tabs>
  );
}