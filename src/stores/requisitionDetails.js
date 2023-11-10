import { ref } from "vue";
import { defineStore } from "pinia";


export const useRequisitionDetailsStore = defineStore("useRequisitionDetails", () => {
    const requisitionData = ref({})
    const showingDetails = ref(false)
    const numRequisitionDetails = ref(0);
    const applicantDetails = ref("");
    const jobDetails = ref("");
    const updatingRequisition = ref(false);

    return { requisitionData, numRequisitionDetails, applicantDetails, jobDetails, showingDetails, updatingRequisition};
})  