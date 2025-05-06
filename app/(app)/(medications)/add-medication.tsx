import Select from "@/components/ui/Select";
import { useMedicationStore } from "@/hooks/useMedicationStore";
import { MedicationType } from "@/store/MedicationStore";
import { router } from "expo-router";
import React, { useState } from "react";
import { SafeAreaView, ToastAndroid } from "react-native";
import { Button, Text, TextInput } from "react-native-paper";

export default function AddMedication() {
    const [medication, setMedication] = useState<MedicationType>({
        apresentation: 'Capsula',
        description: '',
        dose: '',
        name: '',
        qtde: 1
    })
    const { addMedication } = useMedicationStore()
    const setField = (field: keyof MedicationType, value: any) => {
        setMedication(state => ({ ...state, [field]: value }))
    }
    const add = () => {
        addMedication(medication)
            .then(() => {
                ToastAndroid.show('Cadastrado', ToastAndroid.SHORT)
                router.replace('/(app)/(tabs)/medication')
            })
    }
    const cities = [
        { label: 'Capsula', value: 'Capsula' },
        { label: 'Comprimido', value: 'Comprimido' },
        { label: 'Solvente', value: 'Solvente' },
    ];

    return (<SafeAreaView style={{ flex: 1, paddingHorizontal: 20, paddingVertical: 15 }}>
        <Text style={{ fontSize: 18, letterSpacing: 1.5, textAlign: 'center', marginBottom: 10 }}>Preencha os campos e clique no botão Salvar para adicioná-lo!</Text>
        <TextInput value={medication.name} onChangeText={e => setField('name', e)} label="Nome*" mode="outlined" style={{ marginBottom: 10 }} />
        <Select
            label="Apresentação*"
            options={cities}
            value={medication.apresentation}
            onSelect={(option) => setField('apresentation', option.value as string)}
            placeholder="Escolha uma opção"
        />
        <TextInput label="Dose*" value={medication.dose} onChangeText={text => setField('dose', text)} mode="outlined" style={{ marginBottom: 10 }} />
        <TextInput label="Quantidade*" value={medication.qtde.toString()} onChangeText={text => setField('qtde', parseFloat(text))} mode="outlined" style={{ marginBottom: 10 }} />
        <Button mode="outlined" onPress={add}>
            <Text>Enviar</Text>
        </Button>
    </ SafeAreaView >)
}