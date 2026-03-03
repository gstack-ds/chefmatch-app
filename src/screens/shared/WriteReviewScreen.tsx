import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { RouteProp, useRoute, useNavigation } from '@react-navigation/native';
import { createReview } from '../../services/review-service';

type WriteReviewParams = {
  WriteReview: {
    bookingId: string;
    reviewerId: string;
    revieweeId: string;
    revieweeName: string;
  };
};

type WriteReviewRouteProp = RouteProp<WriteReviewParams, 'WriteReview'>;

export default function WriteReviewScreen() {
  const route = useRoute<WriteReviewRouteProp>();
  const navigation = useNavigation();
  const { bookingId, reviewerId, revieweeId, revieweeName } = route.params;

  const [rating, setRating] = useState(0);
  const [text, setText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const canSubmit = rating >= 1 && rating <= 5;

  const handleSubmit = async () => {
    if (!canSubmit) return;

    setIsSubmitting(true);
    try {
      await createReview({
        bookingId,
        reviewerId,
        revieweeId,
        rating,
        text: text.trim(),
      });
      Alert.alert('Review Submitted', `Your review for ${revieweeName} has been saved.`, [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } catch (err) {
      Alert.alert('Error', err instanceof Error ? err.message : 'Failed to submit review');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Review {revieweeName}</Text>

      <Text style={styles.label}>Rating</Text>
      <View style={styles.starRow}>
        {[1, 2, 3, 4, 5].map((star) => (
          <TouchableOpacity
            key={star}
            onPress={() => setRating(star)}
            style={styles.starButton}
          >
            <Text style={[styles.star, star <= rating && styles.starFilled]}>
              {star <= rating ? '\u2605' : '\u2606'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      {rating === 0 && (
        <Text style={styles.ratingHint}>Tap a star to rate</Text>
      )}

      <Text style={styles.label}>Comments (optional)</Text>
      <TextInput
        style={styles.textInput}
        value={text}
        onChangeText={setText}
        placeholder="Share your experience..."
        placeholderTextColor="#9ca3af"
        multiline
        numberOfLines={4}
        maxLength={1000}
      />

      <TouchableOpacity
        style={[styles.submitButton, (!canSubmit || isSubmitting) && styles.disabled]}
        onPress={handleSubmit}
        disabled={!canSubmit || isSubmitting}
      >
        {isSubmitting ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.submitText}>Submit Review</Text>
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 24,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
    marginTop: 12,
  },
  starRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  starButton: {
    padding: 4,
  },
  star: {
    fontSize: 36,
    color: '#d1d5db',
  },
  starFilled: {
    color: '#f97316',
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
    color: '#1f2937',
    backgroundColor: '#f9fafb',
    minHeight: 100,
    textAlignVertical: 'top',
  },
  submitButton: {
    backgroundColor: '#f97316',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 28,
  },
  disabled: {
    opacity: 0.5,
  },
  submitText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '700',
  },
  ratingHint: {
    fontSize: 13,
    color: '#9ca3af',
    marginBottom: 8,
  },
});
