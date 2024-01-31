<template>
  <q-table
    class="q-pa-md"
    flat
    bordered
    style="background: rgb(234, 237, 249)"
    title="Solicitudes para el puesto"
    :columns="columns"
    :rows="currentApplicants"
    :loading="loading"
    :filter="filter"
    row-key="name"
    separator="horizontal"
    rows-per-page-label="Puestos por página"
    loading-label="Cargando solicitudes..."
    no-results-label="No hay coincidencias con la busqueda..."
    :no-data-label="noDataLabel"
    :rows-per-page-options="[10, 20, 30]"
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

    <template v-slot:body-cell-applicantPhoto="{ row }">
      <q-td :class="row.selected === 1 ? 'bg-green-3' : ''">
        <q-img
          width="100px"
          height="100px"
          v-if="row.photoUUID"
          :src="getS3FileUrl(getUserImagesPath, row.photoUUID)"
          spinner-color="primary"
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
          @click.prevent="createReport(row.applicationId)"
        >
          <Tooltip :text="'Generar reporte en PDF'" />
        </q-btn>
        <q-btn
          class="q-ml-lg"
          rounded
          icon="mdi-file-download"
          label="Currículum"
          @click.prevent="downloadDocument(row.curriculumUUID)"
        >
          <Tooltip :text="'Descargar currículum'" />
        </q-btn>

        <q-btn
          v-if="row.psychometricTest"
          class="q-ml-lg"
          rounded
          icon="mdi-file-download"
          label="Prueba psicometríca"
          @click.prevent="downloadDocument(row.psychometricTest)"
        >
          <Tooltip :text="'Descargar prueba psicometríca'" />
        </q-btn>

        <q-btn
          class="q-ml-lg"
          rounded
          icon="edit"
          style="background: rgb(47, 171, 171)"
          text-color="white"
          label="Añadir notas"
          @click.prevent="addNotes(row.applicationId)"
        />
        <q-btn
          v-if="row.selected === 0 && row.requisitionState === 'P'"
          class="q-ml-lg bg-green"
          rounded
          icon="done"
          text-color="white"
          label="Seleccionar"
          @click.prevent="setSelectedCandidate(row, true)"
        />
        <!-- Aqui esta la variable del backend que sirve como vmodel
        Si se encuentra una mejor manera, adelante -->
        <div class="row">
          <q-file
            style="max-width: 420px"
            rounded
            standout
            accept=".pdf, pdf/*"
            class="q-ml-lg q-mt-lg"
            bg-color="white"
            v-model="row.psychometricTestSelected"
            clearable
            label="Seleccionar prueba psicometríca"
          >
            <template v-slot:prepend
              ><q-icon color="dark" name="folder" />
            </template>
          </q-file>
          <q-btn
            v-if="row.psychometricTestSelected"
            rounded
            class="q-ma-sm"
            icon="upload"
            label="Subir prueba psicometríca"
            @click.prevent="uploadPsicometricTest(row)"
          >
          </q-btn>

          <q-btn
            class="q-ma-lg q-pa-md text-black"
            style="height: fit-content"
            rounded
            icon="link"
            label="Enviar test psicométrico"
            @click.prevent="setSelectedCandidate(row, false, true)"
          />
        </div>
      </q-td>
    </template>
  </q-table>

  <q-dialog v-model="openSelectCandidateDialog" persistent>
    <q-card rounded style="border-radius: 30px">
      <q-card-section class="row items-center">
        <span class="q-ml-sm text-h6 text-weight-regular">
          ¿Quieres seleccionar a este candidato?
        </span>
      </q-card-section>

      <q-card-actions align="center">
        <q-btn flat label="Cancelar" color="primary" v-close-popup />
        <q-btn
          rounded
          flat
          label="OK"
          v-close-popup
          class="text-white bg-green"
          @click.prevent="selectCandidateById()"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>

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

  <q-dialog v-model="openPsicometricTestDialog">
    <q-card>
      <q-card-section>
        <div class="text-h6">Enviar test psicometrico</div>
      </q-card-section>

      <q-separator />

      <q-card-section
        style="width: 550px; max-width: 90vw; max-height: 50vh"
        class="justify-between"
        horizontal
      >
        <q-card-section style="width: 50%">
          <q-btn-dropdown
            flat
            auto-close
            color="white"
            text-color="grey-9"
            :icon="
              selectedPsychTestPlatform === ''
                ? 'list'
                : selectedPsychTestPlatform === 'Grupo Arhca'
                ? 'group'
                : 'list'
            "
            :label="
              selectedPsychTestPlatform != ''
                ? selectedPsychTestPlatform
                : 'plataforma'
            "
            class="text-weight-regular"
            :dropdown-content-class="dropdownContentClass"
          >
            <q-list>
              <q-item
                v-for="(item, index) in psychTestPlatforms"
                :key="index"
                clickable
                v-close-popup
                @click.prevent="selectPsychPlatform(item)"
              >
                <q-item-section avatar>
                  <q-avatar
                    :icon="
                      item.psychPlatformName != 'Grupo Arhca'
                        ? 'list'
                        : 'Google Meet'
                    "
                    :color="
                      item.psychPlatformName === 'Grupo Arhca'
                        ? 'purple-4'
                        : 'grey-4'
                    "
                    text-color="white"
                  />
                </q-item-section>
                <q-item-section>
                  <q-item-label>{{ item.psychPlatformName }}</q-item-label>
                </q-item-section>
              </q-item>
            </q-list>
          </q-btn-dropdown>
        </q-card-section>

        <q-card-section style="width: 50%">
          <q-input
            light
            outlined
            color="black"
            v-model="userNameForPsychTests"
            label="Nombre"
            label-color="black"
            lazy-rules
            :rules="[(value) => !!value || 'Este campo no puede estar vacío.']"
            style="width: 100%"
          />
          <q-input
            light
            outlined
            color="black"
            v-model="passwordForPsychTest"
            label="Contraseña"
            label-color="black"
            lazy-rules
            :rules="[(value) => !!value || 'Este campo no puede estar vacío.']"
            style="width: 100%"
          />
        </q-card-section>
      </q-card-section>

      <q-separator />

      <q-card-actions class="justify-end q-pa-md">
        <q-btn
          flat
          label="Cancelar"
          v-close-popup
          class="text-red-8 q-mr-sm"
          style="border-radius: 8px"
          @click.prevent="resetPsychTestInformation()"
        />
        <q-btn
          flat
          icon="send"
          label="Enviar"
          class="text-white"
          :class="disableSendPsychTestButton ? 'bg-grey-5' : 'bg-green-13'"
          style="border-radius: 8px"
          @click.prevent="sendPsychTestInformation()"
          :disable="disableSendPsychTestButton"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import { useRequisitionDetailsStore } from "src/stores/requisitionDetails";
