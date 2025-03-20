import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';

const RegisterScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Chatbot App</Text>
      <TouchableOpacity style={styles.registerButton} onPress={() => navigation.navigate('Signup')}>
        <Text style={styles.buttonText}>Register</Text>
      </TouchableOpacity>
      <Text style={styles.orText}>Or sign up with</Text>
      <View style={styles.iconContainer}>
        <FontAwesome name="google" size={40} color="black" onPress={() => alert('Google Signup')} />
        <FontAwesome name="facebook" size={40} color="black" onPress={() => alert('Facebook Signup')} />
        <FontAwesome name="linkedin" size={40} color="black" onPress={() => alert('LinkedIn Signup')} />
      </View>
      <Text style={styles.mindcysText}>Mindcys</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 20,
  },
  heading: {
    fontSize: 30,
    fontWeight: 'bold',
    marginBottom: 100,  // Increased space between heading and button
    color: '#333',
  },
  registerButton: {
    backgroundColor: '#000',
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 5,
    width: '80%', // Ensuring the button has proper width
    alignItems: 'center',
    marginBottom: 20,  // Added space after the register button
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
  },
  orText: {
    marginVertical: 30,  // Increased margin between "Or sign up with" and icon container
    fontSize: 16,
  },
  iconContainer: {
    flexDirection: 'row',
    width: '50%',
    justifyContent: 'space-between',
    marginBottom: 30,  // Added space between icons and the "Mindcys" text
  },
  mindcysText: {
    fontSize: 12,
    color: '#777',
    marginTop: 20,  // Added margin top to create space from the icons
  },
});

export default RegisterScreen;
