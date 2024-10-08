<template>
  <q-table
    class="my-sticky-column-table"
    flat
    bordered
    style="background: rgb(234, 237, 249)"
    :title="'Solicitudes para el puesto: ' + tableJobName"
    :columns="columns"
    :rows="filteredApplicants"
    :loading="loading"
    :filter="filter"
    row-key="name"
    separator="horizontal"
    rows-per-page-label="Puestos por página"
    loading-label="Cargando candidatos..."
    no-results-label="No hay coincidencias con la busqueda..."
    :no-data-label="noDataLabel"
    :rows-per-page-options="[5, 10, 20, 30]"
  >
    <template v-slot:top-right>
      <UserApplicationHistoryFilter @filters-changed="applyFilters" />
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
      <q-td :class="row.selected === 1 ? 'bg-green-3' : ''">
        {{ getRowSelectedText(row) }}
        <q-img
          class="q-ml-xs"
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
          v-if="row.selected === 0 && row.requisitionState === 'P' && isRh"
          class="q-ml-lg bg-green"
          rounded
          icon="done"
          text-color="white"
          label="Seleccionar"
          @click.prevent="setSelectedCandidate(row, true)"
        />
        <!-- Aqui esta la variable del backend que sirve como vmodel
        Si se encuentra una mejor manera, adelante -->
        <q-card-section class="q-mt-md" horizontal>
          <q-btn
            class="text-black"
            rounded
            icon="link"
            label="Enviar test psicométrico"
            @click.prevent="setSelectedCandidate(row, false, true)"
          />
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
        </q-card-section>
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

  <PsychometricTestDialog
    :open="openPsicometricTestDialog"
    :selected-candidate="selectedCandidate"
    @update:open="openPsicometricTestDialog = $event"
    @update:selectedCandidate="updateRow"
  />

  <q-dialog v-model="openSeeDataPsychTest">
    <q-card style="width: 900px">
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
import { ref, onMounted, computed, onBeforeUnmount } from "vue";
import PsychometricTestDialog from "src/components/PsychometricTestDialog.vue";
import { useRequisitionDetailsStore } from "src/stores/requisitionDetails";
import { useLocalStorageStore } from "src/stores/localStorage";
import { storeToRefs } from "pinia";
import { getAge, gendersObject } from "src/utils/operations";
import { getUserImagesPath, getUserDocumentsPath } from "src/utils/folderPaths";
import { getS3FileUrl } from "src/services/profiles.js";
import { useQuasar } from "quasar";
import { notifyNegative, notifyPositive } from "src/utils/notifies";
import { useRequestUser } from "src/stores/requestUser";
import { useAuthStore } from "src/stores/auth";
import { useNotesStore } from "src/stores/notes";
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
import { updateTestResults, addNewTestResults } from "src/services/user";
import { completeRequisition } from "src/services/requisition";
import {
  sendCandidateNotSelectedEmail,
  sendCandidateSelectedEmail,
} from "src/services/mail";
import {
  sendUserNotSelectedMessage,
  sendUserSelectedMessage,
} from "src/services/whatsApp";
import FileUploader from "src/components/FileUploader.vue";
import UserApplicationHistoryFilter from "src/components/UserApplicationHistoryFilter.vue";
import {
  setSessionStorageItem,
  removeSessionStorageItem,
  getSessionStorageItem,
} from "src/stores/sessionStorage";
import { useRoute } from "vue-router";

const route = useRoute()
const $q = useQuasar();
const useRequisitionDetails = useRequisitionDetailsStore();
const useAuth = useAuthStore();
const useLocalStorage = useLocalStorageStore();
const useNotes = useNotesStore();
const useRequest = useRequestUser();
const filter = ref("");

const openSelectCandidateDialog = ref(false);

const selectedCandidate = ref(0);

const currentApplicants = ref([]);
const { numRequisitionDetails, viewAllRequisitions, idRequisitionDetails } =
  storeToRefs(useRequisitionDetails);

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

const { isRh } = storeToRefs(useAuth);

const reportSrc = ref("");
const reportViewLink = ref(reportSrc.value);
const showReport = ref(false);
const createReportWithNotes = ref(false);

const resumeSrc = ref("");
const resumeViewLink = ref(resumeSrc.value);
const showResume = ref(false);

const dropdownContentClass = "flexible-width";
const openPsicometricTestDialog = ref(false);

