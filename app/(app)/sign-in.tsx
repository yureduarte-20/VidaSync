import { Credentials, useSession } from '@/store/AuthenticationStore';
import { router } from 'expo-router';
import { useState } from 'react';
import { SafeAreaView, View } from 'react-native';
import { Button, Text, TextInput } from 'react-native-paper';

export default function SignIn() {
  const { signIn } = useSession();
  const [credentials, setCredentials] = useState<Credentials>({ login: '', password: '' })
  return (
    <SafeAreaView style={{ flex: 1, justifyContent: 'center', padding: 20 }}>
      <View style={{ flexDirection: 'column' }}>
        <TextInput mode='outlined' label={'Email'} style={{ marginBottom: 10 }}  onChangeText={e => setCredentials(state => ({...state, login: e}))} />
        <TextInput mode='outlined' label={'Senha'} style={{ marginBottom: 10 }} onChangeText={e => setCredentials(state => ({...state, password: e}))} />
      </View>
      <View>
        <Button
          mode="outlined"
          onPress={() => {
            signIn(credentials).then(() => router.replace('/(app)/(tabs)'));
          }}>
          <Text>Entrar</Text>
        </Button>
      </View>
    </SafeAreaView>
  );
}