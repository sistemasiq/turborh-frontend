<template>
  <q-table
    class="my-sticky-column-table"
    flat
    style="background: rgb(234, 237, 249)"
    bordered
    title="Historial de solicitudes"
    :columns="columns"
    :rows="filteredApplicants"
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
      <q-td>
        <q-img
          width="100px"
          height="100px"
          v-if="row.foto_uuid"
          :src="getS3FileUrl(getUserImagesPath, row.foto_uuid)"
          spinner-color="primary"
        />
        {{ row.nombre }}
        {{ row.apellido_paterno }}
        {{ row.apellido_materno }}
      </q-td>
    </template>

    <template v-slot:body-cell-psychTestSended="{ row }">
      <q-td>
        <q-btn
          v-if="row.test_psicometrico_estado === 'E'"
          rounded
          icon="visibility"
          label="Ver datos"
          @click.prevent="seePsychTestData(row)"
        />
      </q-td>
    </template>

    <template v-slot:body-cell-applicationHistory="{ row }">
      <q-td>
        <q-btn
          v-if="row.userApplicationHistory.length > 0"
          rounded
          icon="visibility"
          label="Ver postulaciones"
          @click.prevent="
            seeUserApplicationHistory(
              row.userApplicationHistory,
              row.nombre,
              row.apellido_paterno,
              row.apellido_materno
            )
          "
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
          @click.prevent="createReport(row.solicitud_id)"
        >
          <Tooltip :text="'Generar reporte en PDF'" />
        </q-btn>
        <q-btn
          class="q-ml-lg"
          rounded
          icon="mdi-file-download"
          label="Currículum"
          @click.prevent="downloadDocument(row.nombre_cv)"
        >
          <Tooltip :text="'Descargar currículum'" />
        </q-btn>

        <q-btn
          class="q-ma-lg text-black"
          rounded
          icon="link"
          label="Enviar test psicométrico"
          @click.prevent="setSelectedUser(row)"
        />

        <q-btn
          class="q-ml-lg"
          rounded
          icon="edit"
          style="background: rgb(47, 171, 171)"
          text-color="white"
          label="Añadir notas"
          @click.prevent="addNotes(row.solicitud_id)"
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
        height="95%"
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
    :selected-candidate="selectedUser"
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

  <q-dialog v-model="openUserApplicationHistoryDialog">
    <q-card class="col-12">
      <q-card-section>
        <div class="text-h6">Historial de postulaciones: {{ userName }}</div>
      </q-card-section>
      <q-separator />
      <q-card-section class="row justify-center items-center">
        <div
          v-if="userApplicationHistory.length < 1"
          class="text-center items-center q-pa-md"
        >
          <q-icon name="sentiment_dissatisfied" color="grey" size="4rem" />
          <div class="text-body1">Usuario sin postulaciones</div>
        </div>
        <div v-if="userApplicationHistory.length > 0" class="bg-yellow">
          <q-table
            flat
            bordered
            :rows="userApplicationHistory"
            :columns="applicationHistoryColumns"
            row-key="name"
            hide-bottom
            style="max-height: 300px"
            virtual-scroll
            v-model:pagination="pagination"
            class="my-sticky-virtscroll-table"
          />
        </div>
      </q-card-section>

      <q-separator />

      <q-card-actions align="right">
        <q-btn
          flat
          label="Cerrar"
          @click="resetUserApplicationHistory"
          class="text-white bg-red q-mr-sm"
          style="border-radius: 8px"
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
import { getAge } from "src/utils/operations";
import { getUserImagesPath, getUserDocumentsPath } from "src/utils/folderPaths";
import { getS3FileUrl } from "src/services/profiles.js";
import { useQuasar } from "quasar";
import { notifyNegative } from "src/utils/notifies";
import { useRequestUser } from "src/stores/requestUser";
import { useNotesStore } from "src/stores/notes";
import Tooltip from "src/components/Tooltip.vue";
import { createUserApplicationReport } from "src/services/report";
import router from "src/router";
import { useRoute } from "vue-router";
import { downloadFile } from "src/services/files";
import {
  getUserApplicationById,
  getUserApplicationNotesById,
  getAllUserApplications,
} from "src/services/userApplication";
import { getPsychometricPlatforms } from "src/services/user";
import UserApplicationHistoryFilter from "src/components/UserApplicationHistoryFilter.vue";
import { formatDate } from "src/utils/formatDates.js";
import { andOperation } from "src/utils/logicGatesOperations.js";
import {
  setSessionStorageItem,
  removeSessionStorageItem,
  getSessionStorageItem,
} from "src/stores/sessionStorage";


