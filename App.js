import React from 'react';
import Navigation from './navigation/Navigation.js';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

export default function App() {
    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
        <Navigation />
        </GestureHandlerRootView>
    );
}
