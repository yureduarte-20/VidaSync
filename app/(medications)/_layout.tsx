import { Stack } from "expo-router";


export default function MedicationLayout() {
    return <Stack >
        <Stack.Screen name="add-medication" options={{title: 'Adicionar medicamentos'}} />
    </Stack>
}