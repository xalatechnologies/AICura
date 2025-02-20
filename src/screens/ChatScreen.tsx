import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TextInput, FlatList, StyleSheet, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { lightTheme, darkTheme } from '../styles/theme';

interface Message {
  id: string;
  text: string;
  isUser: boolean;
}

const ChatScreen = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const { theme } = useTheme();
  const currentTheme = theme === 'dark' ? darkTheme : lightTheme;
  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    if (flatListRef.current) {
      flatListRef.current.scrollToEnd({ animated: true });
    }
  }, [messages]);

  const handleSend = () => {
    if (inputText.trim()) {
      const userMessage: Message = {
        id: Date.now().toString(),
        text: inputText.trim(),
        isUser: true,
      };
      setMessages(prevMessages => [...prevMessages, userMessage]);
      setInputText('');

      // Simulate AI response
      setTimeout(() => {
        const aiMessage: Message = {
          id: (Date.now() + 1).toString(),
          text: `AI response to: "${inputText.trim()}"`,
          isUser: false,
        };
        setMessages(prevMessages => [...prevMessages, aiMessage]);
      }, 1000);
    }
  };

  const renderMessage = ({ item }: { item: Message }) => (
    <View style={[
      styles.messageBubble,
      item.isUser ? styles.userBubble : styles.aiBubble,
      { backgroundColor: item.isUser ? currentTheme.colors.primary : currentTheme.colors.card }
    ]}>
      <Text style={[styles.messageText, { color: item.isUser ? '#FFFFFF' : currentTheme.colors.text }]}>
        {item.text}
      </Text>
    </View>
  );

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={[styles.container, { backgroundColor: currentTheme.colors.background }]}
    >
      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={renderMessage}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.messageList}
      />
      <View style={styles.inputContainer}>
        <TextInput
          style={[styles.input, { backgroundColor: currentTheme.colors.card, color: currentTheme.colors.text }]}
          value={inputText}
          onChangeText={setInputText}
          placeholder="Type a message..."
          placeholderTextColor={currentTheme.colors.text}
        />
        <TouchableOpacity 
          style={[styles.sendButton, { backgroundColor: currentTheme.colors.primary }]} 
          onPress={handleSend}
        >
          <Text style={styles.sendButtonText}>Send</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  messageList: {
    paddingHorizontal: 10,
    paddingBottom: 10,
  },
  messageBubble: {
    maxWidth: '80%',
    padding: 10,
    borderRadius: 20,
    marginVertical: 5,
  },
  userBubble: {
    alignSelf: 'flex-end',
  },
  aiBubble: {
    alignSelf: 'flex-start',
  },
  messageText: {
    fontSize: 16,
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 10,
  },
  input: {
    flex: 1,
    height: 40,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 20,
    paddingHorizontal: 15,
    marginRight: 10,
  },
  sendButton: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
    borderRadius: 20,
  },
  sendButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
});

export default ChatScreen;

