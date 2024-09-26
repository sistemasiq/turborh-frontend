import { ref } from "vue";
import { defineStore } from "pinia";

export const useJobStore = defineStore("job", () => {
  
  const jobData = ref();
  const jobId = ref();
  const jobFunctions = ref("");
  const jobSkills = ref("");
  const englishLevel = ref("");
  const educationRequired = ref("");
  const experience = ref("");
  const extraHours = ref(false);
  const travelAvailability = ref(false);

  const jobObservations = ref("");
  const jobConditions = ref("");
  const jobStored = ref();
  
    const $reset = () => {
      jobData.value = "";
      jobId.value = "";
      jobFunctions.value = "";
      jobSkills.value = "";
      englishLevel.value = "";
      educationRequired.value = "";
      experience.value = "";
      extraHours.value = false;
      travelAvailability.value = false;
    
      jobObservations.value = "";
      jobConditions.value = "";
      jobStored.value = "";
    }

  return {
    jobData,
    jobId,
    jobFunctions,
    jobSkills,
    englishLevel,
    educationRequired,
    experience,
    extraHours,
    travelAvailability,
    jobObservations,
    jobConditions,
    jobStored,
    $reset
  };
});
