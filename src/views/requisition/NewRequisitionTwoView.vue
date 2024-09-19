<template>
  <q-layout>
    <q-page-container>
      <q-page>
        <q-card flat bordered class="rounded-borders">
          <q-card-section class="row items-center">
            <p class="text-h6">Perfil Requerido</p>
            <q-btn
              v-if="isBoss && (showingDetails || updatingRequisition)"
              class="bg-grey-4"
              rounded
              flat
              label="Ver comentarios"
              color="black"
              icon="visibility"
              style="margin-left: 70%"
              @click.prevent="openNotes = !openNotes"
            >
            </q-btn>
            <q-btn
              v-if="
                (isAdmin || isRh) && (showingDetails || updatingRequisition)
              "
              class="bg-grey-4"
              rounded
              flat
              label="Añadir comentarios"
              color="black"
              icon="edit"
              style="margin-left: 70%"
              @click.prevent="openNotes = !openNotes"
            >
            </q-btn>
          </q-card-section>
          <q-card-section class="requisition-content">
            <div class="pagination">
              <router-link
                :to="{ path: '/home/nueva-requisicion-' + currentPage }"
              >
                <q-pagination
                  v-model="currentPage"
                  color="cyan"
                  :max="2"
                  :max-pages="2"
                  boundary-numbers
                />
              </router-link>
            </div>
            <div class="row items-center">
              <q-input
                v-model="ageRequired"
                dark
                outlined
                color="cyan-1"
                label="Edad"
                class="q-ml-md"
                label-color="white"
                type="number"
                min="18"
                max="65"
                @paste="onNumberTypePaste"
                step="1"
                :readonly="showingDetails"
              >
              </q-input>
              <q-input
                v-model="englishLevelRequired"
                dark
                outlined
                color="cyan-1"
                label="Inglés"
                label-color="white"
                class="q-ml-xl"
                readonly
              >
              </q-input>

              <div class="column q-ml-xl">
                <p class="text-body2 text-white q-ml-md">Sexo:</p>
                <div>
                  <q-radio
                    val="M"
                    color="cyan"
                    unchecked-icon="radio_button_unchecked"
                    checked-icon="radio_button_checked"
                    size="lg"
                    class="text-white"
                    v-model="gender"
                    dark
                    label="Masculino"
                    :disable="showingDetails"
                  />
                  <q-radio
                    val="F"
                    color="cyan"
                    unchecked-icon="radio_button_unchecked"
                    checked-icon="radio_button_checked"
                    size="lg"
                    class="text-white"
                    v-model="gender"
                    dark
                    label="Femenino"
                    :disable="showingDetails"
                  />
                  <q-radio
                    val="I"
                    color="cyan"
                    unchecked-icon="radio_button_unchecked"
                    checked-icon="radio_button_checked"
                    size="lg"
                    class="text-white"
                    v-model="gender"
                    dark
                    label="Indistinto"
                    :disable="showingDetails"
                  />
                </div>
              </div>
              <div class="column q-ml-xl">
                <div>
                  <p class="text-white text-body2 q-ml-md">Estado civil</p>
                </div>
                <div>
                  <q-radio
                    val="C"
                    color="cyan"
                    unchecked-icon="radio_button_unchecked"
                    checked-icon="radio_button_checked"
                    size="lg"
                    class="text-white"
                    v-model="civilStatus"
                    dark
                    label="Casado"
                    :disable="showingDetails"
                  />
                  <q-radio
                    val="S"
                    color="cyan"
                    unchecked-icon="radio_button_unchecked"
                    checked-icon="radio_button_checked"
                    size="lg"
                    class="text-white"
                    dark
                    v-model="civilStatus"
                    label="Soltero"
                    :disable="showingDetails"
                  />
                  <q-radio
                    val="I"
                    color="cyan"
                    unchecked-icon="radio_button_unchecked"
                    checked-icon="radio_button_checked"
                    size="lg"
                    class="text-white"
                    v-model="civilStatus"
                    dark
                    label="Indistinto"
                    :disable="showingDetails"
                  />
                </div>
              </div>
            </div>

            <q-card class="column q-ma-md transparent" flat>
              <q-card-section class="text-body2 text-white">
                Escolaridad:
              </q-card-section>
              <q-card-section
                style="width: 80%"
                class="bg-white rounded-borders"
              >
                <q-radio
                  val="S"
                  color="cyan"
                  unchecked-icon="radio_button_unchecked"
                  checked-icon="radio_button_checked"
                  size="lg"
                  v-model="educationRequired"
                  label="Secundaria"
                  disable
                />
                <q-radio
                  val="B"
                  color="cyan"
                  unchecked-icon="radio_button_unchecked"
                  checked-icon="radio_button_checked"
                  size="lg"
                  v-model="educationRequired"
                  label="Bachillerato"
                  disable
                />
                <q-radio
                  val="P"
                  color="cyan"
                  unchecked-icon="radio_button_unchecked"
                  checked-icon="radio_button_checked"
                  size="lg"
                  v-model="educationRequired"
                  label="Profesional"
                  disable
                />
                <q-radio
                  val="M"
                  color="cyan"
                  unchecked-icon="radio_button_unchecked"
                  checked-icon="radio_button_checked"
                  size="lg"
                  v-model="educationRequired"
                  label="Maestria"
                  disable
                />
              </q-card-section>
            </q-card>

            <q-input
              class="q-ma-md"
              v-model="experienceRequired"
              dark
              outlined
              color="cyan-1"
              label="Experiencia"
              label-color="white"
              readonly
            />
            <q-input
              class="q-ma-md"
              v-model="defaultObservations"
              dark
              outlined
              color="cyan-1"
              label="Observaciones del puesto"
              label-color="white"
              readonly
            />

            <q-input
              v-model="observations"
              dark
              outlined
              color="cyan-1"
              label="Observaciones extra sobre el puesto"
              label-color="white"
              class="q-ma-md"
              type="textarea"
              :readonly="showingDetails"
            >
            </q-input>
            <q-card class="column q-ma-md transparent" flat>
              <q-card-section
                style="width: 40%"
                class="bg-white rounded-borders"
              >
                <q-checkbox
                  color="cyan"
                  unchecked-icon="radio_button_unchecked"
                  checked-icon="radio_button_checked"
                  size="lg"
                  class="checkbox"
                  v-model="extraHoursRequired"
                  label="Derecho a tiempo extra"
                  disable
                />
                <q-checkbox
                  color="cyan"
                  unchecked-icon="radio_button_unchecked"
                  checked-icon="radio_button_checked"
                  size="lg"
                  class="checkbox"
                  v-model="travelAvailabilityRequired"
                  label="Disponibilidad para viajar"
                  disable
                />
              </q-card-section>
            </q-card>
            <q-input
              class="q-ma-md"
              v-model="defaultConditions"
              dark
              outlined
              color="cyan-1"
              label="Condiciones del puesto"
              label-color="white"
              readonly
            />
            <q-input
              v-model="conditions"
              dark
              outlined
              color="cyan-1"
              label="Condiciones extra del puesto."
              label-color="white"
              class="q-ma-md"
              type="textarea"
              :readonly="showingDetails"
            >
            </q-input>
            <q-btn
              v-if="updatingRequisition"
              unelevated
              size="lg"
              icon="update"
              label="actualizar"
              style="margin-left: 85%"
              class="q-mt-xl bg-green-5 text-white"
              @click.prevent="openConfirmation = true"
              :disable="disableSaveRequisitionButton"
            />
            <q-btn
              v-if="!showingDetails && !updatingRequisition"
              unelevated
              size="lg"
              icon="save"
              label="guardar"
              style="margin-left: 85%"
              class="q-mt-xl bg-green-5 text-white"
              @click.prevent="openConfirmation = true"
              :disable="disableSaveRequisitionButton"
            />
          </q-card-section>
        </q-card>
        <q-dialog v-model="openNotes">
          <NoteRequisitionComponent :current-note="requisitionData.notes" />
        </q-dialog>
        <q-dialog v-model="openConfirmation" persistent>
          <q-card rounded style="border-radius: 30px">
            <q-card-section class="row items-center">
              <span class="q-ml-sm text-h6 text-weight-regular">
                {{
                  !updatingRequisition
                    ? "¿Quieres guardar tu requisición?"
                    : "¿Quieres actualizar tu requisición?"
                }}
              </span>
            </q-card-section>

            <q-card-actions align="center">
              <q-btn flat label="Cancelar" color="primary" v-close-popup />
              <q-btn
                rounded
                flat
                label="OK"
                v-close-popup
                class="text-white bg-green-5"
                @click.prevent="
                  updatingRequisition
                    ? updateRequisitionData()
                    : createNewRequisition()
                "
              />
            </q-card-actions>
          </q-card>
        </q-dialog>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref, onMounted, computed, onBeforeMount, onBeforeUnmount } from "vue";
