import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';

const SignupScreen = ({ navigation }) => {
  const [form, setForm] = useState({
    name: '',
    profileName: '',
    dob: '',
    country: '',
    state: '',
    city: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });

  return (
    <View style={styles.container}>
      {/* App Name/Header */}
      <View style={styles.header}>
        <Text style={styles.appName}>App Name</Text>
      </View>

      {/* Input Fields */}
      <TextInput
        style={styles.input}
        placeholder="Name"
        placeholderTextColor="gray"
        onChangeText={(value) => setForm({ ...form, name: value })}
      />
      <TextInput
        style={styles.input}
        placeholder="Profile Name"
        placeholderTextColor="gray"
        onChangeText={(value) => setForm({ ...form, profileName: value })}
      />
      
      {/* DOB and Country in single row */}
      <View style={styles.row}>
        <TextInput
          style={[styles.input, { width: '48%' }]}
          placeholder="D.O.B"
          placeholderTextColor="gray"
          onChangeText={(value) => setForm({ ...form, dob: value })}
        />
        <TextInput
          style={[styles.input, { width: '48%' }]}
          placeholder="Country"
          placeholderTextColor="gray"
          onChangeText={(value) => setForm({ ...form, country: value })}
        />
      </View>
      <View style={styles.row}>
      <TextInput
          style={[styles.input, { width: '48%' }]}
        placeholder="State"
        placeholderTextColor="gray"
        onChangeText={(value) => setForm({ ...form, state: value })}
      />
      <TextInput
          style={[styles.input, { width: '48%' }]}
        placeholder="City"
        placeholderTextColor="gray"
        onChangeText={(value) => setForm({ ...form, city: value })}
      />
      </View>
      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor="gray"
        onChangeText={(value) => setForm({ ...form, email: value })}
      />
      <TextInput
        style={styles.input}
        placeholder="Phone No"
        placeholderTextColor="gray"
        onChangeText={(value) => setForm({ ...form, phone: value })}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        placeholderTextColor="gray"
        secureTextEntry
        onChangeText={(value) => setForm({ ...form, password: value })}
      />
      <TextInput
        style={styles.input}
        placeholder="Retype Password"
        placeholderTextColor="gray"
        secureTextEntry
        onChangeText={(value) => setForm({ ...form, confirmPassword: value })}
      />

      {/* Get OTP Button */}
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('OTP')}
      >
        <Text style={styles.buttonText}>Get OTP</Text>
      </TouchableOpacity>

      {/* Footer (Optional) */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>Mindcys</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 20,
  },
  header: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 20,
  },
  appName: {
    fontSize: 30,
    fontWeight: 'bold',
    color: 'black',
  },
  input: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 12,
    marginBottom: 12,
    borderRadius: 5,
    backgroundColor: '#A9A9A9', // Gray background for all inputs
    color: 'black', // Black text color
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 15,
  },
  button: {
    paddingVertical: 15,
    paddingHorizontal: 50,
    backgroundColor: 'black',
    borderRadius: 5,
    width: '100%', // Full width for the button
    alignItems: 'center',
    marginBottom: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    textAlign: 'center',
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

export default SignupScreen;
