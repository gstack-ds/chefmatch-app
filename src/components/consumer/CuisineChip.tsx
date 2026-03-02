import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

interface CuisineChipProps {
  label: string;
  selected: boolean;
  onToggle: (label: string) => void;
}

export default function CuisineChip({ label, selected, onToggle }: CuisineChipProps) {
  return (
    <TouchableOpacity
      style={[styles.chip, selected && styles.chipSelected]}
      onPress={() => onToggle(label)}
      activeOpacity={0.7}
    >
      <Text style={[styles.label, selected && styles.labelSelected]}>
        {label}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#d1d5db',
    backgroundColor: '#fff',
    marginRight: 8,
    marginBottom: 8,
  },
  chipSelected: {
    backgroundColor: '#f97316',
    borderColor: '#f97316',
  },
  label: {
    fontSize: 14,
    color: '#374151',
  },
  labelSelected: {
    color: '#fff',
    fontWeight: '600',
  },
});