import { getSessionStorageItem, removeSessionStorageItem } from "src/stores/sessionStorage.js";
import { useRequisitionStore, clearStore } from "src/stores/requisition";
import { useRequisitionDetailsStore } from "src/stores/requisitionDetails";
import { useJobStore } from "src/stores/job";
import { storeToRefs } from "pinia";
import { useQuasar } from "quasar";
import { useAuthStore } from "src/stores/auth";
import NoteRequisitionComponent from "src/components/NoteRequisitionComponent.vue";
import { notifyNegative, notifyPositive } from "src/utils/notifies";
import { createRequisition, updateRequisition } from "src/services/requisition";
import { useRoute, useRouter } from "vue-router";

const router = useRouter();
const route = useRoute();
const useAuth = useAuthStore();
const useRequisition = useRequisitionStore();
const useRequisitionDetails = useRequisitionDetailsStore();
const useJob = useJobStore();
const $q = useQuasar();

const englishLevelRequired = ref("");

const experienceRequired = ref("");
const observations = ref("");
const conditions = ref("");

const extraHoursRequired = ref(false);
const travelAvailabilityRequired = ref(false);

const currentPage = ref(2);

const openNotes = ref(false);

const defaultConditions = ref("");
const defaultObservations = ref("");

const { isAdmin, user, isRh, isBoss } = storeToRefs(useAuth);

