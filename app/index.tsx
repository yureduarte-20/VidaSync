import { Credentials, useSession } from '@/store/AuthenticationStore';
import { useSnackbar } from '@/store/SnackbarContext';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { SafeAreaView, View } from 'react-native';
import { Button, Text, TextInput } from 'react-native-paper';

export default function SignIn() {
  const { signIn } = useSession();
  const [credentials, setCredentials] = useState<Credentials>({ email: '', password: '' })
  const { showSnackbar } = useSnackbar()
  const router = useRouter()
  const onSubmit = async () => {
    try{
      await signIn(credentials)
        .then(e => router.replace('/(tabs)/programados'))
    } catch(e : any){
      if(e.code == 'NETWORK_ERROR'){
        showSnackbar(e.message)
        console.log(e)
      } else if(e.code  == 'RESPONSE_ERROR'){
        showSnackbar(e.body.message)
      }
    }
          
  }
  return (
    <SafeAreaView style={{ flex: 1, justifyContent: 'center', padding: 20 }}>
      <View style={{ flexDirection: 'column' }}>
        <TextInput mode='outlined' label={'Email'} style={{ marginBottom: 10 }}  onChangeText={e => setCredentials(state => ({...state, email: e}))} />
        <TextInput mode='outlined' label={'Senha'} style={{ marginBottom: 10 }} onChangeText={e => setCredentials(state => ({...state, password: e}))} />
      </View>
      <View>
        <Button
          mode="outlined"
          onPress={onSubmit}>
          <Text>Entrar</Text>
        </Button>
      </View>
    </SafeAreaView>
  );
}