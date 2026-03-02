import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { RouteProp, useRoute } from '@react-navigation/native';
import { Review } from '../../models/types';
import { getReviewsForUser } from '../../services/review-service';

type ReviewListParams = {
  ReviewList: { userId: string; userName: string };
};

type ReviewListRouteProp = RouteProp<ReviewListParams, 'ReviewList'>;

export default function ReviewListScreen() {
  const route = useRoute<ReviewListRouteProp>();
  const { userId } = route.params;
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getReviewsForUser(userId)
      .then(setReviews)
      .catch(() => {})
      .finally(() => setIsLoading(false));
  }, [userId]);

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#f97316" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={reviews}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No reviews yet</Text>
        }
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.stars}>
                {Array.from({ length: 5 }, (_, i) =>
                  i < item.rating ? '\u2605' : '\u2606',
                ).join('')}
              </Text>
              <Text style={styles.date}>
                {item.createdAt.split('T')[0]}
              </Text>
            </View>
            {item.text.length > 0 && (
              <Text style={styles.reviewText}>{item.text}</Text>
            )}
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  list: {
    padding: 16,
  },
  emptyText: {
    textAlign: 'center',
    color: '#9ca3af',
    fontSize: 16,
    marginTop: 40,
  },
  card: {
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  stars: {
    fontSize: 18,
    color: '#f97316',
  },
  date: {
    fontSize: 13,
    color: '#9ca3af',
  },
  reviewText: {
    fontSize: 15,
    color: '#4b5563',
    lineHeight: 22,
  },
});
