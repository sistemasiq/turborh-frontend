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
    jobStored
  };
});