const route = useRoute();
const $q = useQuasar();
const useRequisitionDetails = useRequisitionDetailsStore();
const useLocalStorage = useLocalStorageStore();
const useNotes = useNotesStore();
const useRequest = useRequestUser();
const filter = ref("");
const pagination = ref({ rowsPerPage: 0 });

const currentApplicants = ref([]);
const { viewAllRequisitions, viewAllSelectedCandidates } = storeToRefs(
  useRequisitionDetails
);

const noDataLabel = ref("No hay solicitantes para este puesto...");
const loading = ref(false);

const { viewingApplication, savedApplication } = storeToRefs(useRequest);

const filters = ref({});

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
const openPsicometricTestDialog = ref(false);
const selectedPsychTestPlatform = ref("");
const userNameForPsychTests = ref("");
const passwordForPsychTest = ref("");
const psychTestPlatforms = ref([]);
const testLink = ref("");
const openSeeDataPsychTest = ref(false);
const candidatesPsychData = ref([]);

onMounted(() => {
  viewAllRequisitions.value = true;
  viewAllSelectedCandidates.value = false;
  setSessionStorageItem("viewAllRequisitions", viewAllRequisitions.value);
  setSessionStorageItem(
    "viewAllSelectedCandidates",
    viewAllSelectedCandidates.value
  );
  fetchApplicants();
  getPsychometricPlatformsData();
});


onBeforeUnmount(() => {
  if(route.path === "/home/historial-requisiciones"){
    removeSessionStorageItem("filters");
  }
})

const getPsychometricPlatformsData = async () => {
  try {
    const request = await getPsychometricPlatforms();
    if (request) {
      psychTestPlatforms.value = request;
    }
  } catch (error) {}
};

const gendersParsed = {
  F: "Femenino",
  M: "Masculino",
  O: "Otro",
};

const applyFilters = (newFilters) => {
  filters.value = newFilters;
  setSessionStorageItem("filters", filters.value);
};

