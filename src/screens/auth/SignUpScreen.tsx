import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useAuth } from '../../hooks/use-auth';
import { ChefTier } from '../../config/constants';

type AuthStackParamList = {
  Login: undefined;
  SignUp: undefined;
};

type Props = NativeStackScreenProps<AuthStackParamList, 'SignUp'>;

type Role = 'chef' | 'consumer';

export default function SignUpScreen({ navigation }: Props) {
  const { signUp, error, clearError } = useAuth();
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<Role>('consumer');
  const [chefTier, setChefTier] = useState<ChefTier>(ChefTier.HOME_CHEF);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSignUp = async () => {
    if (!displayName.trim() || !email.trim() || !password) return;

    setIsSubmitting(true);
    try {
      await signUp({
        displayName: displayName.trim(),
        email: email.trim(),
        password,
        role,
        chefTier: role === 'chef' ? chefTier : undefined,
      });
    } catch {
      // Error is set in context
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleNavigateToLogin = () => {
    clearError();
    navigation.navigate('Login');
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.title}>Create Account</Text>
        <Text style={styles.subtitle}>Join the ChefMatch community</Text>

        {error && <Text style={styles.error}>{error}</Text>}

        <TextInput
          style={styles.input}
          placeholder="Display Name"
          value={displayName}
          onChangeText={setDisplayName}
          autoCapitalize="words"
          textContentType="name"
          editable={!isSubmitting}
        />

        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
          textContentType="emailAddress"
          editable={!isSubmitting}
        />

        <TextInput
          style={styles.input}
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          textContentType="newPassword"
          editable={!isSubmitting}
        />

        <Text style={styles.sectionLabel}>I am a...</Text>
        <View style={styles.cardRow}>
          <TouchableOpacity
            style={[styles.roleCard, role === 'consumer' && styles.roleCardSelected]}
            onPress={() => setRole('consumer')}
            disabled={isSubmitting}
          >
            <Text style={[styles.roleCardTitle, role === 'consumer' && styles.roleCardTitleSelected]}>
              Food Lover
            </Text>
            <Text style={[styles.roleCardDesc, role === 'consumer' && styles.roleCardDescSelected]}>
              Find amazing chefs
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.roleCard, role === 'chef' && styles.roleCardSelected]}
            onPress={() => setRole('chef')}
            disabled={isSubmitting}
          >
            <Text style={[styles.roleCardTitle, role === 'chef' && styles.roleCardTitleSelected]}>
              Chef
            </Text>
            <Text style={[styles.roleCardDesc, role === 'chef' && styles.roleCardDescSelected]}>
              Cook for others
            </Text>
          </TouchableOpacity>
        </View>

        {role === 'chef' && (
          <>
            <Text style={styles.sectionLabel}>Chef Type</Text>
            <View style={styles.cardRow}>
              <TouchableOpacity
                style={[styles.roleCard, chefTier === ChefTier.CLASSICALLY_TRAINED && styles.roleCardSelected]}
                onPress={() => setChefTier(ChefTier.CLASSICALLY_TRAINED)}
                disabled={isSubmitting}
              >
                <Text style={[
                  styles.roleCardTitle,
                  chefTier === ChefTier.CLASSICALLY_TRAINED && styles.roleCardTitleSelected,
                ]}>
                  Classically Trained
                </Text>
                <Text style={[
                  styles.roleCardDesc,
                  chefTier === ChefTier.CLASSICALLY_TRAINED && styles.roleCardDescSelected,
                ]}>
                  Professional background
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.roleCard, chefTier === ChefTier.HOME_CHEF && styles.roleCardSelected]}
                onPress={() => setChefTier(ChefTier.HOME_CHEF)}
                disabled={isSubmitting}
              >
                <Text style={[
                  styles.roleCardTitle,
                  chefTier === ChefTier.HOME_CHEF && styles.roleCardTitleSelected,
                ]}>
                  Home Chef
                </Text>
                <Text style={[
                  styles.roleCardDesc,
                  chefTier === ChefTier.HOME_CHEF && styles.roleCardDescSelected,
                ]}>
                  Talented home cook
                </Text>
              </TouchableOpacity>
            </View>
          </>
        )}

        <TouchableOpacity
          style={[styles.button, isSubmitting && styles.buttonDisabled]}
          onPress={handleSignUp}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Create Account</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.linkButton}
          onPress={handleNavigateToLogin}
          disabled={isSubmitting}
        >
          <Text style={styles.linkText}>
            Already have an account? <Text style={styles.linkBold}>Sign In</Text>
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 32,
    paddingVertical: 48,
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
    color: '#1a1a1a',
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    color: '#666',
    marginBottom: 32,
  },
  error: {
    color: '#dc2626',
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 16,
    paddingHorizontal: 8,
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    marginBottom: 16,
    backgroundColor: '#f9f9f9',
  },
  sectionLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
    marginTop: 8,
  },
  cardRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  roleCard: {
    flex: 1,
    borderWidth: 2,
    borderColor: '#ddd',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  roleCardSelected: {
    borderColor: '#2563eb',
    backgroundColor: '#eff6ff',
  },
  roleCardTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  roleCardTitleSelected: {
    color: '#2563eb',
  },
  roleCardDesc: {
    fontSize: 12,
    color: '#999',
    textAlign: 'center',
  },
  roleCardDescSelected: {
    color: '#60a5fa',
  },
  button: {
    height: 50,
    backgroundColor: '#2563eb',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  linkButton: {
    marginTop: 24,
    alignItems: 'center',
  },
  linkText: {
    fontSize: 14,
    color: '#666',
  },
  linkBold: {
    color: '#2563eb',
    fontWeight: '600',
  },
});
