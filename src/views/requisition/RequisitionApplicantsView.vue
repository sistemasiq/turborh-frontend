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
      <q-td>
        <q-img
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
          class="q-ml-lg"
          rounded
          icon="edit"
          style="background: rgb(47, 171, 171)"
          text-color="white"
          label="Añadir notas"
          @click.prevent="addNotes(row.applicationId)"
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
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRequisitionDetailsStore } from "src/stores/requisitionDetails";
import { useLocalStorageStore } from "src/stores/localStorage";
import { storeToRefs } from "pinia";
import { getAge } from "src/utils/operations";
import { getUserImagesPath, getUserDocumentsPath } from "src/utils/folderPaths";
import { getAxiosBaseUrl, getS3FileUrl } from "src/services/profiles.js";
import { useQuasar } from "quasar";
import { notifyNegative, notifyPositive } from "src/utils/notifies";
import { useRequestUser } from "src/stores/requestUser";
import { useNotesStore } from "src/stores/notes";
import Tooltip from "src/components/Tooltip.vue";
import axios from "axios";
import router from "src/router";

const $q = useQuasar();
const useRequisitionDetails = useRequisitionDetailsStore();
const useLocalStorage = useLocalStorageStore();
const useNotes = useNotesStore();
const useRequest = useRequestUser();
const filter = ref("");

const currentApplicants = ref([]);
const { numRequisitionDetails } = storeToRefs(useRequisitionDetails);

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

onMounted(() => {
  fetchApplicants();
});

const fetchApplicants = async () => {
  if (!numRequisitionDetails.value) return;

  try {
    loading.value = true;
    const request = await axios.get(
      `/candidatos/${numRequisitionDetails.value}`
    );

    if (request.status === 200) {
      currentApplicants.value = request.data;
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
    const request = await axios.get(
      `/download/${uuid}/path/${getUserDocumentsPath}`
    );
    if (request.status == 200) {
      console.log(request.data);
      $q.notify(notifyPositive(`Curriculum descargado exitosamente`));
    } else {
      $q.notify(notifyNegative("El curriculum solicitado no existe "));
    }
  } catch (e) {
    $q.notify(notifyNegative("Hubo un error al descargar el curriculum "));
  } finally {
    $q.loading.hide();
  }
};

const createReport = async (applicationId) => {
  try {
    $q.loading.show({ message: "Generando reporte..." });
    const request = await axios.get(
      `solicitud/reporte?id=${applicationId}&addNotes=${
        createReportWithNotes.value
      }&endpointURL=${getAxiosBaseUrl()}`,
      {
        responseType: "arraybuffer",
      }
    );

    if (request.status === 200) {
      const blob = new Blob([request.data], { type: "application/pdf" });
      reportSrc.value = URL.createObjectURL(blob);
      showReport.value = true;
    }
  } catch (error) {
    $q.notify(notifyNegative("Hubo un error al crear el reporte. Intenta de nuevo"))
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
    const request = await axios.get(`/solicitud/${applicationId}`);

    if (request.status === 200) {
      savedApplication.value = request.data;
      useLocalStorage.save("savedApplication", savedApplication.value);

      await fetchUserApplicationNotes(applicationId);

      router.push("/userHome/solicitud-1");
    }
  } catch (error) {
  } finally {
    $q.loading.hide();
  }
};

const fetchUserApplicationNotes = async (applicationId) => {
  try {
    const request = await axios.get(`/solicitud/notas/${applicationId}`);
    if (request.status === 200) {
      notesFrontPage.value = request.data.noteFrontPage;
      notesPersonalData.value = request.data.notePersonalData;
      notesPersonalDataTwo.value = request.data.notePersonalDataTwo;
      notesRecruitingMeans.value = request.data.noteRecruitingMeans;
      notesDocuments.value = request.data.noteDocuments;
      notesEducation.value = request.data.noteEducation;
      notesReferences.value = request.data.noteReferences;
      notesFamily.value = request.data.noteFamilyData;
      notesMachinery.value = request.data.noteMachinery;
      notesOffices.value = request.data.noteSkills;
      notesLaboralExperience.value = request.data.noteLaboralExperience;
    }
  } catch (error) {}
};

const columns = [
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
  },
  {
    name: "applicantAge",
    label: "Edad",
    required: true,
    align: "left",
    field: (row) => getAge(row.birthDate) + " años",
  },
  {
    name: "wishedSalary",
    label: "Salario deseado",
    required: true,
    align: "left",
    field: (row) => row.wishedSalary + " MXN",
  },
  {
    name: "jobName",
    label: "Puesto solicitado",
    required: true,
    align: "left",
    field: (row) => row.jobName,
  },
  {
    name: "dateCreated",
    label: "Fecha de solicitud",
    required: true,
    align: "left",
    field: (row) => row.dateCreated,
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