import { useLocalStorageStore } from "src/stores/localStorage";
import { storeToRefs } from "pinia";
import { getAge } from "src/utils/operations";
import { getUserImagesPath, getUserDocumentsPath } from "src/utils/folderPaths";
import { getS3FileUrl } from "src/services/profiles.js";
import { useQuasar } from "quasar";
import { notifyNegative, notifyPositive } from "src/utils/notifies";
import { useRequestUser } from "src/stores/requestUser";
import { useNotesStore } from "src/stores/notes";
import { useAuthStore } from "src/stores/auth";
import Tooltip from "src/components/Tooltip.vue";
import { createUserApplicationReport } from "src/services/report";
import {
  getCandidatesByRequisitionId,
  selectCandidate,
} from "src/services/candidates";
import router from "src/router";
import { downloadFile, updateFile, uploadFile } from "src/services/files";
import {
  getUserApplicationById,
  getUserApplicationNotesById,
} from "src/services/userApplication";
import {
  updateUserPsychometricTest,
  getPsychometricPlatforms,
} from "src/services/user";
import { completeRequisition } from "src/services/requisition";
import { sendPsychometricTestEmail } from "src/services/mail";
import { sendPsychTestMessage } from "src/services/whatsApp";
import { updatePsychTestCredentials } from "src/services/user";

