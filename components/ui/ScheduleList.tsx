
import { Schedule, WeekDay } from '@/store/MedicationStore';
import React, { useCallback } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { Avatar, Divider, List, MD3Colors, Text } from 'react-native-paper';



interface ScheduleListProps {
    schedules: Schedule[];
    onSchedulePress?: (schedule: Schedule) => void;
    onScheduleEdit?: (schedule: Schedule) => void;
    onScheduleDelete?: (schedule: Schedule) => void;
}

const ScheduleList: React.FC<ScheduleListProps> = ({
    schedules,
    onSchedulePress,
    onScheduleEdit,
    onScheduleDelete
}) => {

    // Função para formatar o dia da semana
    const formatWeekDay = (weekDay?: WeekDay): string => {
        const weekDayMap: Record<WeekDay, string> = {
            MON: 'Segunda',
            TUE: 'Terça',
            WED: 'Quarta',
            THU: 'Quinta',
            FRI: 'Sexta',
            SAT: 'Sábado',
            SUN: 'Domingo'
        };
        return weekDay ? weekDayMap[weekDay] : '';
    };

    // Função para formatar a data
    const formatDate = (date?: string | Date): string => {
        if (!date) return '';
        const dateObj = typeof date === 'string' ? new Date(date) : date;
        return dateObj.toLocaleDateString('pt-BR');
    };

    // Função para obter o ícone baseado no tipo de lembrete
    const getReminderIcon = (reminderType: "SCHEDULED" | "SINGLE"): string => {
        return reminderType === 'SCHEDULED' ? 'calendar-sync' : 'calendar-edit';
    };

    // Função para obter a descrição do tipo de lembrete
    const getReminderDescription = (schedule: Schedule): string => {
        if (schedule.reminder_type === 'SCHEDULED') {
            return schedule.week_day ? formatWeekDay(schedule.week_day) : 'Agendado';
        } else {
            return schedule.date ? formatDate(schedule.date) : 'Dose única';
        }
    };

    const renderScheduleItem = useCallback(({ item }: { item: Schedule }) => (
        <List.Item
            title={item.medication?.name || `Medicamento ${item.medication_id}`}
            description={`${item.dose} • ${item.quantity} ${item.quantity === 1 ? 'dose' : 'doses'} • ${item.hour}`}
            left={(props) => (
                <Avatar.Icon
                    {...props}
                    color={MD3Colors.neutral70}
                    icon={getReminderIcon(item.reminder_type)}
                    size={48}
                />
            )}
            right={(props) => (
                <View style={styles.rightContainer}>
                    <Text variant="bodySmall" style={styles.scheduleType}>
                        {getReminderDescription(item)}
                    </Text>
                    {(onScheduleEdit || onScheduleDelete) && (
                        <List.Icon
                            {...props}
                            icon="dots-vertical"
                        />
                    )}
                </View>
            )}
            onPress={() => onSchedulePress?.(item)}
            style={styles.listItem}
        />
    ), []);

    const renderSeparator = () => <Divider />;

    const renderEmptyList = useCallback(() => (
        <View style={styles.emptyContainer}>
            <Text variant="bodyLarge" style={styles.emptyText}>
                Nenhum agendamento encontrado
            </Text>
        </View>
    ), []);

    return (
        <FlatList
            data={schedules}
            renderItem={renderScheduleItem}
            keyExtractor={(item) => item.id?.toString() || `${item.medication_id}-${item.hour}`}
            ItemSeparatorComponent={renderSeparator}
            ListEmptyComponent={renderEmptyList}
            style={styles.container}
            showsVerticalScrollIndicator={false}
        />
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    listItem: {
        paddingHorizontal: 16,
        paddingVertical: 8,
    },
    rightContainer: {
        alignItems: 'flex-end',
        justifyContent: 'center',
        paddingRight: 8,
    },
    scheduleType: {
        color: '#666',
        marginBottom: 4,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 40,
    },
    emptyText: {
        color: '#666',
    },
});

export default ScheduleList;