import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  interpolate,
  runOnJS,
} from 'react-native-reanimated';
import { DiscoverableChef } from '../../models/types';
import { SwipeDirection } from '../../config/constants';
import SwipeCard, { CARD_WIDTH, CARD_HEIGHT } from './SwipeCard';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const SWIPE_THRESHOLD = 120;

interface SwipeCardStackProps {
  chefs: DiscoverableChef[];
  onSwipe: (chefId: string, direction: SwipeDirection) => void;
  onCardPress: (chef: DiscoverableChef) => void;
  getConflicts: (chef: DiscoverableChef) => string[];
}

export default function SwipeCardStack({
  chefs,
  onSwipe,
  onCardPress,
  getConflicts,
}: SwipeCardStackProps) {
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);

  const visibleChefs = chefs.slice(0, 3);

  const handleSwipeComplete = (direction: SwipeDirection) => {
    if (visibleChefs.length > 0) {
      onSwipe(visibleChefs[0].id, direction);
    }
  };

  const panGesture = Gesture.Pan()
    .onUpdate((event) => {
      translateX.value = event.translationX;
      translateY.value = event.translationY;
    })
    .onEnd((event) => {
      if (event.translationX > SWIPE_THRESHOLD) {
        translateX.value = withTiming(SCREEN_WIDTH + 100, { duration: 300 }, () => {
          runOnJS(handleSwipeComplete)(SwipeDirection.LIKE);
          translateX.value = 0;
          translateY.value = 0;
        });
      } else if (event.translationX < -SWIPE_THRESHOLD) {
        translateX.value = withTiming(-SCREEN_WIDTH - 100, { duration: 300 }, () => {
          runOnJS(handleSwipeComplete)(SwipeDirection.PASS);
          translateX.value = 0;
          translateY.value = 0;
        });
      } else {
        translateX.value = withSpring(0, { damping: 20, stiffness: 200 });
        translateY.value = withSpring(0, { damping: 20, stiffness: 200 });
      }
    });

  const topCardStyle = useAnimatedStyle(() => {
    const rotation = interpolate(translateX.value, [-200, 0, 200], [-15, 0, 15]);
    return {
      transform: [
        { translateX: translateX.value },
        { translateY: translateY.value },
        { rotate: `${rotation}deg` },
      ],
    };
  });

  const likeOverlayStyle = useAnimatedStyle(() => ({
    opacity: interpolate(translateX.value, [0, SWIPE_THRESHOLD], [0, 0.6], 'clamp'),
  }));

  const passOverlayStyle = useAnimatedStyle(() => ({
    opacity: interpolate(translateX.value, [-SWIPE_THRESHOLD, 0], [0.6, 0], 'clamp'),
  }));

  return (
    <View style={styles.container}>
      {visibleChefs.map((chef, index) => {
        const isTop = index === 0;

        if (isTop) {
          return (
            <GestureDetector key={chef.id} gesture={panGesture}>
              <Animated.View style={[styles.cardWrapper, topCardStyle]}>
                <SwipeCard
                  chef={chef}
                  conflicts={getConflicts(chef)}
                  onPress={() => onCardPress(chef)}
                />
                <Animated.View style={[styles.overlay, styles.likeOverlay, likeOverlayStyle]} />
                <Animated.View style={[styles.overlay, styles.passOverlay, passOverlayStyle]} />
              </Animated.View>
            </GestureDetector>
          );
        }

        const scale = 1 - index * 0.05;
        const translateYOffset = index * 10;

        return (
          <View
            key={chef.id}
            style={[
              styles.cardWrapper,
              styles.backgroundCard,
              { transform: [{ scale }, { translateY: translateYOffset }] },
              { zIndex: -index },
            ]}
          >
            <SwipeCard
              chef={chef}
              conflicts={getConflicts(chef)}
              onPress={() => {}}
            />
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardWrapper: {
    position: 'absolute',
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
  },
  backgroundCard: {
    pointerEvents: 'none',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 16,
  },
  likeOverlay: {
    backgroundColor: '#22c55e',
  },
  passOverlay: {
    backgroundColor: '#ef4444',
  },
});
