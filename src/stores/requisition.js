import { ref } from "vue";
import { defineStore } from "pinia";

export const useRequisitionStore = defineStore("requisition", () => {
  const applicant = ref("");
  const applicantId = ref(0);
  const job = ref("Puesto solicitado");
  const vacancyNumbers = ref(1);
  const gender = ref("");
  const civilStatus = ref("");
  const ageRequired = ref(18);
  const motiveCreation = ref("");
  
   const clearStore = () => {
    applicant.value = "";
    applicantId.value = 0;
    job.value = "Puesto solicitado";
    vacancyNumbers.value = 0;
    gender.value = "";
    civilStatus.value = "";
    ageRequired.value = "";
    motiveCreation.value = "";
  }


  return {
    applicant,
    applicantId,
    job,
    gender,
    motiveCreation,
    vacancyNumbers,
    civilStatus,
    ageRequired,
    clearStore
  };
});
