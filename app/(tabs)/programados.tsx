import ScheduleList from "@/components/ui/ScheduleList";
import { Schedule, useMedicationStore } from "@/store/MedicationStore";
import { useSnackbar } from "@/store/SnackbarContext";
import Constants from 'expo-constants';
import { useRouter } from "expo-router";
import { useEffect } from "react";
import { SafeAreaView } from "react-native";
import { FAB } from 'react-native-paper';
export default function Programados() {
    const { schedules, getSchedulers, deleteSchedule  }  = useMedicationStore()
    const { showSnackbar } = useSnackbar()
    const router = useRouter()
    useEffect(() => {
        getSchedulers()
    },[]);
    const remove = async   (s:Schedule) =>  
    {
        await deleteSchedule(s.id)
        await getSchedulers()
        showSnackbar('Deletado com sucesso!')
    }
    return (
        <SafeAreaView style={{ flex: 1, paddingTop: Constants.statusBarHeight }}>
            <ScheduleList schedules={schedules} 
                onScheduleEdit={s =>  router.navigate({
                    pathname: '/edit-schedule/' + s.id
                })}
                onScheduleDelete={remove} />
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