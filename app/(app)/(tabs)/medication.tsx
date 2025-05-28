import MedicationList from '@/components/ui/MedicationList';
import { useSession } from '@/store/AuthenticationStore';
import { useMedicationStore } from '@/store/MedicationStore';
import Constants from 'expo-constants';
import { useEffect } from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';

export default function HomeScreen() {
  const { signOut } = useSession()
  const { getMedications, medications } = useMedicationStore()
  useEffect(() => {
    getMedications()
    .then(console.log)
  }, [])
  
  return (
    <SafeAreaView style={{ flex:1, paddingTop: Constants.statusBarHeight }}>

            <MedicationList medications={medications} />
        
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
});
