import { ref } from "vue";
import { defineStore } from "pinia";

export const useJobCatalogStore = defineStore("jobCatalog", () => {
  const jobId = ref();
  const jobActivated = ref();
  const jobName = ref("");
  const jobKey = ref("");
  const departmentId = ref();
  const departmentName = ref("");
  const departmentKey = ref("");

  const readOnly = ref(false);
  const updatingJob = ref(false);

  return {
    jobId,
    jobActivated,
    jobName,
    jobKey,
    departmentId,
    departmentName,
    departmentKey,
    readOnly,
    updatingJob
  };
});
