import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { ChefTier } from '../../config/constants';

interface TierBadgeProps {
  tier: ChefTier;
  size?: 'small' | 'medium';
}

const TIER_CONFIG = {
  [ChefTier.CLASSICALLY_TRAINED]: {
    label: 'Classically Trained',
    backgroundColor: '#fef3c7',
    textColor: '#92400e',
    borderColor: '#f59e0b',
  },
  [ChefTier.HOME_CHEF]: {
    label: 'Home Chef',
    backgroundColor: '#d1fae5',
    textColor: '#065f46',
    borderColor: '#10b981',
  },
};

export default function TierBadge({ tier, size = 'small' }: TierBadgeProps) {
  const config = TIER_CONFIG[tier];

  return (
    <View
      style={[
        styles.badge,
        size === 'medium' && styles.badgeMedium,
        { backgroundColor: config.backgroundColor, borderColor: config.borderColor },
      ]}
    >
      <Text
        style={[
          styles.text,
          size === 'medium' && styles.textMedium,
          { color: config.textColor },
        ]}
      >
        {config.label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
    borderWidth: 1,
    alignSelf: 'flex-start',
  },
  badgeMedium: {
    paddingHorizontal: 12,
    paddingVertical: 5,
  },
  text: {
    fontSize: 11,
    fontWeight: '600',
  },
  textMedium: {
    fontSize: 13,
  },
});
