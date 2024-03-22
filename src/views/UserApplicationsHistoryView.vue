<template>
  <q-table
    class="q-pa-md"
    flat
    bordered
    style="background: rgb(234, 237, 249)"
    title="Historial de solicitudes"
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
          width="100px"
          height="100px"
          v-if="row.foto_uuid"
          :src="getS3FileUrl(getUserImagesPath, row.foto_uuid)"
          spinner-color="primary"
        />
      </q-td>
    </template>

    <template v-slot:body-cell-psychTestSended="{ row }">
      <q-td>
        <q-btn
          rounded
          v-if="row.test_psicometrico_estado === 'E'"
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
          v-if="row.prueba_psicometrica"
          class="q-ml-lg"
          rounded
          icon="mdi-file-download"
          label="Prueba psicometríca"
          @click.prevent="downloadDocument(row.prueba_psicometrica)"
        >
          <Tooltip :text="'Descargar prueba psicometríca'" />
        </q-btn>
        <q-btn
          class="q-ma-lg q-pa-md text-black"
          style="height: fit-content"
          rounded
          icon="link"
          label="Enviar test psicométrico"
          @click.prevent="setSelectedUser(row, false, true)"
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
        <q-checkbox
          class="absolute-right q-mr-xl"
          v-model="sendLink"
          label="Enviar link"
          @update:model-value="resetPsychTestInformation()"
        />
      </q-card-section>

      <q-separator />

      <q-card-section
        v-if="!sendLink"
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

      <q-card-section
        v-if="sendLink"
        style="width: 550px; max-width: 90vw; max-height: 50vh"
        class="justify-between"
        horizontal
      >
        <q-card-section style="width: 100%">
          <q-input
            light
            outlined
            color="black"
            v-model="testLink"
            label="Link del formulario"
            label-color="black"
            lazy-rules
            :rules="[(value) => !!value || 'Este campo no puede estar vacío.']"
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
import Tooltip from "src/components/Tooltip.vue";
import { createUserApplicationReport } from "src/services/report";
import router from "src/router";
import { downloadFile } from "src/services/files";
import {
  getUserApplicationById,
  getUserApplicationNotesById,
  getAllUserApplications,
} from "src/services/userApplication";
import { sendPsychTestMessage, sendLinkMessage } from "src/services/whatsApp";
import { sendPsychometricTestEmail } from "src/services/mail";
import {
  updatePsychTestCredentials,
  getPsychometricPlatforms,
} from "src/services/user";

const $q = useQuasar();
const useRequisitionDetails = useRequisitionDetailsStore();
const useLocalStorage = useLocalStorageStore();
const useNotes = useNotesStore();
const useRequest = useRequestUser();
const filter = ref("");

const currentApplicants = ref([]);
const { viewAllRequisitions } = storeToRefs(useRequisitionDetails);

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
const openPsicometricTestDialog = ref(false);
const dropdownContentClass = "flexible-width";
const selectedPsychTestPlatform = ref("");
const userNameForPsychTests = ref("");
const passwordForPsychTest = ref("");
const psychTestPlatforms = ref([]);
const psychTestPlatformId = ref(0);
const sendLink = ref(false);
const testLink = ref(false);

const openSeeDataPsychTest = ref(false);

onMounted(() => {
  viewAllRequisitions.value = true;
  fetchApplicants();
  getPsychometricPlatformsData();
});

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

const selectPsychPlatform = (data) => {
  selectedPsychTestPlatform.value = data.psychPlatformName;
  psychTestPlatformId.value = data.id;
};

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

const disableSendPsychTestButton = computed(() => {
  if (sendLink.value) {
    return testLink.value === "" ? true : false;
  } else {
    return selectedPsychTestPlatform.value === "" ||
      userNameForPsychTests.value === "" ||
      passwordForPsychTest.value === ""
      ? true
      : false;
  }
});

const sendPsychTestInformation = async () => {
  if (sendLink.value) {
    await sendPsychTestLink();
  } else {
    await sendPsychTestCredentials();
  }
};

const sendPsychTestCredentials = async () => {
  try {
    $q.loading.show();

    const updatedPsychCredentials = await updatePsychTestCredentials(
      userNameForPsychTests.value,
      passwordForPsychTest.value,
      psychTestPlatformId.value,
      selectedUser.value.userId
    );

    if (updatedPsychCredentials) {
      selectedUser.value.test_psicometrico_id = psychTestPlatformId.value;
      selectedUser.value.test_psicometrico_nombre_usuario =
        userNameForPsychTests.value;
      selectedUser.value.test_psicometrico_password =
        passwordForPsychTest.value;
      selectedUser.value.test_psicometrico_estado = "E";

      updateRow(selectedUser.value);

      const sendedEmail = await sendPsychometricTestEmail(
        selectedUser.value.email,
        selectedUser.value.nombre,
        userNameForPsychTests.value,
        passwordForPsychTest.value
      );

      if (sendedEmail) {
        const sendedMessage = await sendPsychTestMessage(
          selectedUser.value.telefono,
          selectedUser.value.nombre,
          userNameForPsychTests.value,
          passwordForPsychTest.value
        );
        if (sendedMessage) {
          $q.notify(
            notifyPositive("Enviada prueba psicométrica correctamente")
          );
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

const sendPsychTestLink = async () => {
  try {
    $q.loading.show();

    const sendedMessage = await sendLinkMessage(
      selectedUser.value.telefono,
      selectedUser.value.nombre,
      testLink.value
    );
    if (sendedMessage) {
      $q.notify(notifyPositive("Enviado link correctamente"));
    }
  } catch (error) {
    console.log(error);
  } finally {
    openPsicometricTestDialog.value = false;
    $q.loading.hide();
  }
};

const seePsychTestData = (row) => {
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
    name: "applicantPhoto",
    label: "Foto",
    required: true,
    field: (row) => row.foto_uuid,
    align: "left",
  },
  {
    name: "applicantName",
    label: "Nombre del solicitante",
    required: true,
    align: "left",
    field: (row) =>
      row.nombre + " " + row.apellido_paterno + " " + row.apellido_materno,
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