const openConfirmation = ref(false);

//Obtiene los valores de la store de detalles de la requisicion
const { showingDetails, requisitionData, updatingRequisition } = storeToRefs(
  useRequisitionDetails
);
const {
  gender,
  civilStatus,
  motiveCreation,
  applicant,
  job,
  vacancyNumbers,
  ageRequired,
  applicantId,
} = storeToRefs(useRequisition);
const {
  jobData,
  jobId,
  educationRequired,
  extraHours,
  travelAvailability,
  experience,
  englishLevel,
  jobFunctions,
  jobSkills,
  jobConditions,
  jobObservations,
} = storeToRefs(useJob);

onBeforeMount(() => {
  isJobSelected();
});

onMounted(() => {
  ageRequired.value =
    ageRequired.value === 0 || !ageRequired.value ? 18 : ageRequired.value;
  if (!showingDetails.value && !updatingRequisition.value) {
    setDefaultJobValues();
  } else {
    showRequisitionDetails();
  }
});

onBeforeUnmount(() => {
     // Check if the current route is different than '/home/nueva-requisicion-1 AND '/home/nueva-requisicion-1 and if it is true then removes the selectedJob and selectedJobData from the session storage'
  if (route.path !== '/home/nueva-requisicion-1' && route.path !== '/home/nueva-requisicion-2' ) {
    // Clear the session storage
    removeSessionStorageItem("selectedJob");
    removeSessionStorageItem("selectedJobData");
  }
})

