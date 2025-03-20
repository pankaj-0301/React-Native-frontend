import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';

const WelcomeScreen = ({ navigation }) => {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.heading}>Welcome to Mindcys!!</Text>
      <Text style={styles.description}>
        Mindcys is a tech company committed to delivering innovative solutions and high-quality services that help businesses grow and evolve.
      </Text>
      <Image
        source={require('../assets/company_logo.png')}
        style={styles.logo}
      />
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('Register')}
      >
        <Text style={styles.buttonText}>Get Started</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingTop: 40,
    paddingBottom: 40,
  },
  heading: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginTop: 50,  // Added margin above the heading
  },
  description: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginHorizontal: 20,
    marginBottom: 30,
  },
  logo: {
    width: 200,
    height: 200,
    borderRadius: 10, // Rounded corners for the logo
    marginBottom: 30, // Space between the logo and the button
    borderColor: '#A9A9A9', // Border color for the logo
  },
  button: {
    backgroundColor: '#000',
    width: '80%', // Ensuring the button takes up 80% width
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default WelcomeScreen;
