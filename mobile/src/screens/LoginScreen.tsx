import { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { useAuth } from '../context/AuthContext';

export function LoginScreen() {
  const { signIn } = useAuth();
  const [email, setEmail] = useState('user@carbon.local');
  const [password, setPassword] = useState('User123!');
  const [error, setError] = useState('');

  async function submit() {
    setError('');
    try {
      await signIn(email, password);
    } catch {
      setError('Échec de connexion');
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Carbon Platform</Text>
      <Text style={styles.subtitle}>Connexion mobile terrain</Text>
      <TextInput style={styles.input} placeholder="Email" placeholderTextColor="#999" value={email} onChangeText={setEmail} autoCapitalize="none" />
      <TextInput style={styles.input} placeholder="Mot de passe" placeholderTextColor="#999" value={password} onChangeText={setPassword} secureTextEntry />
      {error ? <Text style={styles.error}>{error}</Text> : null}
      <Pressable style={styles.button} onPress={submit}>
        <Text style={styles.buttonLabel}>Se connecter</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 24,
    backgroundColor: '#edf1ea',
  },
  title: {
    fontSize: 30,
    fontWeight: '800',
    color: '#1f2c27',
  },
  subtitle: {
    color: '#5b6a64',
    marginBottom: 20,
  },
  input: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginBottom: 10,
  },
  error: {
    color: '#c84f4f',
    marginBottom: 8,
  },
  button: {
    marginTop: 8,
    backgroundColor: '#2f6f59',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  buttonLabel: {
    color: '#fff',
    fontWeight: '700',
  },
});