//Variables to store the data of one of the registered selected platform
const psychTestPlatforms = ref([]); //Saves the list of psych platforms available
const selectedPsychTestPlatform = ref("");
const psychTestPlatformId = ref(""); //TODO: I´m using this variable to see if a platform was selected insted of free link and also to save the id of the selected platform
const psychPlatformRequireCredentials = ref(false);

const candidatesPsychData = ref([]); //Stores the user psych data, To see the list of psych platfor tests sended to the user in the "historial de test psicometricos"
const userNameForPsychTests = ref(""); //stores the user name for the psych test
const passwordForPsychTest = ref(""); // stores the user password for the psych test

const tableJobName = ref("");
const openSeeDataPsychTest = ref(false);

const openFileUploader = ref(false);

const filters = ref({});

const applyFilters = (newFilters) => {
  filters.value = newFilters;
  setSessionStorageItem("filters", filters.value);
};

const filteredApplicants = computed(() => {
  return currentApplicants.value.filter((applicant) => {
    if (filters.value.gender && applicant.gender !== filters.value.gender) {
      return false;
    }

    // Age filter
    if (filters.value.ageRange) {
      const age = getAge(applicant.birthDate); // Implement this function
      if (
        age < filters.value.ageRange.min ||
        age > filters.value.ageRange.max
      ) {
        return false;
      }
    }

    // Salary filter
    if (filters.value.salaryRange) {
      const salary = Number(applicant.wishedSalary);
      if (
        salary < filters.value.salaryRange.min ||
        salary > filters.value.salaryRange.max
      ) {
        return false;
      }
    }

    // Civil status filter
    if (
      filters.value.civilStatus &&
      applicant.civilStatus !== filters.value.civilStatus
    ) {
      return false;
    }

    // License types filter
    if (filters.value.licenceTypes && filters.value.licenceTypes.length > 0) {
      const applicantLicenceTypes = applicant.driverLicenses.map(
        (lt) => lt.type
      );

      if (
        !filters.value.licenceTypes.every((lt) =>
          applicantLicenceTypes.includes(lt)
        )
      ) {
        return false;
      }
    }

    if (filters.value.scholarity && filters.value.scholarity.length > 0) {
      // Map scholarity conditions with validation logic

      const scholarityConditions = filters.value.scholarity.map(
        (scholarity) => {
          switch (scholarity) {
            case "Secundaria":
              return {
                name: "Secundaria",
                validation: applicant.edSecond.length > 0,
              };
            case "Bachillerato sin certificado":
              // Check if bachillerato exists and has no certificate
              return {
                name: "Bachillerato sin certificado",
                validation:
                  applicant.edBach.length > 0 &&
                  applicant.edBachCertified === 0
              };
            case "Bachillerato con certificado":
              // Check if bachillerato exists and has a certificate

              return {
                name: "Bachillerato con certificado",
                validation:
                  applicant.edBach.length > 0 &&
                  applicant.edBachCertified === 1
              };
            case "Profesional":
              return {
                name: "Profesional",
                validation: applicant.edProf.length > 0,
              };
            case "Maestria":
              return {
                name: "Maestria",
                validation: applicant.edMae.length > 0,
              };
            case "Otro":
              return { name: "Otro", validation: applicant.edOther.length > 0 };
            default:
              return { name: scholarity, validation: false }; // Default to false if unknown scholarity
          }
        }
      );

      // Count how many Bachillerato options are selected
      let edBachCounter = 0;
      filters.value.scholarity.forEach((item) => {
        if (
          item === "Bachillerato sin certificado" ||
          item === "Bachillerato con certificado"
        ) {
          edBachCounter++;
        }
      });

      // If both "Bachillerato con certificado" and "Bachillerato sin certificado" are selected
      if (edBachCounter === 2) {
        // Override validation for both Bachillerato options
        scholarityConditions.forEach((condition) => {
          const selectedBothEdBach =
            condition.name === "Bachillerato sin certificado" ||
            condition.name === "Bachillerato con certificado";

          if (selectedBothEdBach) {
            // Treat both as valid if edBach.length > 0
            condition.validation = applicant.edBach.length > 0;
          }
        });
      }

      // Check that ALL selected scholarity conditions are true (AND logic)
      if (!scholarityConditions.every((item) => item.validation)) {
        return false;
      }
    }

    // Machinery use filter
    if (filters.value.machineryUse && filters.value.machineryUse.length > 0) {
      const applicantMachineryUse = applicant.machinery.map(
        (machinery) => machinery.name
      );
      const applicantToolUse = applicant.machinery.map(
        (machinery) => machinery.toolName
      );
      const applicantMeasuringInstrumentsUse = applicant.machinery.map(
        (machinery) => machinery.measuringInstrumentName
      );
      const applicantOthersUse = applicant.machinery.map(
        (machinery) => machinery.otherToolName
      );

      const totalApplicantMachineryUse = applicantMachineryUse.concat(
        applicantToolUse,
        applicantMeasuringInstrumentsUse,
        applicantOthersUse
      );
      console.log(totalApplicantMachineryUse);

      if (
        !filters.value.machineryUse.every((machinery) =>
          totalApplicantMachineryUse.includes(machinery)
        )
      ) {
        return false;
      }
    }

    // Skills filter
    if (filters.value.skills && filters.value.skills.length > 0) {
      const applicantSkills = applicant.skills.map((skill) => skill.name);

      if (
        !filters.value.skills.every((skill) => applicantSkills.includes(skill))
      ) {
        return false;
      }
    }

    return true;
  });
});

