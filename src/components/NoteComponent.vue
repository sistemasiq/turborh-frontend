<template>
  <q-card
    v-draggable
    v-on:vnode-unmounted="saveNote(currentRoute)"
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
      <div v-for="(item, index) in noteItems">
        <q-chat-message
          v-if="
            item.timestamp != '' &&
            item.content != 'null' &&
            item.content != null
          "
          :key="index"
          :name="item.name"
          :text="[item.content]"
          :stamp="item.timestamp"
          bg-color="cyan-1"
        />
      </div>

      <q-input
        class="text-body2"
        v-model="note"
        autogrow
        autofocus
        borderless
        filled
      />
    </q-card-section>
  </q-card>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import { useNotesStore } from "src/stores/notes";
import { storeToRefs } from "pinia";
import { useQuasar } from "quasar";
import { useRequestUser } from "src/stores/requestUser";
import { notifyNegative, notifyPositive } from "src/utils/notifies";
import { updateUserApplicationNotes } from "src/services/userApplication";
import { useAuthStore } from "src/stores/auth";

import { vDraggable } from "src/directives/draggable"; // Adjust the path if necessary

const $q = useQuasar();
const useNotes = useNotesStore();
const useRequest = useRequestUser();
const useAuth = useAuthStore();

const props = defineProps(["closeNote", "currentRoute"]);
const note = ref("");
const previousNote = ref("");


onMounted(() => {
  previousNote.value = note.value;
  note.value = note.value === "null" || note.value === null ? "" : note.value;
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

const { user } = storeToRefs(useAuth);

const { savedApplication } = storeToRefs(useRequest);

const noteStoreMapping = {
  "Presentacion Personal y Salario Deseado": notesFrontPage,
  "Datos Personales y Aspiraciones": notesPersonalData,
  "Informacion Medica y Situacion Socioeconomica": notesPersonalDataTwo,
  Documentos: notesDocuments,
  "Medios de reclutamiento": notesRecruitingMeans,
  "Datos familiares": notesFamily,
  "Información Escolar": notesEducation,
  "Maquinaria y herramientas": notesMachinery,
  Oficios: notesOffices,
  "Experiencia laboral": notesLaboralExperience,
  "Referencias familiares y comerciales": notesReferences,
};

const noteContentMapping = {
  "Presentacion Personal y Salario Deseado": notesFrontPage.value,
  "Datos Personales y Aspiraciones": notesPersonalData.value,
  "Informacion Medica y Situacion Socioeconomica": notesPersonalDataTwo.value,
  Documentos: notesDocuments.value,
  "Medios de reclutamiento": notesRecruitingMeans.value,
  "Datos familiares": notesFamily.value,
  "Información Escolar": notesEducation.value,
  "Maquinaria y herramientas": notesMachinery.value,
  Oficios: notesOffices.value,
  "Experiencia laboral": notesLaboralExperience.value,
  "Referencias familiares y comerciales": notesReferences.value,
};

const noteItems = computed(() => {
  const storedNote = noteContentMapping[props.currentRoute] || "";
  const noteItems = [];
  const noteSegments = storedNote.split(/\n(Nota hecha por: .*?\n)/);

  for (let i = 0; i < noteSegments.length; i++) {
    let contentSegmentIndex = i - 1;

    if (contentSegmentIndex < 0) {
      contentSegmentIndex = 0;
    }

    const authorSegment = noteSegments[i];
    const contentSegment = noteSegments[contentSegmentIndex];
    let newNoteItem = {
      name: "",
      timestamp: "",
      content: "",
    };

    console.log(" AUTHOR " + authorSegment);
    console.log(" CONTENT " + contentSegment);

    if (authorSegment.startsWith("Nota hecha por: ")) {
      const [, author] = authorSegment.split(": ");

      const [name, timestamp] = author.split(" el ");
      newNoteItem.name = name;
      newNoteItem.timestamp = timestamp;

      if (contentSegment != "" && contentSegment != "null") {
        newNoteItem.content = contentSegment;
      }
    }

    newNoteItem = checkNoteItem(newNoteItem);

    noteItems.push(newNoteItem);
  }
  console.log(noteItems);
  return noteItems;
});

const checkNoteItem = (noteItem) => {
  if (noteItem.name === "") {
    noteItem.name = user.value.userName;
  }
  if (noteItem.timestamp === "") {
    noteItem.timestamp = null;
  }

  if (noteItem.content === "") {
    noteItem.content = null;
  }

  return noteItem;
};

const saveNote = async (currentRoute) => {
  const noteStore = noteStoreMapping[currentRoute];

  if (!noteStore) return;

  if (note.value === previousNote.value) return;

  const currentDate = new Date().toLocaleString();
  const userName = user.value?.userName || "Unknown User";
  const updatedNote = `${note.value}\nNota hecha por: ${userName} el ${currentDate}\n`;

  if (noteStore.value === "") {
    noteStore.value = updatedNote;
  } else {
    noteStore.value += `${updatedNote}`;
  }

  console.log(noteStore.value);

  try {
    $q.loading.show();

    const notes = {
      applicationId: savedApplication.value.solicitud_id,
      noteFrontPage:
        notesFrontPage.value === "null" || notesFrontPage.value === null
          ? ""
          : notesFrontPage.value,
      notePersonalData:
        notesPersonalData.value === "null" || notesPersonalData.value === null
          ? ""
          : notesPersonalData.value,
      notePersonalDataTwo:
        notesPersonalDataTwo.value === "null" ||
        notesPersonalDataTwo.value === null
          ? ""
          : notesPersonalDataTwo.value,
      noteRecruitingMeans:
        notesRecruitingMeans.value === "null" ||
        notesRecruitingMeans.value === null
          ? ""
          : notesRecruitingMeans.value,
      noteDocuments:
        notesDocuments.value === "null" || notesDocuments.value === null
          ? ""
          : notesDocuments.value,
      noteEducation:
        notesEducation.value === "null" || notesEducation.value === null
          ? ""
          : notesEducation.value,
      noteReferences:
        notesReferences.value === "null" || notesReferences.value === null
          ? ""
          : notesReferences.value,
      noteFamilyData:
        notesFamily.value === "null" || notesFamily.value === null
          ? ""
          : notesFamily.value,
      noteMachinery:
        notesMachinery.value === "null" || notesMachinery.value === null
          ? ""
          : notesMachinery.value,
      noteSkills:
        notesOffices.value === "null" || notesOffices.value === null
          ? ""
          : notesOffices.value,
      noteLaboralExperience:
        notesLaboralExperience.value === "null" ||
        notesLaboralExperience.value === null
          ? ""
          : notesLaboralExperience.value,
    };

    const notesUpdated = await updateUserApplicationNotes(notes);

    if (notesUpdated) {
      $q.notify(notifyPositive("Nota guardada.", 600));
    }
  } catch (error) {
    $q.notify(
      notifyNegative("Hubo un error al guardar su nota, intente de nuevo.")
    );
  } finally {
    $q.loading.hide();
  }
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
