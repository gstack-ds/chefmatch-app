import React, { useEffect, useState, useRef, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { RouteProp, useRoute } from '@react-navigation/native';
import { Message } from '../../models/types';
import { useAuth } from '../../hooks/use-auth';
import {
  getMessages,
  sendMessage,
  subscribeToMessages,
} from '../../services/message-service';

type ChatParams = {
  Chat: { conversationId: string; otherUserName: string };
};

type ChatRouteProp = RouteProp<ChatParams, 'Chat'>;

export default function ChatScreen() {
  const route = useRoute<ChatRouteProp>();
  const { conversationId } = route.params;
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [inputText, setInputText] = useState('');
  const [isSending, setIsSending] = useState(false);
  const flatListRef = useRef<FlatList<Message>>(null);

  const fetchMessages = useCallback(async () => {
    try {
      const data = await getMessages(conversationId);
      setMessages(data);
    } catch {
      // User sees empty chat
    }
  }, [conversationId]);

  useEffect(() => {
    fetchMessages().finally(() => setIsLoading(false));
  }, [fetchMessages]);

  useEffect(() => {
    const channel = subscribeToMessages(conversationId, (newMessage) => {
      setMessages((prev) => {
        if (prev.some((m) => m.id === newMessage.id)) return prev;
        return [...prev, newMessage];
      });
    });

    return () => {
      channel.unsubscribe();
    };
  }, [conversationId]);

  const handleSend = async () => {
    const trimmed = inputText.trim();
    if (!trimmed || !user || isSending) return;

    setIsSending(true);
    setInputText('');
    try {
      const sent = await sendMessage(conversationId, user.id, trimmed);
      setMessages((prev) => {
        if (prev.some((m) => m.id === sent.id)) return prev;
        return [...prev, sent];
      });
    } catch {
      setInputText(trimmed);
    } finally {
      setIsSending(false);
    }
  };

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#f97316" />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={90}
    >
      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.messageList}
        onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: false })}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No messages yet. Say hello!</Text>
        }
        renderItem={({ item }) => {
          const isMine = item.senderId === user?.id;
          return (
            <View
              style={[
                styles.messageBubble,
                isMine ? styles.myBubble : styles.theirBubble,
              ]}
            >
              <Text
                style={[
                  styles.messageText,
                  isMine ? styles.myText : styles.theirText,
                ]}
              >
                {item.content}
              </Text>
            </View>
          );
        }}
      />
      <View style={styles.inputRow}>
        <TextInput
          style={styles.input}
          value={inputText}
          onChangeText={setInputText}
          placeholder="Type a message..."
          placeholderTextColor="#9ca3af"
          multiline
          maxLength={2000}
        />
        <TouchableOpacity
          style={[styles.sendButton, (!inputText.trim() || isSending) && styles.sendDisabled]}
          onPress={handleSend}
          disabled={!inputText.trim() || isSending}
        >
          <Text style={styles.sendText}>Send</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
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
  messageList: {
    padding: 16,
    paddingBottom: 8,
    flexGrow: 1,
    justifyContent: 'flex-end',
  },
  emptyText: {
    textAlign: 'center',
    color: '#9ca3af',
    fontSize: 16,
    marginTop: 40,
  },
  messageBubble: {
    maxWidth: '78%',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 16,
    marginBottom: 8,
  },
  myBubble: {
    backgroundColor: '#f97316',
    alignSelf: 'flex-end',
    borderBottomRightRadius: 4,
  },
  theirBubble: {
    backgroundColor: '#f3f4f6',
    alignSelf: 'flex-start',
    borderBottomLeftRadius: 4,
  },
  messageText: {
    fontSize: 15,
    lineHeight: 21,
  },
  myText: {
    color: '#fff',
  },
  theirText: {
    color: '#1f2937',
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    backgroundColor: '#fff',
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 15,
    color: '#1f2937',
    maxHeight: 100,
    backgroundColor: '#f9fafb',
  },
  sendButton: {
    marginLeft: 8,
    backgroundColor: '#f97316',
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 20,
  },
  sendDisabled: {
    opacity: 0.4,
  },
  sendText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '700',
  },
});
