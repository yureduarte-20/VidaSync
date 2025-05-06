import { router } from "expo-router";
import { SafeAreaView, View } from "react-native";
import { FAB, useTheme } from 'react-native-paper';
export default function Programados() {
    const theme = useTheme()
    
    return (
        <SafeAreaView style={{ flex: 1 }}>
            <View >

            </View>
            <FAB
                icon="plus"
                onPress={() => router.navigate('/(app)/(medications)/add-medication')}
                style={{
                    position: 'absolute',
                    margin: 16,
                    right: 0,
                    bottom: 0,
                }} />
        </SafeAreaView>
    )
}