/**
 * Function to see if the session storage has the specified values, if true, the values are asigned to the needed variables
 */
const isJobSelected = () => {
  if (
    getSessionStorageItem("selectedJob") &&
    getSessionStorageItem("selectedJobData")
  ) {
    job.value = JSON.parse(getSessionStorageItem("selectedJob"));
    const jobData = JSON.parse(getSessionStorageItem("selectedJobData"));
    jobData.value = jobData;
    jobId.value = jobData.id;
    jobFunctions.value = jobData.functions;
    jobSkills.value = jobData.skills;
    jobObservations.value = jobData.observations;
    jobConditions.value = jobData.conditions;

    englishLevel.value = jobData.englishLevel;
    extraHours.value = jobData.extraHours;
    travelAvailability.value = jobData.travelAvailability;
    educationRequired.value = jobData.education;
    experience.value = jobData.experience;
    gender.value = jobData.gender;
    civilStatus.value = jobData.civilStatus;
    ageRequired.value = jobData.ageRequired;

  }
};

const showRequisitionDetails = () => {
  ageRequired.value = requisitionData.value.age;
  gender.value = requisitionData.value.gender;
  civilStatus.value = requisitionData.value.civilStatus;
  conditions.value = requisitionData.value.conditions;
  observations.value = requisitionData.value.observations;
  experienceRequired.value = requisitionData.value.experience;
  defaultObservations.value = requisitionData.value.jobObservations;
  defaultConditions.value = requisitionData.value.jobConditions;
  setDefaultJobValues();
};

//Previene que se puedan pegar datos no numericos
const onNumberTypePaste = (event) => {
  const clipboardData = event.clipboardData || window.clipboardData;
  const pastedData = clipboardData.getData("text/plain");
  if (isNaN(pastedData)) {
    event.preventDefault();
  }
};

const setDefaultJobValues = () => {
  if(!jobData.value)
  return;

  if (!showingDetails.value && !updatingRequisition.value) {
    console.log("set default value: ", jobData.value);
    travelAvailabilityRequired.value =
      travelAvailability.value === 1 ? true : false;
    defaultConditions.value = jobConditions.value;
    defaultObservations.value = jobObservations.value;

    return;
  }
  console.log("Viewing or updating")
  educationRequired.value = requisitionData.value.schooling;
  englishLevelRequired.value = requisitionData.value.englishLevel;
  experienceRequired.value = requisitionData.value.experience;
  extraHoursRequired.value =
    requisitionData.value.extraHours === 1 ? true : false;
  travelAvailabilityRequired.value =
    requisitionData.value.travelAvailability === 1 ? true : false;
  defaultObservations.value = requisitionData.value.jobObservations;
  defaultConditions.value = requisitionData.value.jobConditions;
};

const disableSaveRequisitionButton = computed(() => {
  return (
    !gender.value ||
    !civilStatus.value ||
    !motiveCreation.value ||
    vacancyNumbers.value <= 0 ||
    !job.value ||
    !job.value === "" ||
    ageRequired.value < 18 ||
    !ageRequired.value
  );
});

