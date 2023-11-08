import { ref } from "vue";
import { defineStore } from "pinia";

export const useNotesStore = defineStore("notes", () => {
  const notesFrontPage = ref("");
  const notesPersonalData = ref("");
  const notesPersonalDataTwo = ref("");
  const notesDocuments = ref("");
  const notesRecruitingMeans = ref("");
  const notesReferences = ref("");
  const notesFamily = ref("");
  const notesEducation = ref("");
  const notesMachinery = ref("");
  const notesOffices = ref("");
  const notesLaboralExperience = ref(""); 

  return {
    notesFrontPage,
    notesPersonalData,
    notesPersonalDataTwo,
    notesDocuments,
    notesRecruitingMeans,
    notesReferences,
    notesFamily,
    notesEducation,
    notesMachinery,
    notesOffices,
    notesLaboralExperience,
  };
});
