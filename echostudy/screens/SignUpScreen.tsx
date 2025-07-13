import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  StatusBar,
  Platform,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { supabase } from '../api/supabaseClient';

export default function SignUpScreen() {
  const navigation = useNavigation();

  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [password, setPassword] = useState('');

  const handleSignUp = async () => {
  if (!fullName || !email || !password || !confirmPassword) {
    alert('Please fill out all fields.');
    return;
  }

  if (password !== confirmPassword) {
    alert('Passwords do not match.');
    return;
  }

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });

  if (error) {
    console.error('Sign-up error:', error);
    alert(error.message);
  } else if (data.user) {
    // You’ll use fullName later in onboarding profile insert
    navigation.reset({
      index: 0,
      routes: [
        {
          name: 'InterestToneScreen',
          params: {
            full_name: fullName,
            email,
            user_id: data.user.id,
          },
        },
      ],
    });
  }
};

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F9FAFB" />

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.header}>Create Account</Text>
        <Text style={styles.subheader}>Start your journey with EchoStudy</Text>

        <TextInput
  style={styles.input}
  placeholder="Full Name"
  placeholderTextColor="#94A3B8"
  value={fullName}
  onChangeText={setFullName}
/>

        <TextInput
          style={styles.input}
          placeholder="Email Address"
          placeholderTextColor="#94A3B8"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
        />

        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor="#94A3B8"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
       
        <TextInput
          style={styles.input}
          placeholder="Confirm Password"
          placeholderTextColor="#94A3B8"
          secureTextEntry
          value={confirmPassword}
          onChangeText={setConfirmPassword}
        />

        <TouchableOpacity style={styles.signUpButton} onPress={handleSignUp}>
          <Text style={styles.buttonText}>Sign Up</Text>
        </TouchableOpacity>

        <View style={styles.dividerRow}>
          <View style={styles.line} />
          <Text style={styles.or}>OR</Text>
          <View style={styles.line} />
        </View>

        <View style={styles.socialRow}>
          <TouchableOpacity style={styles.socialButton}>
            <Text style={styles.socialText}>Continue with Google</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.socialButton}>
            <Text style={styles.socialText}>Continue with Facebook</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
          <Text style={styles.loginText}>
            Already have an account? <Text style={styles.loginLink}>Log in</Text>
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  content: {
    padding: 24,
    paddingBottom: 40,
  },
  header: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1E293B',
    textAlign: 'center',
    marginTop: 20,
  },
  subheader: {
    fontSize: 14,
    color: '#64748B',
    textAlign: 'center',
    marginBottom: 30,
    marginTop: 8,
  },
  input: {
    height: 56,
    borderRadius: 10,
    backgroundColor: '#E5E7EB',
    paddingHorizontal: 16,
    marginBottom: 16,
    fontSize: 16,
    color: '#1E293B',
  },
  signUpButton: {
    backgroundColor: '#3B82F6',
    borderRadius: 10,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 16,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: '#CBD5E1',
  },
  or: {
    marginHorizontal: 8,
    color: '#94A3B8',
    fontWeight: '600',
  },
  socialRow: {
    gap: 12,
    marginBottom: 32,
  },
  socialButton: {
    backgroundColor: '#E2E8F0',
    borderRadius: 10,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  socialText: {
    color: '#1E293B',
    fontSize: 15,
    fontWeight: '500',
  },
  loginText: {
    textAlign: 'center',
    color: '#475569',
    fontSize: 14,
  },
  loginLink: {
    fontWeight: '600',
    color: '#3B82F6',
  },
});