const $q = useQuasar();
const useRequisitionDetails = useRequisitionDetailsStore();
const useLocalStorage = useLocalStorageStore();
const useNotes = useNotesStore();
const useAuth = useAuthStore();
const useRequest = useRequestUser();
const filter = ref("");

const openSelectCandidateDialog = ref(false);

const selectedCandidate = ref(0);

const currentApplicants = ref([]);
const { numRequisitionDetails, viewAllRequisitions, idRequisitionDetails } =
  storeToRefs(useRequisitionDetails);

const { user } = storeToRefs(useAuth);

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

const dropdownContentClass = "flexible-width";
const openPsicometricTestDialog = ref(false);
const userNameForPsychTests = ref("");
const passwordForPsychTest = ref("");
const selectedPsychTestPlatform = ref("");
const psychTestPlatformId = ref("");
const psychTestPlatforms = ref([]);


const sendPsychTestInformation = async () => {
  try {
    $q.loading.show();

    const updatedPsychCredentials = await updatePsychTestCredentials(
      userNameForPsychTests.value,
      passwordForPsychTest.value,
      psychTestPlatformId.value,
      selectedCandidate.value.userId
    );

    if (updatedPsychCredentials) {
      const sendedEmail = await sendPsychometricTestEmail(
        selectedCandidate.value.email,
        selectedCandidate.value.name,
        userNameForPsychTests.value,
        passwordForPsychTest.value
      );

      if (sendedEmail) {
        const sendedMessage = await sendPsychTestMessage(
          selectedCandidate.value.phoneNumber,
          selectedCandidate.value.name,
          userNameForPsychTests.value,
          passwordForPsychTest.value
        );
        if (sendedMessage) {
          $q.notify(notifyPositive("Enviada prueba psicométrica correctamente"));
        }
      }
    }
  } catch (error) {
    console.log(error);
  } finally {
    openPsicometricTestDialog.value = false;
    $q.loading.hide();
  }
};

const resetPsychTestInformation = () => {
  selectedPsychTestPlatform.value = "";
  userNameForPsychTests.value = "";
  passwordForPsychTest.value = "";
};

const disableSendPsychTestButton = computed(() => {
  return selectedPsychTestPlatform.value === "" ||
    userNameForPsychTests.value === "" ||
    passwordForPsychTest.value === ""
    ? true
    : false;
});

onMounted(() => {
  viewAllRequisitions.value = false;
  loadLocalStore();
  fetchApplicants();
  getPyschPlatformsData();
});

const loadLocalStore = () => {
  const numRequisitionStored = useLocalStorage.load("numRequisitionDetails");
  const idRequisitionStored = useLocalStorage.load("idRequisitionDetails");

  if (numRequisitionStored) {
    numRequisitionDetails.value = numRequisitionStored;
  }

  if (idRequisitionStored) {
    idRequisitionDetails.value = idRequisitionStored;
  }
};

const getPyschPlatformsData = async () => {
  try {
    const request = await getPsychometricPlatforms();
    if (request) {
      psychTestPlatforms.value = request;
      console.log("Psychometric platforms data", psychTestPlatforms.value);
    }
  } catch (error) {}
};

const selectPsychPlatform = (data) => {
  console.log("PLATFORM: " + data.id);
  selectedPsychTestPlatform.value = data.psychPlatformName;
  psychTestPlatformId.value = data.id;
};

const setSelectedCandidate = (
  row,
  openSelectDialog = false,
  openSendPsychTestDialog = false
) => {
  selectedCandidate.value = row;
  console.log(selectedCandidate.value);
  openSelectCandidateDialog.value = openSelectDialog;
  openPsicometricTestDialog.value = openSendPsychTestDialog;
};

