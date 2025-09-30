import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Heart } from 'lucide-react-native';

interface FooterProps {
  topText?: string;
}

export default function Footer({ topText }: FooterProps) {
  return (
    <View style={styles.wrapper}>
      {topText ? <Text style={styles.top}>{topText}</Text> : null}
      {topText ? <View style={styles.divider} /> : null}
      <View style={styles.bottomRow}>
        <Text style={styles.bottom}>Made with </Text>
        <Heart size={14} color="#EF4444" style={styles.heart} />
        <Text style={styles.bottom}> to preserve and revive your precious memories</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 20,
    width: '100%',
  },
  top: {
    fontSize: 14,
    color: '#b91c1c',
    textAlign: 'center',
    marginTop: 20,
    marginBottom: 6,
  },
  divider: {
    width: '100%',
    height: 1,
    backgroundColor: 'white',
    marginVertical: 10,
    alignSelf: 'center',
    marginTop: 10,
  },
  bottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    flexWrap: 'wrap',
  },
  bottom: {
    fontSize: 12,
    color: 'black',
    textAlign: 'center',
  },
  heart: {
    marginBottom: 2,
  },
});
