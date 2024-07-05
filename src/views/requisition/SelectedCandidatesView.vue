<template>
  <q-table
    class="my-sticky-column-table"
    flat
    style="background: rgb(234, 237, 249)"
    bordered
    title="Candidatos seleccionados"
    :columns="columns"
    :rows="currentSelectedApplicants"
    :loading="loading"
    :filter="filter"
    row-key="name"
    separator="horizontal"
    rows-per-page-label="Puestos por página"
    loading-label="Cargando solicitudes..."
    no-results-label="No hay coincidencias con la busqueda..."
    :no-data-label="noDataLabel"
    :rows-per-page-options="[5, 10, 20, 30]"
  >
    <template v-slot:top-right>
      <q-card-actions horizontal align="center">
        <q-checkbox
          unchecked-icon="remove_circle_outline"
          checked-icon="check_circle"
          v-model="createReportWithNotes"
          label="Imprimir solicitudes con notas"
          size="lg"
          color="teal-5"
          class="q-mr-xl"
        />
        <q-input
          borderless
          dense
          debounce="300"
          v-model="filter"
          placeholder="Buscar"
          class="q-pl-sm q-pr-sm"
          style="
            background: rgb(255, 255, 255);
            border-radius: 5px;
            width: 250px;
            border-radius: 100px;
          "
        >
          <template v-slot:append>
            <q-icon name="search" />
          </template>
        </q-input>
      </q-card-actions>
    </template>

    <template v-slot:body-cell-applicantName="{ row }">
      <q-td>
        <q-img
          width="100px"
          height="100px"
          v-if="row.photoUUID"
          :src="getS3FileUrl(getUserImagesPath, row.photoUUID)"
          spinner-color="primary"
        />
        {{ row.name }}
        {{ row.firstLastName }}
        {{ row.secondLastName }}
      </q-td>
    </template>

    <template v-slot:body-cell-psychTestSended="{ row }">
      <q-td>
        <q-btn
          v-if="row.psychometricTestResults || row.userPsychPlatformID"
          rounded
          icon="visibility"
          label="Ver datos"
          @click.prevent="seePsychTestData(row)"
        />
      </q-td>
    </template>

    <template v-slot:body-cell-options="{ row }">
      <q-td>
        <q-btn
          class="q-ml-lg"
          rounded
          icon="description"
          label="Solicitud"
          @click.prevent="createReport(row.userApplicationID)"
        >
          <Tooltip :text="'Generar reporte en PDF'" />
        </q-btn>
        <q-btn
          class="q-ml-lg"
          rounded
          icon="mdi-file-download"
          label="Currículum"
          @click.prevent="downloadDocument(row.curriculum)"
        >
          <Tooltip :text="'Descargar currículum'" />
        </q-btn>

        <FileUploader
          :button-text="'Subir resultados'"
          :dialog-text="'Subir resultados de la prueba psicometrica'"
          :open-dialog="openFileUploader"
          :file-selector-label="'Seleccionar archivo'"
          @on-open-dialog="openFileUploaderDialog(row)"
          @on-close="closeFileUploaderDialog"
          @on-upload="uploadTestResults"
        />
        

        <q-btn
          class="q-ml-lg"
          rounded
          icon="edit"
          style="background: rgb(47, 171, 171)"
          text-color="white"
          label="Añadir notas"
          @click.prevent="addNotes(row.userApplicationID)"
        />
      </q-td>
    </template>
  </q-table>

  <q-dialog maximized v-model="showReport">
    <q-card class="no-scroll">
      <q-card-actions align="right">
        <q-btn flat label="Cerrar" color="red" v-close-popup />
      </q-card-actions>
      <object
        height="100%"
        width="100%"
        v-if="reportSrc.length > 0"
        :data="reportSrc"
        type="application/pdf"
      >
        <iframe :src="reportViewLink"></iframe>
      </object>
    </q-card>
  </q-dialog>

  <q-dialog maximized v-model="showResume">
    <q-card class="no-scroll">
      <q-card-actions align="right">
        <q-btn flat label="Cerrar" color="red" v-close-popup />
      </q-card-actions>
      <object
        height="100%"
        width="100%"
        v-if="resumeSrc.length > 0"
        :data="resumeSrc"
        type="application/pdf"
      >
        <iframe :src="resumeViewLink"></iframe>
      </object>
    </q-card>
  </q-dialog>

  <q-dialog v-model="openSeeDataPsychTest">
    <q-card>
      <q-card-section>
        <div class="text-h6">Datos del test psicometrico</div>
      </q-card-section>

      <q-separator />

      <q-card-section
        style="width: 550px; max-width: 90vw; max-height: 50vh"
        class="justify-between"
        horizontal
      >
        <q-card-section style="width: 50%">
          <q-input
            light
            outlined
            color="black"
            v-model="selectedPsychTestPlatform"
            label="Plataforma"
            label-color="black"
            readonly
            style="width: 100%"
          />
        </q-card-section>

        <q-card-section style="width: 50%">
          <q-input
            light
            outlined
            color="black"
            v-model="userNameForPsychTests"
            label="Nombre"
            label-color="black"
            readonly
            style="width: 100%"
            class="q-mb-md"
          />
          <q-input
            light
            outlined
            color="black"
            v-model="passwordForPsychTest"
            label="Contraseña"
            label-color="black"
            readonly=""
            style="width: 100%"
          />
        </q-card-section>
      </q-card-section>

      <q-separator />

      <q-card-actions class="justify-end q-pa-md">
        <q-btn
          v-if="selectedUser.prueba_psicometrica"
          icon="check"
          label="Ver resultados"
          v-close-popup
          class="q-mr-sm absolute-bottom-left q-mb-md q-ml-md"
          style="border-radius: 8px"
          @click.prevent="downloadDocument(selectedUser.prueba_psicometrica)"
        />
        <q-btn
          flat
          label="Cerrar"
          v-close-popup
          class="text-red-8 q-mr-sm"
          style="border-radius: 8px"
          @click.prevent="resetPsychTestInformation()"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRequisitionDetailsStore } from "src/stores/requisitionDetails";
