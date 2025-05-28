import { useSession } from "@/store/AuthenticationStore";
import { MedicationIdType, MedicationType, Schedule } from "@/store/MedicationStore";
import { useSnackbar } from "@/store/SnackbarContext";
import { useCallback } from "react";
import { useFetcher } from "./useFetcher";

export const useMedication = () => {
    const fetcher = useCallback(useFetcher, []);
    const { showSnackbar } = useSnackbar()
    const { session } = useSession()
    const getMedications = async () => {
        const { body } = await fetcher<MedicationType[]>({ uri: '/medication?paginated=false', method: 'GET' })
        return body;
    }
    const addMedication = async (medication: MedicationType) => {
        try {
            const { body } = await fetcher<MedicationType>({
                uri: '/medication', method: 'POST', data: medication,
                headers: {
                    'Authorization': 'Bearer ' + session
                }
            })
            return body;
        } catch (e: any) {
            if (e.code == 'RESPONSE_ERROR') {
                showSnackbar(e.body.message)
            } else if (e.code == 'NETWORK_ERROR') {
                showSnackbar(e.message)
            }
            throw e
        }
    }
    const getSchedulers = async () => {
        try {
            const { body } = await fetcher<Schedule[]>({
                uri: '/medication-reminder?paginated=false',
                method: 'GET',
                headers: {
                    'Authorization': 'Bearer ' + session
                }
            })
            return body
        } catch (e: any) {
            if (e.code == 'RESPONSE_ERROR') {
                showSnackbar(e.body.message)
            } else if (e.code == 'NETWORK_ERROR') {
                showSnackbar(e.message)
            }
            throw e;
        }
    }
    const createSchedule = async (schedule: Schedule) => {
        try {
            const { body } = await fetcher({
                uri: '/medication-reminder', method: 'POST', data: schedule,
                headers: {
                    'Authorization': 'Bearer ' + session
                }
            })
            return body;
        } catch (e: any) {
            if (e.code == 'RESPONSE_ERROR') {
                showSnackbar(e.body.message)
            } else if (e.code == 'NETWORK_ERROR') {
                showSnackbar(e.message ?? '')
            }
            throw e;
        }

    }
    const findMedication = async (id: MedicationIdType) => {
        const { body } = await fetcher<MedicationType>({
            uri: `/medication/${id}`, method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + session
            }
        })
        return body;
    }
    return {
        getMedications: () => getMedications()
    }
} 