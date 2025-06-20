import Select from "@/components/ui/Select";
import { Schedule, useMedicationStore, WeekDay } from "@/store/MedicationStore";
import { useSnackbar } from "@/store/SnackbarContext";
import RNDateTimePicker from '@react-native-community/datetimepicker';
import { router, useLocalSearchParams } from "expo-router";
import moment from "moment";
import React, { useEffect, useMemo, useState } from "react";
import { SafeAreaView, ScrollView, ToastAndroid, View } from "react-native";
import { ActivityIndicator, Button, Switch, Text, TextInput } from "react-native-paper";

// Componente para a tela de edição
export default function EditScheduleScreen() {
    // 1. Obter o ID do agendamento a partir dos parâmetros da URL
    const { id } = useLocalSearchParams<{ id: string }>();
    const scheduleId = parseInt(id);

    const { medications, schedules, updateSchedule } = useMedicationStore();
    const { showSnackbar } = useSnackbar();

    const [isLoading, setIsLoading] = useState(false);
    const [picker, setPicker] = useState(false);
    const [pickerDate, setPickerDate] = useState(false);

    // Inicializa o estado do agendamento como nulo até ser carregado
    const [schedule, setSchedule] = useState<Schedule | null>(null);

    // 2. Efeito para carregar os dados do agendamento ao montar o componente
    useEffect(() => {
        const scheduleToEdit = schedules.find(s => s.id === scheduleId);

        if (scheduleToEdit) {
            // Garante que 'date' e 'hour' sejam objetos Date para os pickers
            setSchedule({
                ...scheduleToEdit,
                date: scheduleToEdit.date ? new Date(scheduleToEdit.date) : new Date(),
                hour: scheduleToEdit.hour ? new Date(  moment().format('YYYY-MM-DD ') + scheduleToEdit.hour).toISOString() : new Date().toISOString()
            });
        } else {
            showSnackbar("Agendamento não encontrado!");
            if (router.canGoBack()) {
                router.back();
            }
        }
    }, [scheduleId]); // Roda sempre que o ID ou a lista de agendamentos mudar

    const setFieldSchedule = (field: keyof Schedule, value: any) => {
        setSchedule(state => state ? { ...state, [field]: value } : null);
    };

    const toggleReminderType = () => {
        if (schedule) {
            setFieldSchedule('reminder_type', schedule.reminder_type === 'SCHEDULED' ? 'SINGLE' : 'SCHEDULED');
        }
    };

    // 3. Função para salvar as alterações
    const saveChanges = async () => {
        if (!schedule) return;

        try {
            setIsLoading(true);
            
            await updateSchedule(schedule.id, schedule); // Chama a função de update do store
            ToastAndroid.show('Agendamento atualizado!', ToastAndroid.SHORT);
            router.replace('/(tabs)/programados'); // Volta para a lista
        } catch (e: any) {
            if (e.code === 'RESPONSE_ERROR') {
                showSnackbar(e.body.message);
                console.log(e.body);
            } else {
                showSnackbar("Ocorreu um erro ao atualizar.");
                console.error(e.error);
            }
        } finally {
            setIsLoading(false);
        }
    };

    const weekDayOptions: { label: string, value: WeekDay }[] = useMemo(() => ([
        { value: 'MON', label: 'Segunda' },
        { value: 'TUE', label: 'Terça' },
        { value: 'WED', label: 'Quarta' },
        { value: 'THU', label: 'Quinta' },
        { value: 'FRI', label: 'Sexta' },
        { value: 'SAT', label: 'Sábado' },
        { value: 'SUN', label: 'Domingo' }
    ]), []);

    // Enquanto o agendamento não for carregado, exibe um indicador de atividade
    if (!schedule) {
        return (
            <SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator animating={true} size="large" />
            </SafeAreaView>
        );
    }

    const medicationForSchedule = medications.find(m => m.id === schedule.medication_id);

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <ScrollView contentContainerStyle={{ paddingHorizontal: 20, paddingVertical: 15 }}>
                <Text style={{ fontSize: 18, letterSpacing: 1.5, textAlign: 'center', marginBottom: 20 }}>
                    Editando Agendamento
                </Text>
                
                {/* Exibe o nome do medicamento (não editável aqui para simplicidade) */}
                <TextInput
                    label="Medicamento"
                    value={medicationForSchedule?.name || `ID: ${schedule.medication_id}`}
                    mode="outlined"
                    disabled={true}
                    style={{ marginBottom: 20 }}
                />

                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginVertical: 10 }}>
                    <Text>Apenas uma vez</Text>
                    <Switch value={schedule.reminder_type === 'SCHEDULED'} onValueChange={toggleReminderType} />
                    <Text>Agendado</Text>
                </View>

                <Button mode="contained" style={{ marginBottom: 10 }} onPress={() => setPicker(true)}>
                    Horário Selecionado: {moment(schedule.hour).format('HH:mm')}
                </Button>
                {picker && <RNDateTimePicker mode={"time"}
                    value={new Date(schedule.hour)}
                    onChange={(e, selectedDate) => {
                        setPicker(false);
                        if (selectedDate) {
                            setFieldSchedule('hour', selectedDate.toISOString());
                        }
                    }} />
                }

                {schedule.reminder_type === 'SCHEDULED' && (
                    <Select
                        label="Dia da semana"
                        options={weekDayOptions}
                        value={schedule.week_day}
                        onSelect={o => setFieldSchedule('week_day', o.value)}
                    />
                )}

                {schedule.reminder_type === 'SINGLE' && (
                    <>
                        <Button mode="contained" style={{ marginBottom: 10 }} onPress={() => setPickerDate(true)}>
                            Data: {moment(schedule.date).format('DD/MM/YYYY')}
                        </Button>
                        {pickerDate && schedule.date &&<RNDateTimePicker mode={"date"}
                            value={new Date(schedule.date)}
                            minimumDate={new Date()}
                            onChange={(e, selectedDate) => {
                                setPickerDate(false);
                                if (selectedDate) {
                                    setFieldSchedule('date', selectedDate.toISOString());
                                }
                            }} />
                        }
                    </>
                )}
                
                <TextInput
                    style={{ marginTop: 10, marginBottom: 10 }}
                    value={schedule.dose}
                    mode="outlined"
                    label={'Dose (ex: 1 comprimido, 10 gotas)'}
                    onChangeText={e => setFieldSchedule('dose', e)}
                />
                <TextInput
                    label={'Quantidade de doses'}
                    style={{ marginBottom: 20 }}
                    mode="outlined"
                    keyboardType="number-pad"
                    value={schedule.quantity.toString()}
                    onChangeText={e => setFieldSchedule('quantity', parseInt(e) || 1)}
                />

                {isLoading ? <ActivityIndicator size={'small'} />
                    : <Button mode="contained" onPress={saveChanges}>
                        <Text>Salvar Alterações</Text>
                    </Button>}
            </ScrollView>
        </SafeAreaView>
    );
}