import { useLocalStorageStore } from "src/stores/localStorage";
import { storeToRefs } from "pinia";
import { getUserImagesPath, getUserDocumentsPath } from "src/utils/folderPaths";
import { getS3FileUrl } from "src/services/profiles.js";
import { useQuasar } from "quasar";
import { notifyNegative } from "src/utils/notifies";
import { useRequestUser } from "src/stores/requestUser";
import { useNotesStore } from "src/stores/notes";
import Tooltip from "src/components/Tooltip.vue";
import { createUserApplicationReport } from "src/services/report";
import router from "src/router";
import { downloadFile, uploadFile } from "src/services/files";
import {
  getUserApplicationById,
  getUserApplicationNotesById,
} from "src/services/userApplication";
import { getPsychometricPlatforms } from "src/services/user";
import { getSelectedCandidates } from "src/services/candidates";
import FileUploader from "src/components/FileUploader.vue";

const $q = useQuasar();
const useRequisitionDetails = useRequisitionDetailsStore();
const useLocalStorage = useLocalStorageStore();
const useNotes = useNotesStore();
const useRequest = useRequestUser();
const filter = ref("");

const currentSelectedApplicants = ref([]);
const { viewAllRequisitions, viewAllSelectedCandidates } = storeToRefs(
  useRequisitionDetails
);

const noDataLabel = ref("No hay solicitantes para este puesto...");
const loading = ref(false);

const { viewingApplication, savedApplication } = storeToRefs(useRequest);

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

const reportSrc = ref("");
const reportViewLink = ref(reportSrc.value);
const showReport = ref(false);
const createReportWithNotes = ref(false);

