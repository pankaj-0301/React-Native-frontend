import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';

const OTPScreen = ({ navigation, setIsAuthenticated }) => {
  const [emailOtp, setEmailOtp] = useState('');
  const [phoneOtp, setPhoneOtp] = useState('');

  const handleVerify = () => {
    if (emailOtp === '1234' && phoneOtp === '1234') {
      alert('Verification Successful!');
      navigation.replace('SetPin'); // Navigate to SetPinScreen after verification
    } else {
      alert('Invalid OTP. Please try again.');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        <Text style={styles.icon}>✔</Text>
      </View>
      <Text style={styles.title}>Enter Code to Continue</Text>
      <Text style={styles.message}>Verification has been sent to 982XXXXXX & your email.</Text>

      <TextInput
        style={styles.input}
        placeholder="Enter Email OTP"
        keyboardType="numeric"
        value={emailOtp}
        onChangeText={setEmailOtp}
      />
      <TextInput
        style={styles.input}
        placeholder="Enter Phone OTP"
        keyboardType="numeric"
        value={phoneOtp}
        onChangeText={setPhoneOtp}
      />

      <TouchableOpacity style={styles.button} onPress={handleVerify}>
        <Text style={styles.buttonText}>Verify</Text>
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
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#2ecc71',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  icon: {
    color: '#fff',
    fontSize: 30,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  message: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
    color: '#555',
  },
  input: {
    width: '80%',
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 15,
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

export default OTPScreen;
