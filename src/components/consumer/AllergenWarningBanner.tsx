import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface AllergenWarningBannerProps {
  conflicts: string[];
}

export default function AllergenWarningBanner({ conflicts }: AllergenWarningBannerProps) {
  if (conflicts.length === 0) return null;

  return (
    <View style={styles.banner}>
      <Text style={styles.icon}>!</Text>
      <Text style={styles.text}>
        Allergen alert: This chef cannot accommodate{' '}
        <Text style={styles.bold}>{conflicts.join(', ')}</Text>
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  banner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fef2f2',
    borderWidth: 1,
    borderColor: '#fca5a5',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 12,
  },
  icon: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#dc2626',
    backgroundColor: '#fee2e2',
    width: 24,
    height: 24,
    borderRadius: 12,
    textAlign: 'center',
    lineHeight: 24,
    marginRight: 10,
    overflow: 'hidden',
  },
  text: {
    flex: 1,
    fontSize: 13,
    color: '#991b1b',
    lineHeight: 18,
  },
  bold: {
    fontWeight: '700',
  },
});
