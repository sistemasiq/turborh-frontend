import { ref } from "vue";
import { defineStore } from "pinia";

export const useJobCatalogStore = defineStore("jobCatalog", () => {
  const jobId = ref(0);
  const jobActivated = ref();
  const jobName = ref("");
  const jobKey = ref("");
  const departmentId = ref();
  const departmentName = ref("");
  const departmentKey = ref("");

  const readOnly = ref(false);
  const updatingJob = ref(false);

  const $reset = () => {
    jobId.value = 0;
    jobName.value = "";
    readOnly.value = false;
    updatingJob.value = false;
  };

  return {
    jobId,
    jobActivated,
    jobName,
    jobKey,
    departmentId,
    departmentName,
    departmentKey,
    readOnly,
    updatingJob,
    $reset,
  };
});