const resumeSrc = ref("");
const resumeViewLink = ref(resumeSrc.value);
const showResume = ref(false);

const selectedUser = ref();
const selectedPsychTestPlatform = ref("");
const userNameForPsychTests = ref("");
const passwordForPsychTest = ref("");
const psychTestPlatforms = ref([]);
const testLink = ref("");
const openSeeDataPsychTest = ref(false);

const openFileUploader = ref(false);

onMounted(() => {
  viewAllRequisitions.value = false;
  viewAllSelectedCandidates.value = true;
  fetchSelectedApplicants();
  getPsychometricPlatformsData();
});

const uploadTestResults = async (file) => {
  try {
    $q.loading.show();

    let newFile;


    if (selectedUser.value.psychometricTestUUID) {
      newFile = await updateFile(
        selectedUser.value.psychometricTestUUID,
        file,
        getUserDocumentsPath
      );

      console.log("Tryiing to update file");
    } else {
      newFile = await uploadFile(
        file,
        getUserDocumentsPath
      );

      console.log("Trying to upload file");
    }

    if (newFile) {
      const updatedTest = await updateUserPsychometricTestByApplicationId(
        selectedUser.value.userApplicationID,
        newFile
      );

      if (updatedTest) {
        selectedUser.value.psychometricTestUUID = newFile;
        updateRow(selectedUser.value);
        $q.notify(
          notifyPositive(
            "Resultados de la prueba psicometrica subidos correctamente"
          )
        );
      }
    }
  } catch (error) {
    $q.notify(
      notifyNegative(
        "Hubo un error al subir los resultados de la prueba psicometrica"
      )
    );
  } finally {
    $q.loading.hide();
  }
};

const updateRow = (row) => {
  currentSelectedApplicants.value.forEach((element) => {
    if (element.userApplicationID === row.userApplicationID) {
      element = row;
    }
  });
};

const openFileUploaderDialog = (row) => {
  openFileUploader.value = true;
  selectedUser.value = row
  console.log(selectedUser.value);
};

const closeFileUploaderDialog = () => {
  openFileUploader.value = false;
};

const getPsychometricPlatformsData = async () => {
  try {
    const request = await getPsychometricPlatforms();
    if (request) {
      psychTestPlatforms.value = request;
    }
  } catch (error) {}
};

const resetPsychTestInformation = () => {
  selectedPsychTestPlatform.value = "";
  userNameForPsychTests.value = "";
  passwordForPsychTest.value = "";
  testLink.value = "";
};

const seePsychTestData = (row) => {
  selectedUser.value = row;
  openSeeDataPsychTest.value = true;
  userNameForPsychTests.value = row.userNameForPsychPlatform;
  passwordForPsychTest.value = row.userPasswordForPsychPlatform;
  setSelectedPsychPlatform(row.userPsychPlatformID);
};

const setSelectedPsychPlatform = (id) => {
  console.log(psychTestPlatforms.value);
  psychTestPlatforms.value.forEach((element) => {
    if (element.id === id) {
      selectedPsychTestPlatform.value = element.psychPlatformName;
    }
  });
};

const fetchSelectedApplicants = async () => {
  try {
    loading.value = true;
    const totalApplicants = await getSelectedCandidates();

    if (totalApplicants) {
      currentSelectedApplicants.value = totalApplicants;
    }
  } catch (error) {
    console.log(`Error fetching applicants ${error}`);
  } finally {
    loading.value = false;
  }
};

const downloadDocument = async (uuid) => {
  try {
    $q.loading.show();
    const fileDownloaded = await downloadFile(uuid, getUserDocumentsPath);
    if (fileDownloaded) {
      resumeSrc.value = fileDownloaded;
      showResume.value = true;
    } else {
      $q.notify(notifyNegative("El archivo solicitado no existe "));
    }
  } catch (error) {
    $q.notify(notifyNegative("Hubo un error al obtener el archivo "));
  } finally {
    $q.loading.hide();
  }
};