onBeforeUnmount(() => {

if(route.path === "/home/historial-solicitudes" || route.path === "/home/historial-requisiciones"){
  removeSessionStorageItem("filters");
}
})

const openFileUploaderDialog = (row) => {
  openFileUploader.value = true;
  selectedCandidate.value = row;
  console.log(selectedCandidate.value);
};

const closeFileUploaderDialog = () => {
  openFileUploader.value = false;
};

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
          selectedCandidate.value.userId,
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
          selectedCandidate.value.userId,
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
  return selectedCandidate.value.testResults.some((element) => {
    return element.platformId === platformId;
  });
};

const getTestResultsFileUUID = (platformId) => {
  if (selectedCandidate.value.testResults === null) return null;

  const result = selectedCandidate.value.testResults.find(
    (element) => element.platformId === platformId
  );

  if (result) {
    return result.fileUUID;
  }

  return null;
};

const updateFileUUID = (platformId, newUUID) => {
  let foundMatch = false;
  selectedCandidate.value.testResults.forEach((element) => {
    if (element.platformId === platformId) {
      element.fileUUID = newUUID;
      foundMatch = true;
    }
  });

  if (!foundMatch) {
    selectedCandidate.value.testResults.push({
      userId: selectedCandidate.value.userId,
      platformId: platformId,
      fileUUID: newUUID,
    });
  }

  updateRow(selectedCandidate.value);
};

//-----------------------------------------------------------------------------------------------------

