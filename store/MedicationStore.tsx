import { createContext, PropsWithChildren, useState } from "react";
export type MedicationType = {
    id?: number | string;
    name: string;
    description: string;
    apresentation: 'Capsula' | 'Comprimido' | 'Solvente';
    dose: string;
    qtde: number;
}
export type MedicationIdType = MedicationType['id'];
export type Schedule = {
    id?: number | string;
    date: Date | string;
    alarm?: boolean;
    medicationId: MedicationIdType
};
export type ScheduleIdType = Schedule['id'];
export type MedicationContextType = {
    medications: MedicationType[],
    schedules: Schedule[];
    addMedication(medication: MedicationType): Promise<void>;
    createSchedule(schedule: Schedule): Promise<void>;
    findMedication(id: MedicationIdType): Promise<MedicationType>
};
export const MedicationContext = createContext<MedicationContextType>({
    medications: [],
    schedules: [],
    addMedication: () => Promise.resolve(),
    createSchedule: (schedule: Schedule) => Promise.resolve(),
    findMedication: (id: MedicationIdType) => Promise.reject('not implemented')
});

export function MedicationProvider(props: PropsWithChildren) {
    const [medications, setMedication] = useState<MedicationType[]>([]);
    const [schedules, setSchedules] = useState<Schedule[]>([])
    
    const addMedication = async (medication: MedicationType) => {
        medication.id = Math.floor(Math.random() * 100_000)
        setMedication(state => [...state, medication])
        return Promise.resolve()
    }
    const createSchedule = async (schedule: Schedule) => {
        const m = await findMedication(schedule.medicationId)
        schedule.id = Math.floor(Math.random() * 100_000);
        setSchedules(state => [...state, schedule])
        return Promise.resolve()
    }
    const findMedication = async (id: MedicationIdType) => {
        const medication = medications.find(med => med.id == id);
        if (medication)
            return Promise.resolve(medication)
        return Promise.reject('Not Found')
    }
    return (
        <MedicationContext.Provider value={{ medications: medications, addMedication, createSchedule, findMedication, schedules }}>
            {props.children}
        </MedicationContext.Provider>
    )
}