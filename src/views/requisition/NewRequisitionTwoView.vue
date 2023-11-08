<template>
  <q-layout>
    <q-page-container>
      <q-page>
        <q-card flat bordered class="rounded-borders">
          <q-card-section style="height: 100%">
            <p class="text-h4" style="font-size: 25px">
              {{ showingDetails ? "Detalles" : "Perfil Requerido" }}
            </p>
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
                label-color="white"
                style="margin-left: 3%; width: 7%"
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
                style="margin-left: 3%; width: 20%"
                readonly
              >
              </q-input>

              <div class="gender-content">
                <div class="gender-title">
                  <p>Sexo:</p>
                </div>
                <div style="display: flex">
                  <q-radio
                    val="M"
                    color="cyan"
                    unchecked-icon="radio_button_unchecked"
                    checked-icon="radio_button_checked"
                    size="lg"
                    class="checkbox"
                    v-model="gender"
                    label="Masculino"
                    style="color: white"
                    :disable="showingDetails"
                  />
                  <q-radio
                    val="F"
                    color="cyan"
                    unchecked-icon="radio_button_unchecked"
                    checked-icon="radio_button_checked"
                    size="lg"
                    class="checkbox"
                    v-model="gender"
                    label="Femenino"
                    style="color: white"
                    :disable="showingDetails"
                  />
                </div>
              </div>
              <div class="gender-content">
                <div class="gender-title">
                  <p>Estado civil</p>
                </div>
                <div style="display: flex">
                  <q-radio
                    val="C"
                    color="cyan"
                    unchecked-icon="radio_button_unchecked"
                    checked-icon="radio_button_checked"
                    size="lg"
                    class="checkbox"
                    v-model="civilStatus"
                    label="Casado"
                    style="color: white"
                    :disable="showingDetails"
                  />
                  <q-radio
                    val="S"
                    color="cyan"
                    unchecked-icon="radio_button_unchecked"
                    checked-icon="radio_button_checked"
                    size="lg"
                    class="checkbox"
                    v-model="civilStatus"
                    label="Soltero"
                    style="color: white"
                    :disable="showingDetails"
                  />
                </div>
              </div>
            </div>

            <div class="title">
              <p>Escolaridad:</p>
            </div>
            <div class="schooling-content rounded-borders">
              <q-radio
              val="S"
                color="cyan"
                unchecked-icon="radio_button_unchecked"
                checked-icon="radio_button_checked"
                size="lg"
                class="checkbox"
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
                class="checkbox"
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
                class="checkbox"
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
                class="checkbox"
                v-model="educationRequired"
                label="Maestria"
                disable
              />
            </div>
            <q-input
              v-model="experienceRequired"
              dark
              outlined
              color="cyan-1"
              label="Experiencia"
              label-color="white"
              style="margin-left: 3%; margin-top: 3%; font-size: medium"
              type="textarea"
              readonly
            >
            </q-input>
            <q-input
              v-model="observations"
              dark
              outlined
              color="cyan-1"
              label="Observaciones sobre el puesto"
              label-color="white"
              style="margin-left: 3%; margin-top: 3%; font-size: medium"
              type="textarea"
              :readonly="showingDetails"
            >
            </q-input>
            <div class="misc-content rounded-borders">
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
            </div>
            <div class="title">
              <p>Condiciones:</p>
            </div>
            <q-input
              v-model="conditions"
              dark
              outlined
              color="cyan-1"
              label="Especificar"
              label-color="white"
              style="margin-left: 3%"
              type="textarea"
              :readonly="showingDetails"
            >
            </q-input>
            <q-btn
              v-if="!showingDetails"
              unelevated
              rounded
              style="margin-left: 80%"
              class="btn-brand q-mt-xl"
              @click.prevent="saveRequisition()"
              :disable="disableSaveRequisitionButton()"
            >
              Guardar
            </q-btn>
          </q-card-section>
        </q-card>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRequisitionStore } from "src/stores/requisition";
import { useRequisitionDetailsStore } from "src/stores/requisitionDetails";
import { useJobStore } from "src/stores/job";
import { storeToRefs } from "pinia";
import { useQuasar } from "quasar";
import { notifyNegative, notifyPositive } from "src/utils/notifies";
import axios from "axios";

