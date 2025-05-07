import Select from "@/components/ui/Select";
import { useMedicationStore } from "@/hooks/useMedicationStore";
import { MedicationType, Schedule } from "@/store/MedicationStore";
import { router } from "expo-router";
import React, { useState } from "react";
import { SafeAreaView, ToastAndroid } from "react-native";
import { Button, Text, TextInput } from "react-native-paper";
import Validator from "validatorjs";

export default function AddMedication() {
    const [medication, setMedication] = useState<MedicationType>({
        apresentation: 'Capsula',
        description: '',
        dose: '',
        name: '',
        qtde: 1
    })
    const [schedule, setSchedule] = useState<Schedule>({
        date: new Date(),
        medicationId: 0,
        alarm: false        
    })
    const { addMedication } = useMedicationStore()
    const setFieldMedication = (field: keyof MedicationType, value: any) => {
        setMedication(state => ({ ...state, [field]: value }))
    }
    const setFieldSchedule = (field: keyof Schedule, value: any) => {
        setMedication(state => ({ ...state, [field]: value }))
    }
    const add = () => {
        const validator = new Validator(medication, {
            apresentation: 'required',
            description: 'nullable',
            dose: 'required',
            name: 'required|min:3',
            qtde: 'required|numeric|min:0 '
        })
        if (validator.fails()) {
            for (const [key, value] of Object.entries(validator.errors.all())) {
                ToastAndroid.show(`${key}: ${value}`, ToastAndroid.SHORT)
            }
            return;
        }
        addMedication(medication)
            .then(() => {
                ToastAndroid.show('Cadastrado', ToastAndroid.SHORT)
                router.replace('/(tabs)/programados')
            })
    }
    const cities = [
        { label: 'Capsula', value: 'Capsula' },
        { label: 'Comprimido', value: 'Comprimido' },
        { label: 'Solvente', value: 'Solvente' },
    ];

    return (<SafeAreaView style={{ flex: 1, paddingHorizontal: 20, paddingVertical: 15 }}>
        <Text style={{ fontSize: 18, letterSpacing: 1.5, textAlign: 'center', marginBottom: 10 }}>Preencha os campos e clique no botão Salvar para adicioná-lo!</Text>
        <TextInput value={medication.name} onChangeText={e => setFieldMedication('name', e)} label="Nome*" mode="outlined" style={{ marginBottom: 10 }} />
        <Select
            label="Apresentação*"
            options={cities}
            value={medication.apresentation}
            onSelect={(option) => setFieldMedication('apresentation', option.value as string)}
            placeholder="Escolha uma opção"
        />
        <TextInput label="Dose*" value={medication.dose} onChangeText={text => setFieldMedication('dose', text)} mode="outlined" style={{ marginBottom: 10 }} />
        <TextInput label="Quantidade*" value={medication.qtde.toString()} onChangeText={text => setFieldMedication('qtde', parseFloat(text))} mode="outlined" style={{ marginBottom: 10 }} />
        <Button mode="outlined" onPress={add}>
            <Text>Enviar</Text>
        </Button>
    </ SafeAreaView >)
}