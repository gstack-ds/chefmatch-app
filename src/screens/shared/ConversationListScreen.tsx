import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useAuth } from '../../hooks/use-auth';
import {
  getConversationsForUser,
  ConversationWithDetails,
} from '../../services/message-service';

type MessagingStackParamList = {
  ConversationList: undefined;
  Chat: { conversationId: string; otherUserName: string };
};

export default function ConversationListScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<MessagingStackParamList>>();
  const { user } = useAuth();
  const [conversations, setConversations] = useState<ConversationWithDetails[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchConversations = useCallback(async () => {
    if (!user) return;
    try {
      const data = await getConversationsForUser(user.id);
      setConversations(data);
    } catch {
      // User sees empty list
    }
  }, [user]);

  useEffect(() => {
    fetchConversations().finally(() => setIsLoading(false));
  }, [fetchConversations]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchConversations();
    setIsRefreshing(false);
  };

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#f97316" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Messages</Text>
      <FlatList
        data={conversations}
        keyExtractor={(item) => item.id}
        refreshControl={
          <RefreshControl refreshing={isRefreshing} onRefresh={handleRefresh} />
        }
        ListEmptyComponent={
          <Text style={styles.emptyText}>
            No conversations yet. Like a chef to start chatting!
          </Text>
        }
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.row}
            onPress={() =>
              navigation.navigate('Chat', {
                conversationId: item.id,
                otherUserName: item.otherUserName,
              })
            }
          >
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>
                {item.otherUserName.charAt(0).toUpperCase()}
              </Text>
            </View>
            <View style={styles.rowContent}>
              <Text style={styles.name}>{item.otherUserName}</Text>
              <Text style={styles.preview} numberOfLines={1}>
                {item.lastMessage ?? 'No messages yet'}
              </Text>
            </View>
          </TouchableOpacity>
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
  heading: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1f2937',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 16,
  },
  emptyText: {
    textAlign: 'center',
    color: '#9ca3af',
    fontSize: 16,
    marginTop: 40,
    paddingHorizontal: 32,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#f97316',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  avatarText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '700',
  },
  rowContent: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 2,
  },
  preview: {
    fontSize: 14,
    color: '#6b7280',
  },
});
