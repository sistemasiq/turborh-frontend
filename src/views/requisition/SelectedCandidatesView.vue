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
    loading-label="Cargando candidatos seleccionados..."
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
          rounded
          v-if="row.psychTestStatus === 'E'"
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
          :candidate-psych-data="row.candidatePsychData"
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
        <div class="text-h6">Historial de evaluaciones psicométricas</div>
      </q-card-section>

      <q-separator />

      <q-card-section
        class="full-width"
        style="height: fit-content; max-height: fit-content"
      >
        <div
          v-for="(item, index) in candidatesPsychData"
          :key="index"
          class="full-width row justify-start items-center"
        >
          <q-input
            v-if="candidatesPsychData[index].psychPlatformName != null"
            light
            outlined
            color="black"
            v-model="candidatesPsychData[index].psychPlatformName"
            label="Plataforma"
            label-color="black"
            readonly
            class="q-pa-sm"
            style="width: 35%; max-width: 35%"
          />
          <q-input
            v-if="candidatesPsychData[index].psychPlatformLink != null"
            light
            outlined
            color="black"
            v-model="candidatesPsychData[index].psychPlatformLink"
            label="Link"
            label-color="black"
            readonly
            class="q-pa-sm"
            style="width: 35%; max-width: 35%"
          />
          <q-btn
            v-if="candidatesPsychData[index].requiredCredentials == '1'"
            dense
            icon="visibility"
            label="Ver Credenciales"
            color="white"
            class="text-black"
            style="height: fit-content; border-radius: 7px; width: 30%"
          >
            <q-tooltip class="bg-red-5 text-body1" :offset="[10, 10]">
              <div class="row">
                <strong>Usuario:</strong>
                <div>
                  {{ candidatesPsychData[index].psychPlatformUserName }}
                </div>
              </div>
              <div class="row">
                <strong>Contraseña:</strong>
                <div>
                  {{ candidatesPsychData[index].psychPlatformPassword }}
                </div>
              </div>
            </q-tooltip>
          </q-btn>
          <q-btn
            v-if="hasTestResultsOf(candidatesPsychData[index].psychPlatformId)"
            icon="check"
            label="Ver resultados"
            v-close-popup
            class="q-mr-sm q-mb-md q-ml-md"
            style="border-radius: 8px"
            @click.prevent="
              downloadDocument(
                getTestResultsFileUUID(
                  candidatesPsychData[index].psychPlatformId
                )
              )
            "
          />
        </div>
      </q-card-section>

      <q-separator />

      <q-card-actions class="justify-end q-pa-md">
        <q-btn
          flat
          label="Cerrar"
          v-close-popup
          class="text-white bg-red q-mr-sm"
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
import { notifyNegative, notifyPositive } from "src/utils/notifies";
import { useRequestUser } from "src/stores/requestUser";
import { useNotesStore } from "src/stores/notes";
import Tooltip from "src/components/Tooltip.vue";
import { createUserApplicationReport } from "src/services/report";
import router from "src/router";
import { downloadFile, uploadFile, updateFile } from "src/services/files";
import {
  getUserApplicationById,
  getUserApplicationNotesById,
} from "src/services/userApplication";
import {
  getPsychometricPlatforms,
  addNewTestResults,
  updateTestResults,
} from "src/services/user";
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

const noDataLabel = ref("No hay candidatos seleccionados...");
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

//Variables to store the data of one of the registered selected platform
const psychTestPlatforms = ref([]); //Saves the list of psych platforms available
const selectedPsychTestPlatform = ref("");
const psychTestPlatformId = ref(""); //TODO: I´m using this variable to see if a platform was selected insted of free link and also to save the id of the selected platform
const psychPlatformRequireCredentials = ref(false);

const candidatesPsychData = ref([]); //Stores the user psych data, To see the list of psych platfor tests sended to the user in the "historial de test psicometricos"
const userNameForPsychTests = ref(""); //stores the user name for the psych test
const passwordForPsychTest = ref(""); // stores the user password for the psych test

const openSeeDataPsychTest = ref(false);

const openFileUploader = ref(false);

onMounted(() => {
  viewAllRequisitions.value = false;
  viewAllSelectedCandidates.value = true;
  fetchSelectedApplicants();
  getPsychPlatformsData();
});