const createNewRequisition = async () => {
  const {
    vacancyNumbers,
    motiveCreation,
    ageRequired,
    civilStatus,
    gender,
    applicantId,
  } = storeToRefs(useRequisition);
  const {
    jobId,
    educationRequired,
    extraHours,
    travelAvailability,
    englishLevel,
  } = storeToRefs(useJob);

  const newRequisition = {
    createdBy: user.value.id,
    jobId: jobId.value,
    personalId: applicantId.value,
    vacancyNumber: vacancyNumbers.value,
    motiveCreation: motiveCreation.value,
    age: ageRequired.value,
    englishLevel: englishLevel.value,
    gender: gender.value,
    civilStatus: civilStatus.value,
    schooling: educationRequired.value,
    observations: observations.value,
    extraHours: extraHours.value,
    travelAvailability: travelAvailability.value,
    conditions: conditions.value,
  };

  try {
    $q.loading.show();

    const newRequisitionId = await createRequisition(newRequisition);

    if (newRequisitionId && newRequisitionId > 0) {
      $q.notify(
        notifyPositive(
          `Su requisicion ha sido guardada con el FOLIO: ${newRequisitionId}`,
          5000
        )
      );
      resetRequisitionStoreValues();

      router.replace("/home/nueva-requisicion-1");
    } else {
      $q.notify(
        notifyNegative(
          "Hubo un error al crear su requisicion. Intente de nuevo."
        )
      );
    }
  } catch (error) {
    $q.notify(
      notifyNegative("Hubo un error al crear su requisicion. Intente de nuevo.")
    );
  } finally {
    $q.loading.hide();
  }
};

const updateRequisitionData = async () => {
  const { vacancyNumbers, motiveCreation, ageRequired, civilStatus } =
    storeToRefs(useRequisition);
  const { jobId } = storeToRefs(useJob);

  const updatedRequisitionData = {
    numRequisition: requisitionData.value.numRequisition,
    createdBy: user.value.id,
    jobId: jobId.value,
    vacancyNumber: vacancyNumbers.value,
    motiveCreation: motiveCreation.value,
    age: ageRequired.value,
    gender: gender.value,
    civilStatus: civilStatus.value,
    observations: observations.value,
    conditions: conditions.value,
  };

  try {
    $q.loading.show();

    const updatedRequisitionCorrectly = await updateRequisition(
      updatedRequisitionData
    );

    if (updatedRequisitionCorrectly) {
      router.replace("/home/historial-requisiciones");
      $q.notify(
        notifyPositive("Su requisición ha sido actualizada correctamente.")
      );
    } else {
      $q.notify(
        notifyNegative(
          "Hubo un error al actualizar su requisicion. Intente de nuevo."
        )
      );
    }
  } catch (error) {
    $q.notify(
      notifyNegative(
        "Hubo un error al actualizar su requisicion. Intente de nuevo."
      )
    );
    console.log(error);
  } finally {
    $q.loading.hide();
  }
};

const resetRequisitionStoreValues = () => {
  applicant.value = "";
  applicantId.value = 0;
  gender.value = "";
  civilStatus.value = "";
  job.value = "Puesto Solicitado";
  ageRequired.value = 18;
  motiveCreation.value = "";
  vacancyNumbers.value = 1;
  jobId.value = "";
  educationRequired.value = "";
  extraHours.value = false;
  travelAvailability.value = false;
  experience.value = "";
  englishLevel.value = "";
  jobFunctions.value = "Funciones del puesto requeridas";
  jobSkills.value = "Habilidades requeridas";
  setDefaultJobValues();
};
</script>

<style scoped>
.btn-brand {
  color: white;
  width: 250px;
  height: 60px;
  font-size: larger;
  font-weight: bolder;
  background-color: #99c5cc !important;
}

.pagination {
  padding-left: 92%;
  padding-bottom: 5%;
}

.rounded-borders {
  border-radius: 15px;
}

.requisition-content {
  background-color: #313131;
  height: 100%;
  padding-top: 2%;
}

.schooling-content {
  height: 100%;
  width: 70%;
  margin-left: 3%;
  margin-right: 3%;
}

.misc-content {
  height: 100%;
  width: 50%;
  margin-left: 3%;
  margin-right: 3%;
  margin-top: 2%;
}

.gender-title {
  font-weight: bold;
  font-size: 16px;
  padding-left: 10%;
}

.gender-content {
  background-color: transparent;
  margin-left: 3%;
}

.title {
  padding-top: 3%;
  font-size: 16px;
  padding-left: 3%;
}
</style>
