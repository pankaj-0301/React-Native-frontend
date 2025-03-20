import React, { useEffect, useState } from 'react';
import { View, Alert, StatusBar, StyleSheet, ImageBackground, TouchableOpacity, Image, Text, ActivityIndicator } from 'react-native';
import { GoogleSignin, statusCodes } from '@react-native-google-signin/google-signin';
import supabase from '../utils/supabase';
import { useNavigation } from '@react-navigation/native';
import { fetchTransactions } from '../utils/apiClient';

export default function SignIn() {
    const navigation = useNavigation();
    const [loading, setLoading] = useState(true); // Loading state

    useEffect(() => {
        GoogleSignin.configure({
            scopes: ['https://www.googleapis.com/auth/drive.readonly'],
            webClientId: process.env.webclientID,
        });

        // Check if user is already signed in
        checkUserSignedIn();
    }, []);

    const checkUserSignedIn = async () => {
        try {
            const { data: { session }, error } = await supabase.auth.getSession();
            if (session?.user) {
                console.log('user already signed in:', session.user);
                navigation.replace('HomeScreen', { user: session.user });
            } else {
                console.log('No user signed in');
            }
        } catch (error) {
            console.log('user not signed in:', error);
        } finally {
            setLoading(false); // Hide loader after checking
        }
    };
    

    const handleGoogleSignIn = async () => {
        try {
            await GoogleSignin.hasPlayServices();
            const userInfo = await GoogleSignin.signIn();
            console.log('Google Sign-In Success:', userInfo);

            if (userInfo.data.idToken) {
                const { data, error } = await supabase.auth.signInWithIdToken({
                    provider: 'google',
                    token: userInfo.data.idToken,
                });

                if (error) {
                    console.error('Supabase Auth Error:', error);
                    Alert.alert('Error', error.message);
                } else {
                    try {
                        // First check if user exists
                        const { data: existingUser, error: fetchError } = await supabase
                            .from('user')
                            .select('id')
                            .eq('id', data.user.id)
                            .single();

                        if (fetchError) {
                            if (fetchError.code === '42501') {
                                console.error('Permission denied. Please check database permissions:', fetchError);
                                Alert.alert(
                                    'Configuration Error',
                                    'Database permissions not properly configured. Please contact support.'
                                );
                                return;
                            }
                            if (fetchError.code !== 'PGRST116') { // PGRST116 is "not found"
                                console.error('Error checking existing user:', fetchError);
                                throw fetchError;
                            }
                        }

                        // Only insert if user doesn't exist
                        if (!existingUser) {
                            const { error: insertError } = await supabase
                                .from('user')
                                .insert({
                                    id: data.user.id,
                                    email: data.user.email,
                                    name: data.user.user_metadata.full_name,
                                    created_at: new Date().toISOString(),
                                    updated_at: new Date().toISOString(),
                                });

                            if (insertError) {
                                if (insertError.code === '42501') {
                                    console.error('Permission denied. Please check database permissions:', insertError);
                                    Alert.alert(
                                        'Configuration Error',
                                        'Database permissions not properly configured. Please contact support.'
                                    );
                                    return;
                                }
                                console.error('Error inserting user:', insertError);
                                throw insertError;
                            }
                        }

                        console.log("Signed in with Google successfully");
                        navigation.replace('HomeScreen', { user: data.user });
                    } catch (error) {
                        console.error('Database operation error:', error);
                        Alert.alert('Error', 'Failed to process user data. Please try again.');
                    }
                }
            }
        } catch (error) {
            console.error('Google Sign-In Error:', error);
            if (error.code === statusCodes.SIGN_IN_CANCELLED) {
                Alert.alert('Sign In Cancelled', 'user cancelled the login flow.');
            } else if (error.code === statusCodes.IN_PROGRESS) {
                Alert.alert('Sign In In Progress', 'Sign in is already in progress.');
            } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
                Alert.alert('Play Services Error', 'Google Play services not available or outdated.');
            } else {
                Alert.alert('Error', error.message);
            }
        }
    };

    const loadTransactions = async () => {
        try {
            // Get the current user's ID from Supabase session
            const { data: { session } } = await supabase.auth.getSession();
            if (session?.user?.id) {
                const transactions = await fetchTransactions(session.user.id);
                // Handle the transactions data
                console.log('Transactions:', transactions);
            } else {
                console.log('No user session found');
            }
        } catch (error) {
            console.error('Failed to fetch transactions:', error);
        }
    };

    if (loading) {
        return (
            <View style={styles.loaderContainer}>
                <ActivityIndicator size="large" color="#ffffff" />
            </View>
        );
    }

    return (
        <ImageBackground source={{ uri: 'https://e7.pngegg.com/pngimages/703/597/png-clipart-logo-house-home-house-angle-building-thumbnail.png' }} style={styles.background}>
            <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />
            <View style={styles.container}>
                <TouchableOpacity style={styles.googleButton} onPress={handleGoogleSignIn}>
                    <Image source={{ uri: 'https://cdn1.iconfinder.com/data/icons/google-s-logo/150/Google_Icons-09-512.png' }} style={styles.googleIcon} />
                    <Text style={styles.googleText}>Sign in with Google</Text>
                </TouchableOpacity>
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
    googleButton: {
        width: '90%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'white',
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 10,
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
    },
    googleIcon: {
        width: 24,
        height: 24,
        marginRight: 10,
    },
    googleText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
    },
    loaderContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#00000050',
    },
});
