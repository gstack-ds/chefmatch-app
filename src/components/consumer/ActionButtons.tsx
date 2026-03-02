import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';

interface ActionButtonsProps {
  onPass: () => void;
  onLike: () => void;
  disabled?: boolean;
}

export default function ActionButtons({ onPass, onLike, disabled = false }: ActionButtonsProps) {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[styles.button, styles.passButton, disabled && styles.disabled]}
        onPress={onPass}
        disabled={disabled}
        activeOpacity={0.7}
      >
        <Text style={styles.passIcon}>X</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.button, styles.likeButton, disabled && styles.disabled]}
        onPress={onLike}
        disabled={disabled}
        activeOpacity={0.7}
      >
        <Text style={styles.likeIcon}>♥</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 32,
    paddingVertical: 16,
  },
  button: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
  },
  passButton: {
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#ef4444',
  },
  likeButton: {
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#22c55e',
  },
  disabled: {
    opacity: 0.4,
  },
  passIcon: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#ef4444',
  },
  likeIcon: {
    fontSize: 28,
    color: '#22c55e',
  },
});