const selectCandidateById = async () => {
  try {
    $q.loading.show();

    const candidateSelectedCorrectly = await selectCandidate(
      selectedCandidate.value.id
    );

    if (candidateSelectedCorrectly) {
      selectedCandidate.value.selected = 1;
      updateRow(selectedCandidate.value);
      const completed = await completeRequisition(numRequisitionDetails.value);
      console.log("Is requisition completed " + completed);
      if (completed) {
        $q.notify(
          notifyPositive("Se han llenado las vacantes para este puesto")
        );
      }
      console.log("CANDIDATE HAS BEEN SELECTED");
    }
  } catch (error) {
  } finally {
    $q.loading.hide();
  }
};

const gendersParsed = {
  F: "Femenino",
  M: "Masculino",
  O: "Otro",
};

const fetchApplicants = async () => {
  if (!idRequisitionDetails.value) return;

  try {
    loading.value = true;
    const candidates = await getCandidatesByRequisitionId(
      idRequisitionDetails.value
    );

    if (candidates) {
      currentApplicants.value = candidates;
      console.log(currentApplicants.value);
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

const uploadPsicometricTest = async (row) => {
  try {
    $q.loading.show();

    let newFile;

    if (row.psychometricTest) {
      newFile = await updateFile(
        row.psychometricTest,
        row.psychometricTestSelected,
        getUserDocumentsPath
      );
    } else {
      newFile = await uploadFile(
        row.psychometricTestSelected,
        getUserDocumentsPath
      );
    }

    if (newFile) {
      const updatedTest = await updateUserPsychometricTest(row.userId, newFile);

      if (updatedTest) {
        row.psychometricTest = newFile;
        updateRow(row);
        $q.notify(notifyPositive("Prueba psicometríca subida correctamente"));
      }
    }
  } catch (error) {
    $q.notify(notifyNegative("Hubo un error al subir la prueba psicometríca"));
  } finally {
    $q.loading.hide();
  }
};

const updateRow = (row) => {
  currentApplicants.value.forEach((element) => {
    if (element.userId === row.userId) {
      element = row;
    }
  });
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
  console.log("Add notes to application " + applicationId);

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
    name: "selected",
    label: "Seleccion",
    required: true,
    field: (row) => (row.selected === 1 ? "Candidato Seleccionado" : ""),
    align: "left",
    classes: (row) => (row.selected === 1 ? "bg-green-3" : ""),
  },
  {
    name: "applicantPhoto",
    label: "Foto",
    required: true,
    field: (row) => row.photoUUID,
    align: "left",
  },
  {
    name: "applicantName",
    label: "Nombre del solicitante",
    required: true,
    align: "left",
    field: (row) =>
      row.name + " " + row.firstLastName + " " + row.secondLastName,
    classes: (row) => (row.selected === 1 ? "bg-green-3" : ""),
  },
  {
    name: "applicantGender",
    label: "Sexo",
    required: true,
    align: "left",
    field: (row) => gendersParsed[row.gender],
    classes: (row) => (row.selected === 1 ? "bg-green-3" : ""),
  },
  {
    name: "applicantAge",
    label: "Edad",
    required: true,
    align: "left",
    field: (row) => getAge(row.birthDate) + " años",
    classes: (row) => (row.selected === 1 ? "bg-green-3" : ""),
  },
  {
    name: "wishedSalary",
    label: "Salario deseado",
    required: true,
    align: "left",
    field: (row) => row.wishedSalary + " MXN",
    classes: (row) => (row.selected === 1 ? "bg-green-3" : ""),
  },
  {
    name: "jobName",
    label: "Puesto solicitado",
    required: true,
    align: "left",
    field: (row) => row.jobName,
    classes: (row) => (row.selected === 1 ? "bg-green-3" : ""),
  },
  {
    name: "dateCreated",
    label: "Fecha de solicitud",
    required: true,
    align: "left",
    field: (row) => row.dateCreated,
    sortable: true,
    classes: (row) => (row.selected === 1 ? "bg-green-3" : ""),
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
