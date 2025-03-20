import React from 'react';
import { View, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from './screens/HomeScreen';
import AskAiScreen from './screens/AskAiScreen';
import ChatScreen from './screens/ChatScreen';
import { Ionicons } from '@expo/vector-icons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons'; // Import MaterialIcons

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

function AskAiStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: '#cddfe3' },
        contentStyle: { backgroundColor: '#cddfe3' }, // Ensure screens get the background
      }}
    >
      <Stack.Screen
        name="Ask AI"
        component={AskAiScreen}
        options={{ title: 'AI', headerTitleAlign: 'center' }}
      />
      <Stack.Screen
        name="Chat"
        component={ChatScreen}
        options={{ title: 'Ask AI', headerTitleAlign: 'center' }}
      />
    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <View style={styles.container}>
      <NavigationContainer>
        <Tab.Navigator
          screenOptions={({ route }) => ({
            headerShown: false,
            tabBarIcon: ({ color, size }) => {
              if (route.name === 'Home') {
                return <Ionicons name="home" size={size} color={color} />;
              } else if (route.name === 'Ask AI') {
                return <MaterialIcons name="chat-bubble" size={size} color={color} />; // Use MaterialIcons for Ask AI
              }
            },
            tabBarStyle: styles.tabBar, // Keeps bottom bar different
          })}
        >
          <Tab.Screen
            name="Home"
            component={HomeScreen}
            options={{ contentStyle: styles.screenBackground }}
          />
          <Tab.Screen
            name="Ask AI"
            component={AskAiStack}
            options={{ contentStyle: styles.screenBackground }}
          />
        </Tab.Navigator>
      </NavigationContainer>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#cddfe3', // Ensures the app background is applied
  },
  screenBackground: {
    backgroundColor: '#cddfe3', // Ensures stack screens also have the background
  },
  tabBar: {
    backgroundColor: 'white', // Keeps bottom tab bar different
  },
});