//Psych tests history of the candidate
const seePsychTestData = (row) => {
  selectedCandidate.value = row;
  candidatesPsychData.value = row.candidatePsychData; //All the test that the candididate has received

  console.log("ED BACH CERTIFIED " + selectedCandidate.value.edBachCertified);

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

const setSelectedPsychPlatform = (id) => {
  psychTestPlatforms.value.forEach((element) => {
    if (element.id === id) {
      selectedPsychTestPlatform.value = element.psychPlatformName;
    }
  });
};

//NOTE: Make this component -- end here
//TODO: END OF THE PSYCH FUNCTIONALITY

onMounted(() => {
  viewAllRequisitions.value = false;
  setSessionStorageItem("viewAllRequisitions", viewAllRequisitions.value);
  loadLocalStore();
  fetchApplicants();
});

const loadLocalStore = () => {
  const numRequisitionStored = useLocalStorage.load("numRequisitionDetails");
  const idRequisitionStored = Number(
    getSessionStorageItem("idRequisitionDetails")
  );

  if (numRequisitionStored) {
    numRequisitionDetails.value = numRequisitionStored;
  }

  if (idRequisitionStored) {
    idRequisitionDetails.value = idRequisitionStored;
  }
};

const setSelectedCandidate = (
  row,
  openSelectDialog = false,
  openSendPsychTestDialog = false
) => {
  selectedCandidate.value = row;
  openSelectCandidateDialog.value = openSelectDialog;
  openPsicometricTestDialog.value = openSendPsychTestDialog;
  resetPsychTestInformation();
};

const selectCandidateById = async () => {
  try {
    $q.loading.show();

    const candidateSelectedCorrectly = await selectCandidate(
      selectedCandidate.value.id
    );

    if (candidateSelectedCorrectly) {
      selectedCandidate.value.selected = 1;
      const completed = await completeRequisition(numRequisitionDetails.value);
      if (completed) {
        selectedCandidate.value.requisitionState = "PC";

        updateRow(selectedCandidate.value, true);
        const sendedEmails = await onCompleteSendEmailToCandidates();
        const sendedMessages = await onCompleteSendMessageToCandidates();

        if (sendedEmails && sendedMessages) {
          $q.notify(
            notifyPositive("Se han notificado a los demás candidatos", 3000)
          );
        }

        $q.notify(
          notifyPositive("Se han llenado las vacantes para este puesto", 3000)
        );
      }
    }
  } catch (error) {
  } finally {
    $q.loading.hide();
  }
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
      tableJobName.value = currentApplicants.value[0].jobName;
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

const updateRow = (row, requisitionHasBeenCompleted = false) => {
  currentApplicants.value.forEach((element) => {
    if (element.userId === row.userId) {
      element = row;
      console.log("ACTUALIZACIÓN DEL OBJETO");
      console.log(element);
    }
    if (requisitionHasBeenCompleted) {
      element.requisitionState = "PC";
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

const onCompleteSendEmailToCandidates = async () => {
  const promises = currentApplicants.value.map((candidate) => {
    if (candidate.selected === 0) {
      return sendCandidateNotSelectedEmail(
        candidate.email,
        candidate.name,
        candidate.jobName
      );
    }
    if (candidate.selected === 1) {
      return sendCandidateSelectedEmail(
        candidate.email,
        candidate.name,
        candidate.jobName
      );
    }
  });

  try {
    const results = await Promise.all(promises);

    const successCount = results.filter((result) => result).length;
    const failureCount = results.length - successCount;
    if (failureCount === 0) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.error("Error al mandar los emails:", error);
    $q.notify(notifyNegative("Error al notificar a los candidatos"));
    return false;
  }
};

const onCompleteSendMessageToCandidates = async () => {
  const promises = currentApplicants.value.map((candidate) => {
    if (candidate.selected === 0) {
      return sendUserNotSelectedMessage(
        candidate.phoneNumber,
        candidate.name,
        candidate.jobName
      );
    }
    console.log(currentApplicants.value);
    if (candidate.selected === 1) {
      return sendUserSelectedMessage(
        candidate.phoneNumber,
        candidate.name,
        candidate.jobName
      );
    }
  });

  try {
    const results = await Promise.all(promises);

    const successCount = results.filter((result) => result).length;
    const failureCount = results.length - successCount;
    if (failureCount === 0) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.error("Error al mandar los mensaje:", error);
    $q.notify(notifyNegative("Error al notificar a los candidatos"));
    return false;
  }
};

const getRowSelectedText = (row) => {
  if (row.selected === 1) {
    return "Candidato Seleccionado";
  }

  if (row.hasBeenSelected > 0 && row.hasBeenSelected !== row.id) {
    return (
      "Candidato seleccionado en la requisición con folio: " +
      row.hasBeenSelected
    );
  }

  return "";
};

const columns = [
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
    name: "userApplicationId",
    label: "ID",
    required: true,
    align: "left",
    field: (row) => row.userId,
    classes: (row) => (row.selected === 1 ? "bg-green-3" : ""),
  },

  {
    name: "applicantGender",
    label: "Sexo",
    required: true,
    align: "left",
    field: (row) => gendersObject[row.gender],
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
    name: "phoneNumber",
    label: "Telefono",
    required: true,
    align: "left",
    field: (row) => row.phoneNumber,
    sortable: true,
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
    name: "dateCreated",
    label: "Fecha de solicitud",
    required: true,
    align: "left",
    field: (row) => row.dateCreated,
    sortable: true,
    classes: (row) => (row.selected === 1 ? "bg-green-3" : ""),
  },
  {
    name: "psychTestSended",
    label: "Test psicometríco",
    required: true,
    align: "left",
    field: (row) => (row.psychTestStatus === "E" ? "Enviada" : ""),
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

  thead tr:first-child
  th:first-child

  td:first-child

  th:first-child,
  td:first-child
    position: sticky
    left: 0
    z-index: 1
</style>
