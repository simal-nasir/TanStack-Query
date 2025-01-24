import React, { useState } from 'react';
import { View, Text, TextInput, Button } from 'react-native';
import { useLoginMutation } from './authService';

const LoginScreen = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { mutate: login, isLoading, error } = useLoginMutation(); // Correct usage of isLoading

    const handleLogin = () => {
        login(
            { email, password },
            {
                onSuccess: () => {
                    // Handle successful login (e.g., navigation)
                    console.log('Login successful!');
                },
                onError: (err) => {
                    // Handle error (e.g., display error message)
                    console.error('Login failed:', err);
                },
            }
        );
    };

    return (
        <View>
            <TextInput
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
                style={{ borderWidth: 1, marginBottom: 10, padding: 8 }}
            />
            <TextInput
                placeholder="Password"
                secureTextEntry
                value={password}
                onChangeText={setPassword}
                style={{ borderWidth: 1, marginBottom: 10, padding: 8 }}
            />
            <Button title="Login" onPress={handleLogin} disabled={isLoading} />
            {isLoading && <Text>Loading...</Text>}
            {error && <Text style={{ color: 'red' }}>{error.message}</Text>}
        </View>
    );
};

export default LoginScreen;