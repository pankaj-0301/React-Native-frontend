import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';

const SetPinScreen = ({ navigation }) => {
  const [pin, setPin] = useState('');

 
    const handleSetPin = () => {
      if (pin.length === 4) { // Simple check for 4-digit PIN
        alert('PIN set successfully!');
        navigation.replace('MainTab'); // Navigate to MainTabNavigator after setting the PIN
      } else {
        alert('Please enter a 4-digit PIN.');
      }
    };
  
    const handleSkip = () => {
      // Navigate directly to the MainTabNavigator when user skips PIN setup
      navigation.replace('MainTab'); // Replace with MainTabNavigator
    };
  
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Set Login PIN</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter 4-digit PIN"
          keyboardType="numeric"
          value={pin}
          onChangeText={setPin}
          maxLength={4}
        />
        <TouchableOpacity style={styles.button} onPress={handleSetPin}>
          <Text style={styles.buttonText}>Set PIN</Text>
        </TouchableOpacity>
  
        <TouchableOpacity style={styles.skipButton} onPress={handleSkip}>
          <Text style={styles.skipButtonText}>Skip</Text>
        </TouchableOpacity>
  
        <View style={styles.footer}>
          <Text style={styles.footerText}>Mindcys</Text>
        </View>
      </View>
    );
  };
  
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    width: '80%',
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 20,
    borderRadius: 5,
    textAlign: 'center',
  },
  button: {
    backgroundColor: 'black',
    paddingVertical: 15,
    paddingHorizontal: 60,
    borderRadius: 5,
    width: '80%',
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
  },
  skipButton: {
    marginTop: 20,
    backgroundColor: '#bbb',
    paddingVertical: 15,
    paddingHorizontal: 60,
    borderRadius: 5,
    width: '80%',
    alignItems: 'center',
  },
  skipButtonText: {
    color: '#fff',
    fontSize: 18,
  },
  footer: {
    width: '100%',
    marginTop: 20,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
  },
});

export default SetPinScreen;
