import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

import WelcomeScreen from './screens/WelcomeScreen';
import RegisterScreen from './screens/RegisterScreen';
import SignupScreen from './screens/SignupScreen';
import OTPScreen from './screens/OTPScreen';
import HomeScreen from './screens/HomeScreen';
import AskAiScreen from './screens/AskAiScreen';
import ChatScreen from './screens/ChatScreen';
import SetPinScreen from './screens/SetPinScreen';
const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

function AskAiStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: '#cddfe3' },
        contentStyle: { backgroundColor: '#cddfe3' },
      }}
    >
      <Stack.Screen name="Ask AI" component={AskAiScreen} options={{ title: 'AI', headerTitleAlign: 'center' }} />
      <Stack.Screen name="Chat" component={ChatScreen} options={{ title: 'Ask AI', headerTitleAlign: 'center' }} />
    </Stack.Navigator>
  );
}

function MainTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ color, size }) => {
          if (route.name === 'Home') {
            return <Ionicons name="home" size={size} color={color} />;
          } else if (route.name === 'Ask AI') {
            return <MaterialIcons name="chat-bubble" size={size} color={color} />;
          }
        },
        tabBarStyle: styles.tabBar,
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Ask AI" component={AskAiStack} />
    </Tab.Navigator>
  );
}

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  return (
    <View style={styles.container}>
      <NavigationContainer>
        {!isAuthenticated ? (
          <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Welcome" component={WelcomeScreen} />
            <Stack.Screen name="Register" component={RegisterScreen} />
            <Stack.Screen name="Signup" component={SignupScreen} />
            <Stack.Screen
              name="OTP"
              component={(props) => <OTPScreen {...props} setIsAuthenticated={setIsAuthenticated} />}
            />
            {/* Add the set pin screen here */}
            <Stack.Screen name="SetPin" component={SetPinScreen} />
          </Stack.Navigator>
        ) : (
          <MainTabNavigator /> // Make sure to show the main tab navigator after authentication
        )}
      </NavigationContainer>
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#cddfe3',
  },
  tabBar: {
    backgroundColor: 'white',
  },
});
