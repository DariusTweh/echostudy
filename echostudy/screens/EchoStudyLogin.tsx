// EchoStudy Login - Final Polish
import React,{useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Platform,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from './navigation/StackNavigator.tsx';
import { Ionicons, AntDesign } from '@expo/vector-icons';
import { supabase } from '../api/supabaseClient'; 




export default function EchoStudyLogin() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');



const handleSignIn = async () => {
  console.log('Attempting sign in...');
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    console.error('Login error:', error.message);
    setErrorMessage(error.message);
  } else {
    console.log('Login success:', data);
    navigation.replace('MainApp');
  }
};

  const handleGoToSignUp = () => {
    navigation.navigate('SignUp');
  };
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      <View style={styles.container}>
        <Text style={styles.logo}>EchoStudy</Text>
        <Text style={styles.subtitle}>Smarter studying starts here.</Text>

        <View style={styles.formContainer}>
          <View style={styles.inputField}>
            <Ionicons name="mail-outline" size={20} color="#6B7280" style={styles.inputIcon} />
            <TextInput
              style={styles.inputText}
              placeholder="Email"
              placeholderTextColor="#9CA3AF"
              keyboardType="email-address"
              value={email}
              onChangeText={setEmail}
            />
          </View>
          <View style={styles.inputField}>
            <Ionicons name="lock-closed-outline" size={20} color="#6B7280" style={styles.inputIcon} />
            <TextInput
              style={styles.inputText}
              placeholder="Password"
              placeholderTextColor="#9CA3AF"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
            />
            <Ionicons name="eye-outline" size={18} color="#9CA3AF" />
          </View>
        </View>

        <TouchableOpacity>
          <Text style={styles.forgotText}>Forgot password?</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.loginButton} onPress={handleSignIn}>
          <Text style={styles.loginText}>Log In</Text>
        </TouchableOpacity>

        <Text style={styles.orDivider}>OR</Text>

        <View style={styles.altRow}>
          <TouchableOpacity style={styles.altLogin}>
            <AntDesign name="google" size={20} color="#1E293B" />
            <Text style={styles.altText}>Google</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.altLogin}>
            <AntDesign name="apple1" size={20} color="#1E293B" />
            <Text style={styles.altText}>Apple</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity onPress={handleGoToSignUp}>
          <Text style={styles.signupText}>Don’t have an account? <Text style={{ color: '#2563EB', fontWeight: '600' }}>Sign Up</Text></Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  container: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 60,
    justifyContent: 'center',
  },
  logo: {
    fontSize: 32,
    fontWeight: '700',
    color: '#1E293B',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 32,
  },
  formContainer: {
    gap: 16,
    marginBottom: 10,
  },
  inputField: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    paddingHorizontal: 14,
    height: 56,
  },
  inputIcon: {
    marginRight: 8,
  },
  inputText: {
    flex: 1,
    fontSize: 16,
    color: '#111827',
  },
  forgotText: {
    fontSize: 13,
    color: '#1F2937',
    textAlign: 'right',
    marginVertical: 12,
  },
  loginButton: {
    backgroundColor: '#3B82F6',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 16,
  },
  loginText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  orDivider: {
    textAlign: 'center',
    color: '#9CA3AF',
    marginVertical: 12,
    fontSize: 14,
  },
  altRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
    marginBottom: 20,
  },
  altLogin: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 12,
    paddingVertical: 12,
    gap: 6,
  },
  altText: {
    fontSize: 14,
    color: '#1E293B',
    fontWeight: '500',
  },
  signupText: {
    fontSize: 14,
    color: '#1E293B',
    textAlign: 'center',
    marginTop: 12,
  },
});