import React from 'react';
import { View, StatusBar, StyleSheet, ImageBackground, Image, Text, TouchableOpacity, Alert } from 'react-native';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import supabase from '../utils/supabase';
import { useNavigation } from '@react-navigation/native';

export default function HomeScreen({ route }) {
    const { user } = route.params || {};
    const navigation = useNavigation();

    const handleSignOut = async () => {
        try {
            await GoogleSignin.signOut();
            await supabase.auth.signOut();

            Alert.alert("Signed Out", "You have been signed out successfully.");
            navigation.replace('SignIn');
        } catch (error) {
            console.error("Sign Out Error:", error);
            Alert.alert("Error", "Failed to sign out. Please try again.");
        }
    };

    return (
        <ImageBackground source={{ uri: 'https://e7.pngegg.com/pngimages/703/597/png-clipart-logo-house-home-house-angle-building-thumbnail.png' }} style={styles.background}>
            <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />
            <View style={styles.container}>
                <View style={styles.profileCard}>
                    <Image source={{ uri: user?.photo }} style={styles.profileImage} />
                    <Text style={styles.name}>{user?.name}</Text>
                    <Text style={styles.email}>{user?.email}</Text>
                    <Text style={styles.userId}>user ID: {user?.id}</Text>

                    <TouchableOpacity style={styles.signOutButton} onPress={handleSignOut}>
                        <Text style={styles.signOutText}>Sign Out</Text>
                    </TouchableOpacity>

                    {/* Navigate to Transactions */}
                    <TouchableOpacity
                        style={[styles.signOutButton, { backgroundColor: '#4caf50', marginTop: 10 }]}
                        onPress={() => navigation.navigate('TransactionsScreen', { userId: user.id })}
                    >
                        <Text style={styles.signOutText}>View Transactions</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </ImageBackground>
    );
}

const styles = StyleSheet.create({
    background: {
        flex: 1,
        resizeMode: 'cover',
        justifyContent: 'center',
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    profileCard: {
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        padding: 20,
        borderRadius: 10,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 5,
    },
    profileImage: {
        width: 80,
        height: 80,
        borderRadius: 40,
        marginBottom: 10,
    },
    name: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
    },
    email: {
        fontSize: 14,
        color: '#666',
    },
    userId: {
        fontSize: 12,
        color: '#999',
        marginTop: 5,
    },
    signOutButton: {
        marginTop: 20,
        backgroundColor: '#ff3b30',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
        elevation: 3,
    },
    signOutText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#fff',
    },
});
