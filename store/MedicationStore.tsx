import { useFetcher } from "@/hooks/useFetcher";
import moment from "moment";
import React, { createContext, PropsWithChildren, useCallback, useEffect, useState } from "react";
import { useSession } from "./AuthenticationStore";
import { useSnackbar } from "./SnackbarContext";
export type MedicationType = {
    id?: number | string;
    name: string;
    presentation: 'TABLET' | 'SOLVENT' | 'CAPSULE';
    created_at?: string;
    updated_at?: string;
    reminders?: Schedule[]
}
export type Presentation = MedicationType['presentation']
export type WeekDay = 'MON' | "TUE" | "WED" | "THU" | "FRI" | "SAT"| "SUN";
export type MedicationIdType = MedicationType['id'];
export type Schedule = {
    id?: number
    dose: string,
    week_day?: WeekDay;
    quantity: number;
    hour: string,
    reminder_type: "SCHEDULED" | "SINGLE",
    date?: string | Date,
    medication_id: number;
    medication?: MedicationType
};

export type ScheduleIdType = Schedule['id'];
export type ReminderType = Schedule['reminder_type']
export type MedicationContextType = {
    medications: MedicationType[],
    schedules: Schedule[];
    addMedication(medication: MedicationType): Promise<MedicationType>;
    createSchedule(schedule: Schedule): Promise<Schedule>;
    findMedication(id: MedicationIdType): Promise<MedicationType>
    getMedications(): Promise<MedicationType[]>
    getSchedulers() : Promise<Schedule[]>
};
export const MedicationContext = createContext<MedicationContextType>({
    medications: [],
    schedules: [],
    addMedication: () => Promise.reject('not implemented'),
    createSchedule: (schedule: Schedule) => Promise.reject('not implemented'),
    findMedication: (id: MedicationIdType) => Promise.reject('not implemented'),
    getSchedulers: () => Promise.reject('not implemented'),
    getMedications: () => Promise.reject('not implemented')
});

export function MedicationProvider(props: PropsWithChildren) {
    const [medications, setMedication] = useState<MedicationType[]>([]);
    const [schedules, setSchedules] = useState<Schedule[]>([])
    const { showSnackbar } = useSnackbar()
    const fetcher = useCallback(useFetcher, [])
    const { session, isLoading, } = useSession()
    useEffect(() => {
        if (!isLoading && session) {
            getSchedulers()
            getMedications()
        }
    }, [session, isLoading])
    const getMedications = async () => {
        const { body } = await fetcher<MedicationType[]>({
            uri: '/medication?paginate=false', method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + session
            }
        })
        setMedication(body)
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
            await getMedications();
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
                uri: '/medication-reminder?paginate=false',
                method: 'GET',
                headers: {
                    'Authorization': 'Bearer ' + session
                }
            })
            setSchedules(body)
            return body
        } catch (e: any) {
            if (e.code == 'RESPONSE_ERROR') {
                showSnackbar(e.body.message)
            } else if (e.code == 'NETWORK_ERROR') {
                showSnackbar(e.message)
            }
            console.log(e)
            throw e;
        }
    }
    const createSchedule = async (schedule: Schedule) => {
        try {
            const contentBody = {
                ...schedule,
                hour: moment(schedule.hour).format('HH:mm'),
                date: moment(schedule.date).format('YYYY-MM-DD')
            }
            const { body } = await fetcher({
                uri: '/medication-reminder', method: 'POST', data: contentBody,
                headers: {
                    'Authorization': 'Bearer ' + session
                }
            })
            await getSchedulers()
            return body;
        } catch (e: any) {
            if (e.code == 'RESPONSE_ERROR') {
                showSnackbar(e.body.message)
            } else if (e.code == 'NETWORK_ERROR') {
                showSnackbar(e.message)
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
    return (
        <MedicationContext.Provider value={{ getSchedulers, medications: medications, addMedication, createSchedule, findMedication, schedules, getMedications }}>
            {props.children}
        </MedicationContext.Provider>
    )
}


export const useMedicationStore = () => React.use(MedicationContext)