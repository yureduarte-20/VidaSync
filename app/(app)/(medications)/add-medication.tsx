import Select, { SelectOption } from "@/components/ui/Select";
import { MedicationType, Presentation, Schedule, useMedicationStore, WeekDay } from "@/store/MedicationStore";
import { useSnackbar } from "@/store/SnackbarContext";
import RNDateTimePicker from '@react-native-community/datetimepicker';
import { router } from "expo-router";
import moment from "moment";
import React, { useMemo, useState } from "react";
import { SafeAreaView, ToastAndroid, View } from "react-native";
import { ActivityIndicator, Button, Switch, Text, TextInput } from "react-native-paper";

export default function AddMedication() {
    const { addMedication, medications, createSchedule } = useMedicationStore()
    const [isLoading, setIsLoading] = useState(false)
    const [medication, setMedication] = useState<MedicationType>({
        presentation: 'CAPSULE',
        name: '',

    })
    const [picker, setPicker] = useState(false)
    const [pickerDate, setPickerDate] = useState(false)
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
    const toggleMode = () => {
        setFieldSchedule('reminder_type', schedule.reminder_type === 'SCHEDULED' ? 'SINGLE' : 'SCHEDULED')
    }
    const setFieldMedication = (field: keyof MedicationType, value: any) => {
        setMedication(state => ({ ...state, [field]: value }))
    }
    const setFieldSchedule = (field: keyof Schedule, value: any) => {
        setSchedule(state => ({ ...state, [field]: value }))
    }
    const add = async () => {
        try {
            setIsLoading(true)
            if (modeMedication) {
                const { id } = await addMedication(medication)
                schedule.medication_id = id as number
            }
            await createSchedule(schedule)
            ToastAndroid.show('Cadastrado', ToastAndroid.SHORT)
            router.replace('/(app)/(tabs)/programados')
        } catch (e: any) {
            if (e.code == 'RESPONSE_ERROR') {
                showSnackbar(e.body.message)
                console.log(e.body)
            }
        } finally {
            setIsLoading(false)
        }

    }

    const options: { label: string, value: Presentation }[] = [
        { label: 'Capsula', value: 'CAPSULE' },
        { label: 'Comprimido', value: 'TABLET' },
        { label: 'Solvente', value: 'SOLVENT' },
    ];
    const weekDayOptions: { label: string, value: WeekDay }[] = useMemo(() => ([
        { value: 'MON', label: 'Segunda' },
        { value: 'TUE', label: 'Terça' },
        { value: 'WED', label: 'Quarta' },
        { value: 'THU', label: 'Quinta' },
        { value: 'FRI', label: 'Sexta' },
        { value: 'SAT', label: 'Sábado' },
        { value: 'SUN', label: 'Domingo' }
    ]), []);
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
                            options={medications.map((medication: MedicationType): SelectOption => ({ label: medication.name, value: medication.id! }))}
                            value={schedule.medication_id}
                            onSelect={(option) => setFieldSchedule('medication_id', option.value)}
                            placeholder="Escolha uma opção"
                        />
                    </>
                )
            }


            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Text>Apenas uma vez</Text>
                <Switch value={schedule.reminder_type == 'SCHEDULED'} onValueChange={toggleMode} />
                <Text>Agendado</Text>
            </View>
            <Button mode="contained" style={{ marginBottom: 10 }} onPress={() => setPicker(state => !state)}>
                Horário Selecionado: {moment(schedule.hour).format('HH:mm')}
            </Button>
            {picker && <RNDateTimePicker mode={"time"}
                onTouchCancel={() => setPicker(false)}
                value={new Date(schedule.hour)}
                onChange={(e) => {
                    const date = (new Date(e.nativeEvent.timestamp)).toISOString();
                    setFieldSchedule('hour', date)
                    setPicker(false)
                }} />
            }
            {
                schedule.reminder_type === 'SCHEDULED' && <>
                    <Select label="Dia da semana"
                        options={weekDayOptions}
                        value={schedule.week_day}
                        onSelect={o => setFieldSchedule('week_day', o.value)}
                    />

                </>
            }

            {
                schedule.reminder_type === 'SINGLE' && <>
                    <Button mode="contained" style={{ marginBottom: 10 }} onPress={() => setPickerDate(state => !state)}>
                        Data:  {moment(schedule.date).format('DD/MM/YYYY')}
                    </Button>
                    {pickerDate && <RNDateTimePicker mode={"date"}
                        onTouchCancel={() => setPickerDate(false)}
                        value={new Date(schedule.hour)}
                        minimumDate={new Date()}
                        onChange={(e) => {
                            const date = (new Date(e.nativeEvent.timestamp)).toISOString();
                            setFieldSchedule('date', date)
                            setPickerDate(false)
                        }} />
                    }
                </>
            }
            <TextInput style={{ marginBottom: 10 }} value={schedule.dose} mode="outlined" label={'Dose'} onChangeText={e => setFieldSchedule('dose', e)} />
            <TextInput label={'Quantidade'} style={{ marginBottom: 10 }} mode="outlined" keyboardType="number-pad" value={schedule.quantity.toString()} onChangeText={e => setFieldSchedule('quantity', e)} />
            {isLoading ? <ActivityIndicator size={'small'} />
                : <Button mode="outlined" onPress={add}>
                    <Text>Enviar</Text>
                </Button>}
        </ SafeAreaView >)
}