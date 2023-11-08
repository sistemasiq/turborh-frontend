import { ref } from "vue";
import { defineStore } from "pinia";

export const useJobStore = defineStore("job", () => {
  const jobId = ref();
  const jobFunctions = ref("");
  const jobSkills = ref("");
  const englishLevel = ref("");
  const educationRequired = ref("");
  const experience = ref("");
  const extraHours = ref(false);
  const travelAvailability = ref(false);

  const jobStored = ref();

  return {
    jobId,
    jobFunctions,
    jobSkills,
    englishLevel,
    educationRequired,
    experience,
    extraHours,
    travelAvailability,
    jobStored
  };
});