const createReport = async (applicationId) => {
  try {
    $q.loading.show({ message: "Generando reporte..." });

    const report = await createUserApplicationReport(
      applicationId,
      createReportWithNotes.value
    );

    if (report) {
      reportSrc.value = report;
      showReport.value = true;
    }
  } catch (error) {
    $q.notify(
      notifyNegative("Hubo un error al crear el reporte. Intenta de nuevo")
    );
    console.log(error);
  } finally {
    $q.loading.hide();
  }
};

const addNotes = (applicationId) => {
  fetchUserApplication(applicationId);
  viewingApplication.value = true;
};

const fetchUserApplication = async (applicationId) => {
  try {
    $q.loading.show();
    const userApplication = await getUserApplicationById(applicationId);

    if (userApplication) {
      savedApplication.value = userApplication;
      useLocalStorage.save("savedApplication", savedApplication.value);

      await fetchUserApplicationNotes(applicationId);
      useLocalStorage.save("addingNotesApplicationId", applicationId);
      useLocalStorage.save("viewingApplication", viewingApplication.value);
      router.push("/userHome/solicitud-1");
    }
  } catch (error) {
  } finally {
    $q.loading.hide();
  }
};

const fetchUserApplicationNotes = async (applicationId) => {
  try {
    const notes = await getUserApplicationNotesById(applicationId);
    if (notes) {
      notesFrontPage.value = notes.noteFrontPage;
      notesPersonalData.value = notes.notePersonalData;
      notesPersonalDataTwo.value = notes.notePersonalDataTwo;
      notesRecruitingMeans.value = notes.noteRecruitingMeans;
      notesDocuments.value = notes.noteDocuments;
      notesEducation.value = notes.noteEducation;
      notesReferences.value = notes.noteReferences;
      notesFamily.value = notes.noteFamilyData;
      notesMachinery.value = notes.noteMachinery;
      notesOffices.value = notes.noteSkills;
      notesLaboralExperience.value = notes.noteLaboralExperience;
    }
  } catch (error) {}
};

const columns = [
  {
    name: "applicantName",
    label: "Nombre del solicitante",
    required: true,
    field: (row) =>
      row.name + " " + row.firstLastName + " " + row.secondLastName,
    align: "left",
  },
  {
    name: "applicantRequisition",
    label: "Seleccionado en requisición",
    required: true,
    align: "left",
    field: (row) => row.numRequisition,
  },
  {
    name: "psychTestSended",
    label: "Test psicometríco",
    required: true,
    align: "left",
    field: (row) => (row.psychometricTestResults ? "Enviado" : ""),
    sortable: true,
  },
  {
    name: "options",
    label: "Opciones",
    required: true,
    align: "center",
    field: "options",
  },
];
</script>

<style scoped>
.rounded-borders {
  border-radius: 15px;
  background-color: #ffffff;
}

.button {
  width: 150px;
  height: 50px;
}

.button.details {
  background-color: #38638a;
  color: #ffffff;
}

.button.print {
  background-color: #7ee7e7;
  color: #38638a;
  width: 200px;
  margin-left: 15%;
}

.filter {
  height: 100%;
  margin-left: 25%;
  margin-top: 2%;
  width: 95%;
  padding-left: 10%;
  color: #ffffff;
}

.text-requests {
  font-size: 24px;
  background-color: #f1f6fc;
  border-radius: 100px;
  color: #fd999a;
  width: 50px;
  margin-left: 20%;
}

.history-item {
  margin: 1%;
  flex: 1;
}

.history-item p {
  font-size: 20px;
}
</style>

<style lang="sass">
.my-sticky-column-table

  thead tr:first-child th:first-child
    background-color: #EAEDF9

  td:first-child
    background-color: #EAEDF9

  th:first-child,
  td:first-child
    position: sticky
    left: 0
    z-index: 1
</style>