const uploadTestResults = async (file, platformId) => {
  try {
    $q.loading.show();

    let newFile;

    if (hasTestResultsOf(platformId)) {
      console.log("Trying to update file");
      newFile = await updateFile(
        getTestResultsFileUUID(platformId),
        file,
        getUserDocumentsPath
      );

      if (newFile) {
        const updatedTestResults = await updateTestResults(
          selectedUser.value.userId,
          platformId,
          newFile
        );

        if (updatedTestResults) {
          updateFileUUID(platformId, newFile);
          $q.notify(
            notifyPositive(
              "Resultados de la prueba psicometrica actualizados correctamente"
            )
          );
        }
      }

    } else if (!hasTestResultsOf(platformId)) {
      newFile = await uploadFile(file, getUserDocumentsPath);

      if (newFile) {
        const addedNewTestResults = await addNewTestResults(
          selectedUser.value.userId,
          platformId,
          newFile
        );

        if (addedNewTestResults) {
          updateFileUUID(platformId, newFile);
          $q.notify(
            notifyPositive(
              "Resultados de la prueba psicometrica subidos correctamente"
            )
          );
        }
      }
    }
  } catch (error) {
    console.log("ERROR al subir resultados " + error);
    $q.notify(
      notifyNegative(
        "Hubo un error al subir los resultados de la prueba psicometrica"
      )
    );
  } finally {
    $q.loading.hide();
  }
};

const hasTestResultsOf = (platformId) => {
  return selectedUser.value.testResults.some((element) => {
    return element.platformId === platformId;
  });
};

const getTestResultsFileUUID = (platformId) => {
  if (selectedUser.value.testResults === null) return null;

  const result = selectedUser.value.testResults.find(
    (element) => element.platformId === platformId
  );

  if (result) {
    return result.fileUUID;
  }

  return null;
};

const updateFileUUID = (platformId, newUUID) => {

  let foundMatch = false
  selectedUser.value.testResults.forEach((element) => {
    if (element.platformId === platformId) {
      element.fileUUID = newUUID;
      foundMatch = true;
    }
  });

  if(!foundMatch){
    selectedUser.value.testResults.push({
      userId: selectedUser.value.userId,
      platformId: platformId,
      fileUUID: newUUID,
    });
  }

  updateRow(selectedUser.value);
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
  selectedUser.value = row;
  console.log(selectedUser.value);
};

const closeFileUploaderDialog = () => {
  openFileUploader.value = false;
};

//Psychometric Platform handling begins
const getPsychPlatformsData = async () => {
  try {
    const request = await getPsychometricPlatforms();
    if (request) {
      psychTestPlatforms.value = request;
    }
  } catch (error) {}
};

//Psych tests history of the candidate
const seePsychTestData = (row) => {
  candidatesPsychData.value = row.candidatePsychData; //All the test that the candidate has received
  console.log("USER PSYCH HISTORY"); //TODO: CHECK THIS TO SEE THE HISTORY IN A RIGHT WAY
  console.log(row);
  selectedUser.value = row;
  openSeeDataPsychTest.value = true; //Open the dialog
  userNameForPsychTests.value = row.userNameForPsychPlatform; //To see the username for the test asigned to the candidate
  passwordForPsychTest.value = row.userPasswordForPsychPlatform; //To see the password for the test asigned to the candidate
  setSelectedPsychPlatform(row.psychPlatformID); //Set the id of the platform assigned to the candidate
};

//Reset the variables that retrieve the psych data needed
const resetPsychTestInformation = () => {
  selectedPsychTestPlatform.value = "";
  userNameForPsychTests.value = "";
  passwordForPsychTest.value = "";
  psychPlatformRequireCredentials.value = false;
  psychTestPlatformId.value = ""; //Saves the id of the selected platform
};

//TODO: CHECK THIS ONE
const setSelectedPsychPlatform = (id) => {
  psychTestPlatforms.value.forEach((element) => {
    if (element.id === id) {
      selectedPsychTestPlatform.value = element.psychPlatformName;
    }
  });
};

//TODO: END OF THE PSYCH FUNCTIONALITY

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
    console.log("TRYING TO DOWNLOAD " + uuid);
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
