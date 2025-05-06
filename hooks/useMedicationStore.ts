import { MedicationContext } from "@/store/MedicationStore";
import React from "react";

export const useMedicationStore = () => React.useContext(MedicationContext)