const useRequisition = useRequisitionStore();
const useRequisitionDetails = useRequisitionDetailsStore();
const useJob = useJobStore();
const $q = useQuasar();

const noRequisition = ref(0);
const englishLevelRequired = ref("");

const experienceRequired = ref("");
const observations = ref("");
const conditions = ref("");

const extraHoursRequired = ref(false);
const travelAvailabilityRequired = ref(false);

const currentPage = ref(2);

//Obtiene los valores de la store de detalles de la requisicion
const { showingDetails, requisitionData } = storeToRefs(useRequisitionDetails);
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
  jobId,
  educationRequired,
  extraHours,
  travelAvailability,
  experience,
  englishLevel,
  jobFunctions,
  jobSkills,
} = storeToRefs(useJob);

onMounted(() => {
  if (!showingDetails.value) {
    setDefaultJobValues();
  } else {
    showRequisitionDetails();
  }
});
const showRequisitionDetails = () => {
  console.log(requisitionData.value);
  ageRequired.value = requisitionData.value.age;
  gender.value = requisitionData.value.gender;
  civilStatus.value = requisitionData.value.civilStatus;
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
  if (!showingDetails.value) {
    englishLevelRequired.value = englishLevel.value;
    experienceRequired.value = experience.value;
    extraHoursRequired.value = extraHours.value === 1 ? true : false;
    travelAvailabilityRequired.value =
      travelAvailability.value === 1 ? true : false;
    return;
  }
  
  educationRequired.value = requisitionData.value.schooling;
  englishLevelRequired.value = requisitionData.value.englishLevel;
  experienceRequired.value = requisitionData.value.experience;
  extraHoursRequired.value =
    requisitionData.value.extraHours === 1 ? true : false;
  travelAvailabilityRequired.value =
    requisitionData.value.travelAvailability === 1 ? true : false;
};


const disableSaveRequisitionButton = () => {
  return (
    applicant.value === "Solicitante" ||
    !gender.value ||
    !civilStatus.value ||
    !motiveCreation.value ||
    job.value === "Puesto Solicitado"
  );
};

const saveRequisition = async () => {
  const {
    vacancyNumbers,
    motiveCreation,
    ageRequired,
    civilStatus,
    gender,
    applicantId,
  } = storeToRefs(useRequisition);
  const { jobId, educationRequired, extraHours, travelAvailability, englishLevel } =
    storeToRefs(useJob);

  const requisitionData = {
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

    const request = await axios.post("/requisicion", requisitionData);
    if (request.status === 201) {
      await fetchLastNumRequisition();

      resetRequisitionStoreValues();
    } else {
      $q.notify(
        notifyNegative(
          "Hubo un error al crear la requisicion. Intente de nuevo."
        )
      );
    }
  } catch (error) {
    $q.notify(
      notifyNegative("Hubo un error al crear la requisicion. Intente de nuevo.")
    );
  }
};

const fetchLastNumRequisition = async () => {
  try {
    const request = await axios.get("/requisicion/numero");

    if (request.status === 200) {
      noRequisition.value = request.data;
      $q.notify(
        notifyPositive(
          `Su requisicion ha sido guardada con el FOLIO: ${request.data}`
        )
      );
    }
  } catch (error) {
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
  background-color: #ffffff;
}

.requisition-content {
  background-color: #313131;
  height: 100%;
  padding-top: 2%;
}

.schooling-content {
  background-color: #ffffff;
  height: 100%;
  width: 70%;
  margin-left: 3%;
  margin-right: 3%;
}

.misc-content {
  background-color: #ffffff;
  height: 100%;
  width: 50%;
  margin-left: 3%;
  margin-right: 3%;
  margin-top: 2%;
}

.gender-title {
  font-weight: bold;
  font-size: 16px;
  color: aliceblue;
  padding-left: 10%;
}

.gender-content {
  background-color: transparent;
  margin-left: 3%;
}

.checkbox {
  margin-left: 3%;
}

.title {
  padding-top: 3%;
  font-size: 16px;
  color: aliceblue;
  padding-left: 3%;
}
</style>