const filteredApplicants = computed(() => {
  return currentApplicants.value.filter((applicant) => {
    // Gender filter
    if (filters.value.gender && applicant.sexo !== filters.value.gender) {
      return false;
    }

    // Age filter
    if (filters.value.ageRange) {
      const age = getAge(applicant.fecha_nacimiento); // Implement this function
      if (
        age < filters.value.ageRange.min ||
        age > filters.value.ageRange.max
      ) {
        return false;
      }
    }

    // Salary filter
    if (filters.value.salaryRange) {
      const salary = Number(applicant.sueldo_deseado);
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
      applicant.estado_civil !== filters.value.civilStatus
    ) {
      return false;
    }

    // License types filter
    if (filters.value.licenceTypes && filters.value.licenceTypes.length > 0) {
      const applicantLicenceTypes = applicant.licencias_manejo.map(
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

    // Scholarity filter
    if (filters.value.scholarity && filters.value.scholarity.length > 0) {
      // Map scholarity conditions with validation logic

      const scholarityConditions = filters.value.scholarity.map(
        (scholarity) => {
          switch (scholarity) {
            case "Secundaria":
              return {
                name: "Secundaria",
                validation: applicant.secundaria.length > 0,
              };
            case "Bachillerato sin certificado":
              // Check if bachillerato exists and has no certificate
              return {
                name: "Bachillerato sin certificado",
                validation:
                  applicant.bachillerato.length > 0 &&
                  applicant.bachillerato_certificado === 0,
              };
            case "Bachillerato con certificado":
              // Check if bachillerato exists and has a certificate

              return {
                name: "Bachillerato con certificado",
                validation:
                  applicant.bachillerato.length > 0 &&
                  applicant.bachillerato_certificado === 1,
              };
            case "Profesional":
              return {
                name: "Profesional",
                validation: applicant.profesional.length > 0,
              };
            case "Maestria":
              return {
                name: "Maestria",
                validation: applicant.maestria.length > 0,
              };
            case "Otro":
              return { name: "Otro", validation: applicant.otro.length > 0 };
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
            condition.validation = applicant.bachillerato.length > 0;
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
      const applicantMachineryUse = applicant.manejo_maquinas_herramientas.map(
        (machinery) => machinery.name
      );
      const applicantToolUse = applicant.manejo_maquinas_herramientas.map(
        (machinery) => machinery.toolName
      );
      const applicantMeasuringInstrumentsUse =
        applicant.manejo_maquinas_herramientas.map(
          (machinery) => machinery.measuringInstrumentName
        );
      const applicantOthersUse = applicant.manejo_maquinas_herramientas.map(
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
      const applicantSkills = applicant.conocimientos_oficios.map(
        (skill) => skill.name
      );

      if (
        !filters.value.skills.every((skill) => applicantSkills.includes(skill))
      ) {
        return false;
      }
    }

    return true;
  });
});

const setSelectedUser = (row) => {
  selectedUser.value = row;
  console.log(selectedUser.value);
  openPsicometricTestDialog.value = true;
};

const resetPsychTestInformation = () => {
  selectedPsychTestPlatform.value = "";
  userNameForPsychTests.value = "";
  passwordForPsychTest.value = "";
  testLink.value = "";
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

const seePsychTestData = (row) => {
  selectedUser.value = row;
  console.log(row);
  candidatesPsychData.value = row.candidatePsychData;
  openSeeDataPsychTest.value = true;
  userNameForPsychTests.value = row.test_psicometrico_nombre_usuario;
  passwordForPsychTest.value = row.test_psicometrico_password;
  setSelectedPsychPlatform(row.test_psicometrico_id);
};

const updateRow = (row) => {
  currentApplicants.value.forEach((element) => {
    if (element.solicitud_id === row.solicitud_id) {
      element = row;
    }
  });
};

const setSelectedPsychPlatform = (id) => {
  psychTestPlatforms.value.forEach((element) => {
    if (element.id === id) {
      selectedPsychTestPlatform.value = element.psychPlatformName;
    }
  });
};

const fetchApplicants = async () => {
  try {
    loading.value = true;
    const totalApplicants = await getAllUserApplications();

    if (totalApplicants) {
      currentApplicants.value = totalApplicants;
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

const userApplicationHistory = ref([]);
const openUserApplicationHistoryDialog = ref(false);
const userName = ref("");

const seeUserApplicationHistory = (
  applicationHistory,
  name,
  fatherLastName,
  motherLastName
) => {
  userApplicationHistory.value = applicationHistory;
  userName.value = name + " " + fatherLastName + " " + motherLastName;

  openUserApplicationHistoryDialog.value = true;
};

const resetUserApplicationHistory = () => {
  console.log("before", userApplicationHistory.value);
  userApplicationHistory.value = "";
  userName.value = "";
  openUserApplicationHistoryDialog.value = false;
  console.log("after", userApplicationHistory.value);
};

const columns = [
  {
    name: "applicantName",
    label: "Nombre del solicitante",
    required: true,
    field: (row) =>
      row.nombre + " " + row.apellido_paterno + " " + row.apellido_materno,
    align: "left",
  },
  {
    name: "applicantGender",
    label: "Sexo",
    required: true,
    align: "left",
    field: (row) => gendersParsed[row.sexo],
  },
  {
    name: "applicantAge",
    label: "Edad",
    required: true,
    align: "left",
    field: (row) => getAge(row.fecha_nacimiento) + " años",
  },
  {
    name: "phoneNumber",
    label: "Telefono",
    required: true,
    align: "left",
    field: (row) => row.telefono,
    sortable: true,
  },
  {
    name: "wishedSalary",
    label: "Salario deseado",
    required: true,
    align: "left",
    field: (row) => row.sueldo_deseado + " MXN",
  },
  {
    name: "dateCreated",
    label: "Fecha de creación",
    required: true,
    align: "left",
    field: (row) => row.creado,
    sortable: true,
  },

  {
    name: "psychTestSended",
    label: "Test psicometríco",
    required: true,
    align: "left",
    field: (row) => (row.test_psicometrico_estado === "E" ? "Enviado" : ""),
    sortable: true,
  },

  {
    name: "applicationHistory",
    label: "Historial de postulaciones",
    required: true,
    align: "left",
    field: (row) => row,
  },

  {
    name: "options",
    label: "Opciones",
    required: true,
    align: "center",
    field: "options",
  },
];

const applicationHistoryColumns = [
  {
    name: "requisitionNumber",
    required: true,
    label: "Folio de requisición",
    align: "center",
    field: (row) => row.requisitionId,
    sortable: true,
  },
  {
    name: "jobName",
    required: true,
    label: "Puesto",
    align: "left",
    field: (row) => row.jobName,
  },
  {
    name: "applicationDate",
    required: true,
    label: "Fecha de postulación",
    align: "center",
    field: (row) => formatDate(row.applicationDate),
    sortable: true,
  },
  {
    name: "applicationStatus",
    required: true,
    label: "Estado de postulación",
    align: "center",
    field: (row) => andOperation(row.applicationStatus, row.requisitionStatus),
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

.my-sticky-virtscroll-table
    /* height or max-height is important */
    height: 410px

    .q-table__top,
    .q-table__bottom,
    thead tr:first-child th /* bg color is important for th; just specify one */
      background-color: #ffffff

    thead tr th
      position: sticky
      z-index: 1
    /* this will be the loading indicator */
    thead tr:last-child th
      /* height of all previous header rows */
      top: 48px
    thead tr:first-child th
      top: 0

    /* prevent scrolling behind sticky top row on focus */
    tbody
      /* height of all previous header rows */
      scroll-margin-top: 48px
</style>
