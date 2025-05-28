import Select, { SelectOption } from "@/components/ui/Select";
import { MedicationType, Presentation, Schedule, useMedicationStore } from "@/store/MedicationStore";
import { useSnackbar } from "@/store/SnackbarContext";
import RNDateTimePicker from '@react-native-community/datetimepicker';
import { router } from "expo-router";
import moment from "moment";
import React, { useState } from "react";
import { SafeAreaView, ToastAndroid, View } from "react-native";
import { Button, Switch, Text, TextInput } from "react-native-paper";

export default function AddMedication() {
    const { addMedication, medications } = useMedicationStore()
    const [isLoading, setIsLoading] = useState(false)
    const [medication, setMedication] = useState<MedicationType>({
        presentation: 'CAPSULE',
        name: '',

    })
    const [picker, setPicker] = useState(false)
    const { showSnackbar } = useSnackbar()
    const [schedule, setSchedule] = useState<Schedule>({
        dose: '',
        medication_id: 0,
        quantity: 1,
        reminder_type: 'SINGLE',
        date: new Date(),
        hour: new Date().toISOString()
    })

    const [modeMedication, setModeMedication] = useState(medications.length <= 0)
    const setFieldMedication = (field: keyof MedicationType, value: any) => {
        setMedication(state => ({ ...state, [field]: value }))
    }
    const setFieldSchedule = (field: keyof Schedule, value: any) => {
        setSchedule(state => ({ ...state, [field]: value }))
    }
    const add = async () => {
        try {
            setIsLoading(true)
            await addMedication(medication)
            ToastAndroid.show('Cadastrado', ToastAndroid.SHORT)
            router.replace('/(app)/(tabs)/programados')
        } catch(e : any){
            console.log(e)
        }
        
    }

    const options: { label: string, value: Presentation }[] = [
        { label: 'Capsula', value: 'CAPSULE' },
        { label: 'Comprimido', value: 'TABLET' },
        { label: 'Solvente', value: 'SOLVENT' },
    ];
    const onToggleSwitch = () => setModeMedication(state => !state);
    return (
        <SafeAreaView style={{ flex: 1, paddingHorizontal: 20, paddingVertical: 15 }}>
            <Text style={{ fontSize: 18, letterSpacing: 1.5, textAlign: 'center', marginBottom: 10 }}>Preencha os campos e clique no botão Salvar para adicioná-lo!</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Switch value={modeMedication} onValueChange={onToggleSwitch} />
                <Text>Cadatrar Medicamento</Text>
            </View>

            {
                modeMedication && (
                    <>
                        <TextInput value={medication.name} onChangeText={e => setFieldMedication('name', e)} label="Nome*" mode="outlined" style={{ marginBottom: 10 }} />
                        <Select
                            label="Apresentação*"
                            options={options}
                            value={medication.presentation}
                            onSelect={(option) => setFieldMedication('presentation', option.value as string)}
                            placeholder="Escolha uma opção"
                        />
                    </>
                )
            }
            {
                !modeMedication && (
                    <>
                        <Select
                            label="Medicamento*"
                            options={medications.map((medication : MedicationType) : SelectOption => ({ label: medication.name, value: medication.id!  }))}
                            value={schedule.medication_id}
                            onSelect={(option) => setFieldSchedule('medication_id', option.value)}
                            placeholder="Escolha uma opção"
                        />
                    </>
                )
            }
            <Button mode="contained" style={{ marginBottom: 10 }} onPress={() => setPicker(state => !state)}>
                Horário Selecionado: {moment(schedule.hour).format('HH:mm')}
            </Button>
            {picker && <RNDateTimePicker mode="time"
                onTouchCancel={() => setPicker(false)}
                value={new Date(schedule.hour)}
                onChange={(e) => {
                    const hour = (new Date(e.nativeEvent.timestamp)).toISOString();
                    setFieldSchedule('hour', hour)
                    setPicker(false)
                }} />
            }
            <Button mode="outlined" onPress={add}>
                <Text>Enviar</Text>
            </Button>
        </ SafeAreaView >)
}