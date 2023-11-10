<template>
  <q-card
    v-on:vnode-unmounted="saveNote(currentRoute)"
    v-on:vnode-mounted="getNoteStoreContent(currentRoute)"
    flat
    bordered
    class="rounded-borders bg-white fit"
  >
    <q-card-section class="row items-center">
      <p class="text-h5">Agregar nota: {{ currentRoute }}</p>
      <q-btn
        icon="close"
        flat
        color="white"
        class="absolute-top-right bg-red-5"
        v-close-popup
      />
    </q-card-section>
    <q-card-section>
      <q-input
        class="text-body2"
        v-model="note"
        autogrow
        autofocus
        borderless
      />
    </q-card-section>
  </q-card>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useNotesStore } from "src/stores/notes";
import { storeToRefs } from "pinia";
import { useQuasar } from "quasar";
import { useRequestUser } from "src/stores/requestUser";
import { notifyNegative, notifyPositive } from "src/utils/notifies";
import axios from "axios";

const $q = useQuasar();
const useNotes = useNotesStore();
const useRequest = useRequestUser();

const props = defineProps(["closeNote", "currentRoute"]);
const note = ref("");
const previousNote = ref("");

onMounted(() => {
  previousNote.value = note.value;
});



const {
  notesFrontPage,
  notesPersonalData,
  notesPersonalDataTwo,
  notesRecruitingMeans,
  notesDocuments,
  notesReferences,
  notesFamily,
  notesEducation,
  notesMachinery,
  notesOffices,
  notesLaboralExperience,
} = storeToRefs(useNotes);

const { savedApplication } = storeToRefs(useRequest);

const noteStoreMapping = {
  Portada: notesFrontPage,
  "Datos Personales 1/2": notesPersonalData,
  "Datos Personales 2/2": notesPersonalDataTwo,
  Documentos: notesDocuments,
  "Medios de reclutamiento": notesRecruitingMeans,
  Referencias: notesReferences,
  "Datos familiares": notesFamily,
  Escolaridad: notesEducation,
  "Manejo de máquinas, herramientas y software": notesMachinery,
  Oficios: notesOffices,
  "Experiencia laboral": notesLaboralExperience,
};

const noteContentMapping = {
  Portada: notesFrontPage.value,
  "Datos Personales 1/2": notesPersonalData.value,
  "Datos Personales 2/2": notesPersonalDataTwo.value,
  Documentos: notesDocuments.value,
  "Medios de reclutamiento": notesRecruitingMeans.value,
  Referencias: notesReferences.value,
  "Datos familiares": notesFamily.value,
  Escolaridad: notesEducation.value,
  "Manejo de máquinas, herramientas y software": notesMachinery.value,
  Oficios: notesOffices.value,
  "Experiencia laboral": notesLaboralExperience.value,
};

const saveNote = async (currentRoute) => {
  const noteStore = noteStoreMapping[currentRoute];

  if (!noteStore) return;
  noteStore.value = note.value;
  
  if(note.value === previousNote.value)
  return;
  
  try {
    const notes = {
      applicationId: savedApplication.value.solicitud_id,
      noteFrontPage: notesFrontPage.value,
      notePersonalData: notesPersonalData.value,
      notePersonalDataTwo: notesPersonalDataTwo.value,
      noteRecruitingMeans: notesRecruitingMeans.value,
      noteDocuments: notesDocuments.value,
      noteEducation: notesEducation.value,
      noteReferences: notesReferences.value,
      noteFamilyData: notesFamily.value,
      noteMachinery: notesMachinery.value,
      noteSkills: notesOffices.value,
      noteLaboralExperience: notesLaboralExperience.value,
    };

    const request = await axios.put("/solicitud/notas", notes);

    if (request.status === 201) {
      $q.notify(notifyPositive("Nota guardada.", 600));
    }
  } catch (error) {
    $q.notify(
      notifyNegative("Hubo un error al guardar su nota, intente de nuevo.")
    );
  }
};

const getNoteStoreContent = (currentRoute) => {
  note.value = noteContentMapping[currentRoute] || "";
};
</script>

<style scoped>
.rounded-borders {
  border-radius: 15px;
}

.save-button {
  color: #ffffff;
}
</style>
