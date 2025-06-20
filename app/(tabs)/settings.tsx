
import { useFetcher } from '@/hooks/useFetcher';
import { User, useSession } from '@/store/AuthenticationStore';
import { useSnackbar } from '@/store/SnackbarContext';
import Constants from 'expo-constants';
import React, { useCallback, useEffect, useState } from 'react';
import { SafeAreaView, StyleSheet, ToastAndroid, View } from 'react-native';
import { Avatar, Button, Text, TextInput } from 'react-native-paper';
// URL base da API de avatares
const AVATAR_API_URL = 'https://ui-avatars.com/api/';

export default function ProfileScreen() {
  
    const { session, signOut, updateUser } =  useSession ();
    const { showSnackbar } = useSnackbar();
    const [user, setUser] = useState<User>()
    const fetcher = useCallback(useFetcher, []);
    // Estado para controlar o modo de edição
    const [isEditing, setIsEditing] = useState(false);
    // Estado para o formulário de edição
    const [name, setName] = useState(user?.name || '');
    const [email, setEmail] = useState(user?.email || '');
    // Estado para o loading do salvamento
    const [isLoading, setIsLoading] = useState(false);

    async function loadProfile()
    {
      const { body } = await fetcher<User>({
          uri: '/user',
          method: 'GET',
          headers:{
            'Authorization': 'Bearer ' + session
          }
        })
        setUser(body)
        setEmail(body.email)
        setName(body.name)
    }
    // Sincroniza o estado do formulário se o usuário do store mudar
    useEffect(() => {
        loadProfile()
    }, []);
    

    if (!user) {
        // Se por algum motivo não houver usuário, exibe uma mensagem ou tela de login
        return (
            <SafeAreaView style={styles.container}>
                <Text variant="headlineMedium">Usuário não encontrado.</Text>
            </SafeAreaView>
        );
    }
    
    // Constrói a URL do avatar dinamicamente
    const avatarUrl = `${AVATAR_API_URL}?name=${user.name.replace(/\s/g, '+')}&size=128&background=764abc&color=fff`;

    const handleEdit = () => {
        setIsEditing(true);
    };

    const handleCancel = () => {
        // Restaura os valores originais
        setName(user.name);
        setEmail(user.email);
        setIsEditing(false);
    };

    const handleSave = async () => {
        if (!name.trim() || !email.trim()) {
            showSnackbar("Nome e e-mail não podem estar vazios.");
            return;
        }

        setIsLoading(true);
        try {
            await updateUser({ name, email });
            await loadProfile()
            ToastAndroid.show('Perfil atualizado com sucesso!', ToastAndroid.SHORT);
            setIsEditing(false);
        } catch (error) {
            console.error(error);
            showSnackbar("Falha ao atualizar o perfil. Tente novamente.");
        } finally {
            setIsLoading(false);
        }
    };


    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.avatarContainer}>
                <Avatar.Image size={128} source={{ uri: avatarUrl }} />
                {!isEditing && (
                    <Text variant="headlineSmall" style={styles.nameText}>
                        {user.name}
                    </Text>
                )}
            </View>

            <View style={styles.formContainer}>
                <TextInput
                    label="Nome Completo"
                    value={name}
                    onChangeText={setName}
                    mode="outlined"
                    style={styles.input}
                    disabled={!isEditing || isLoading}
                />
                <TextInput
                    label="E-mail"
                    value={email}
                    onChangeText={setEmail}
                    mode="outlined"
                    style={styles.input}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    disabled={!isEditing || isLoading}
                />
            </View>

            <View style={styles.buttonContainer}>
                {isEditing ? (
                    <>
                        <Button
                            mode="contained"
                            onPress={handleSave}
                            style={styles.button}
                            icon="check"
                        >
                            Salvar
                        </Button>
                        <Button
                            mode="outlined"
                            onPress={handleCancel}
                            style={styles.button}
                            icon="cancel"
                        >
                            Cancelar
                        </Button>
                    </>
                ) : (
                    <Button
                        mode="contained"
                        onPress={handleEdit}
                        style={styles.button}
                        icon="pencil"
                    >
                        Editar Perfil
                    </Button>
                )}
                 <Button
                    mode="text"
                    onPress={signOut}
                    style={styles.logoutButton}
                    textColor='red'
                >
                    Sair (Logout)
                </Button>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        padding: 20,
        paddingTop: Constants.statusBarHeight
    },
    avatarContainer: {
        alignItems: 'center',
        marginBottom: 24,
    },
    nameText: {
        marginTop: 16,
    },
    formContainer: {
        width: '100%',
        marginBottom: 24,
    },
    input: {
        marginBottom: 16,
    },
    buttonContainer: {
        width: '100%',
        alignItems: 'center',
    },
    button: {
        width: '80%',
        marginBottom: 12,
    },
    logoutButton: {
        marginTop: 20,
    }
});