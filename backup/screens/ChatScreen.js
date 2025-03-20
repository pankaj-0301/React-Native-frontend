import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
export default function ChatScreen({ route }) {
  const assistant = route?.params?.assistant || { name: 'Assistant', specialization: 'General' };
  const [messages, setMessages] = useState([
    { type: 'ai', text: `Hello! I'm your new AI Assistant ${assistant.name}. How can I help with ${assistant.specialization.toLowerCase()}?` },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const flatListRef = useRef(null);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { type: 'user', text: input };
    setMessages((prevMessages) => [...prevMessages, userMessage]);

    setInput('');
    setLoading(true);

    try {
      const response = await fetch('https://researchbackend-mu7r.onrender.com/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: input }),
      });

      const data = await response.json();

      const aiMessage = {
        type: 'ai',
        text: data.data?.aiResponse || 'Sorry, I could not understand your question.',
      };

      setMessages((prevMessages) => [...prevMessages, aiMessage]);
    } catch (error) {
      const errorMessage = {
        type: 'ai',
        text: 'Something went wrong. Please try again later.',
      };
      setMessages((prevMessages) => [...prevMessages, errorMessage]);
    } finally {
      setLoading(false);
      flatListRef.current?.scrollToEnd({ animated: true });
    }
  };

  const renderMessage = ({ item }) => (
    <View
      style={[
        styles.messageContainer,
        item.type === 'user' ? styles.userMessage : styles.aiMessage,
      ]}
    >
      <Text style={styles.messageText}>{item.text}</Text>
    </View>
  );

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.headerContainer}>
        <Text style={styles.header}>{assistant.name}</Text>
      </View>
      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={renderMessage}
        keyExtractor={(_, index) => index.toString()}
        contentContainerStyle={styles.chatContainer}
        onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
      />
      {loading && <ActivityIndicator size="small" color="#0000ff" />}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={input}
          onChangeText={setInput}
          placeholder="Ask a question"
          onSubmitEditing={sendMessage}
          returnKeyType="send"
        />
        <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
        <Ionicons name="send-outline" size={24} color="black" />        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#cddfe3',
  },
  headerContainer: {
    backgroundColor: '#A9A9A9',
    borderRadius: 10,
    paddingVertical: 10,
    height: '12%',
    paddingHorizontal: 30,
    alignSelf: 'stretch',
    marginBottom: 20,
    width: '100%',
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'left',
  },
  chatContainer: {
    flexGrow: 1,
    marginBottom: 10,
  },
  messageContainer: {
    maxWidth: '80%',
    padding: 10,
    marginVertical: 5,
    borderRadius: 10,
  },
  userMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#A9A9A9',
  },
  aiMessage: {
    alignSelf: 'flex-start',
    backgroundColor: '#A9A9A9',
  },
  messageText: {
    color: '#000',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 15,
    paddingHorizontal: 10,
    backgroundColor: '#fff',
    backgroundColor: '#A9A9A9',
    paddingVertical: 8,

  },
  input: {
    flex: 1,
    height: 40,
    padding: 10,
    fontSize: 16,
  },
  sendButton: {
    marginLeft: 10,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
