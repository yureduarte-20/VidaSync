import ScheduleList from "@/components/ui/ScheduleList";
import { useMedicationStore } from "@/store/MedicationStore";
import Constants from 'expo-constants';
import { router } from "expo-router";
import { useEffect } from "react";
import { SafeAreaView } from "react-native";
import { FAB } from 'react-native-paper';
export default function Programados() {
    const { schedules, getSchedulers }  = useMedicationStore()
    useEffect(() => {
        getSchedulers()
    },[])
    return (
        <SafeAreaView style={{ flex: 1, paddingTop: Constants.statusBarHeight }}>
            <ScheduleList schedules={schedules} />
            <FAB
                icon="plus"
                onPress={() => router.navigate('/(medications)/add-medication')}
                style={{
                    position: 'absolute',
                    margin: 16,
                    right: 0,
                    bottom: 0,
                }} />
        </SafeAreaView>
    )
}