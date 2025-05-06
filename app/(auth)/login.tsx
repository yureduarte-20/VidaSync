import { useState } from 'react'
import { SafeAreaView } from 'react-native'
export default function Login() {
    const [email, setEmail] = useState<string>('')
    const [password, setPassword] = useState<string>('')
    return <SafeAreaView style={{ flex: 1 }}>

    </SafeAreaView>
}