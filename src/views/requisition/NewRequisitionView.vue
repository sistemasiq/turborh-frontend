<template>
  <q-layout>
    <q-page-container>
      <q-page>
        <q-card flat bordered class="rounded-borders">
          <q-card-section class="row items-center">
            <p class="text-h6">Perfil Requerido</p>
            <q-btn v-if="isBoss && (showingDetails || updatingRequisition)" class="bg-grey-4" rounded flat color="black"
              label="ver comentarios" icon="visibility" style="margin-left: 70%;"
              @click.prevent="openNotes = !openNotes">
              <Tooltip :text="'Ver comentarios'" />
            </q-btn>
            <q-btn v-if="(isAdmin || isRh) && (showingDetails || updatingRequisition)" class="bg-grey-4" rounded flat
              label="Añadir comentarios" color="black" icon="edit" style="margin-left: 70%;"
              @click.prevent="openNotes = !openNotes">
            </q-btn>
          </q-card-section>
          <q-card-section class="requisition-content">
            <div class="pagination">
              <router-link :to="{ path: '/home/nueva-requisicion-' + currentPage }">
                <q-pagination v-model="currentPage" color="cyan" :max="2" :max-pages="2" boundary-numbers
                  :disable="job == 'Puesto solicitado' && !showingDetails && !updatingRequisition ? true : false" />
              </router-link>

            </div>
            <div class="requisition-dropdown row items-center">
              <q-input v-if="showingDetails" v-model="numRequisitionDetails" dark outlined color="cyan-1"
                label="No Requisición" label-color="white" style="margin-left: 3%; width:10%;"
                :readonly="showingDetails">
              </q-input>
              <q-btn-dropdown style="height: 55px;" icon="search" :label="selectedApplicant" no-ripple
                class="transparent q-ml-xl" outline text-color="white"
                :disable="showingDetails || !isRh || (updatingRequisition && isRh)">
                <q-list>
                  <q-item v-for="(item, index) in applicants" :key="index" clickable v-close-popup
                    @click.prevent="handleSelectedApplicant(item)">
                    <q-item-section>
                      <q-item-label>{{ item }}</q-item-label>
                    </q-item-section>
                  </q-item>
                </q-list>
              </q-btn-dropdown>

              <q-btn-dropdown :loading="isFetchingJobs" style="height: 55px;" icon="search" color="primary"
                :label="selectedJob.name" no-ripple class="transparent q-ml-md" outline text-color="white"
                :disable="isFetchingJobs || showingDetails">
                <q-input class="q-mb-sm" v-model="searchJob" placeholder="Buscar..." dense outlined />
                <q-list>
                  <q-item v-for="(item, index) in filteredJobs()" :key="index" clickable v-close-popup
                    @click.prevent="handleSelectedJob(item)">
                    <q-item-section>
                      <q-item-label>{{ item.name }}</q-item-label>
                    </q-item-section>
                  </q-item>
                </q-list>
              </q-btn-dropdown>
              <q-input v-model="vacancyNumbers" dark outlined color="cyan-1" label="No. de plazas" label-color="white"
                class="q-ml-md" type="number" min="1" @paste="onNoVacancyPaste" step="1" :disable="showingDetails">
              </q-input>
            </div>
            <div class="motive-title">
              <p>Motivo de la solicitud</p>
            </div>
            <div class="motive-content rounded-borders">
              <q-radio val="N" color="cyan" unchecked-icon="radio_button_unchecked" checked-icon="radio_button_checked"
                size="lg" class="motive-checkbox" v-model="motiveCreation" label="Nueva Creación"
                :disable="showingDetails" />
              <q-radio val="S" color="cyan" unchecked-icon="radio_button_unchecked" checked-icon="radio_button_checked"
                size="lg" class="motive-checkbox" v-model="motiveCreation" label="Sustitución"
                :disable="showingDetails" />
              <q-radio val="I" color="cyan" unchecked-icon="radio_button_unchecked" checked-icon="radio_button_checked"
                size="lg" class="motive-checkbox" v-model="motiveCreation" label="Incapacidad"
                :disable="showingDetails" />
              <q-radio val="P" color="cyan" unchecked-icon="radio_button_unchecked" checked-icon="radio_button_checked"
                size="lg" class="motive-checkbox" v-model="motiveCreation" label="Aumento de Producción"
                :disable="showingDetails" />
              <q-radio val="O" color="cyan" unchecked-icon="radio_button_unchecked" checked-icon="radio_button_checked"
                size="lg" class="motive-checkbox" v-model="motiveCreation" label="Otro" :disable="showingDetails" />
            </div>


            <div style="display: flex; justify-content: space-between; margin-top:5%;">

              <q-card flat bordered class="bg-dark job-requirements">
                <q-card-section>
                  <p class="title bg-dark text-white">Funciones del puesto</p>
                </q-card-section>
                <q-card-section>
                  <p class="content">
                  <ul style="list-style: none;">
                    <li>{{ jobFunctionsRequired }}</li>
                  </ul>

                  </p>
                </q-card-section>

              </q-card>
              <q-card flat bordered class="job-requirements bg-dark">
                <q-card-section>
                  <p class="title bg-dark text-white">Habilidades y/o conocimientos</p>
                </q-card-section>
                <q-card-section>
                  <p class="content">
                  <ul style="list-style: none;">
                    <li v-for="skill in jobSkillsRequired.split('\n')">{{ skill }}</li>
                  </ul>
                  </p>

                </q-card-section>

              </q-card>

            </div>


          </q-card-section>

        </q-card>
        <q-dialog v-model="openNotes">
          <NoteRequisitionComponent :current-note="requisitionData.notes" />
        </q-dialog>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script setup>
import {
  setSessionStorageItem,
  getSessionStorageItem,
  removeSessionStorageItem,
} from "src/stores/sessionStorage.js";
import Tooltip from "src/components/Tooltip.vue";
import { ref, onMounted, onBeforeMount, onBeforeUnmount } from "vue";
import { useRequisitionStore } from "src/stores/requisition"; //Requisition data store, used when creating a new requisition
import { useRequisitionDetailsStore } from "src/stores/requisitionDetails"; // Full requisition information store, used when showing the information
import { useAuthStore } from "src/stores/auth"; //Auth data store, the user auth data needed
import { useJobStore } from "src/stores/job"; // Full information about the job store
import { storeToRefs } from "pinia";
import NoteRequisitionComponent from "src/components/NoteRequisitionComponent.vue";
import {
  getPersonalByName,
  getPersonalById,
  getAllPersonal,
} from "src/services/personal";
import {
  getJobById,
  getJobsByPersonalId,
  getAllActiveJobs,
} from "src/services/jobs";
import { useRoute } from "vue-router";

const route = useRoute();
const useRequisition = useRequisitionStore();
const useRequisitionDetails = useRequisitionDetailsStore();
const useAuth = useAuthStore();
const useJob = useJobStore();

const selectedApplicant = ref("");
const applicants = ref([""]);

const searchJob = ref("");

const selectedJob = ref("");
const jobs = ref([""]);

const jobFunctionsRequired = ref("");
const jobSkillsRequired = ref("");

const currentPage = ref(1);

const isFetchingJobs = ref(false);

const openNotes = ref(false);

const note = ref("");

const {
  showingDetails,
  requisitionData,
  numRequisitionDetails,
  applicantDetails,
  jobDetails,
  updatingRequisition,
} = storeToRefs(useRequisitionDetails);
const {
  applicantId,
  applicant,
  job,
  vacancyNumbers,
  motiveCreation,
  gender,
  civilStatus,
  ageRequired,
} = storeToRefs(useRequisition);
const { user, isRh, isAdmin, isBoss } = storeToRefs(useAuth);
const {
  jobData,
  jobId,
  jobFunctions,
  jobSkills,
  englishLevel,
  educationRequired,
  experience,
  extraHours,
  travelAvailability,
  jobConditions,
  jobObservations,
} = storeToRefs(useJob);

/* onBeforeMount(() => {
  isJobSelected();
  isRequisitionSelected();
}); */

onMounted(() => {
  vacancyNumbers.value = vacancyNumbers.value === 0 ? 1 : vacancyNumbers.value;
  if (!showingDetails.value && !updatingRequisition.value) {
    newCreation();
  } else {
    showRequisitionDetails();
  }
});

onBeforeUnmount(() => {
  // Check if the current route is different than '/home/nueva-requisicion-1 AND '/home/nueva-requisicion-1 and if it is true then removes the selectedJob and selectedJobData from the session storage'
  if (
    route.path !== "/home/nueva-requisicion-1" &&
    route.path !== "/home/nueva-requisicion-2"
  ) {
    // Clear the session storage
    removeSessionStorageItem("selectedJob");
    removeSessionStorageItem("selectedJobData");
    removeSessionStorageItem("requisitionInformation");
    //restore the stores to the initial state
    useJob.$reset();
    useRequisition.clearStore();
    useRequisitionDetails.$reset();
  }
});

const isRequisitionSelected = () => {
  if (getSessionStorageItem("requisitionInformation")) {
    const requisitionInformation = JSON.parse(
      getSessionStorageItem("requisitionInformation")
    );
    numRequisitionDetails.value = requisitionInformation.numRequisitionDetails;
    applicantDetails.value = requisitionInformation.applicantDetails;
    jobDetails.value = requisitionInformation.jobDetails;
    showingDetails.value = requisitionInformation.showingDetails;
    updatingRequisition.value = requisitionInformation.updatingRequisition;
    requisitionData.value = requisitionInformation.requisitionData;
  }
};
const filteredJobs = () => {
  if (!searchJob.value) {
    return jobs.value;
  }

  const searchTermLower = searchJob.value.toLowerCase();

  return jobs.value.filter((job) =>
    job.name.toLowerCase().includes(searchTermLower)
  );
};

const showRequisitionDetails = () => {
  if (updatingRequisition.value) {
    fetchJobs();
    fetchJobData(requisitionData.value.jobId);
  }
  selectedApplicant.value = applicantDetails.value;
  motiveCreation.value = requisitionData.value.motiveCreation;
  vacancyNumbers.value = requisitionData.value.vacancyNumber;
  note.value = requisitionData.value.notes;
  /* console.log(note.value); */
  fetchJobDataDetails();
};

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

    jobFunctionsRequired.value = jobData.functions;
    jobSkillsRequired.value = jobData.skills;
  }
};

const newCreation = () => {
  selectedApplicant.value = applicant.value;

  selectedJob.value = job.value;

  if (applicant.value === "") {
    fetchDefaultApplicant();
  }

  fetchApplicants();
  fetchJobs();
  setDefaultJobValues();
};

const fetchDefaultApplicant = async () => {
  try {
    const personalData = await getPersonalById(user.value.personalId);

    if (personalData) {
      applicantId.value = personalData.id;
      selectedApplicant.value = personalData.name;
      applicant.value = selectedApplicant.value;
    }
  } catch (error) {
    console.error("Error fetching default applicant: ", error);
  }
};

const fetchApplicants = async () => {
  try {
    const personalListData = await getAllPersonal();
    if (personalListData) {
      applicants.value = personalListData;
    }
  } catch (error) {
    console.error("Error fetching applicants: ", error);
  }
};

const fetchJobs = async () => {
  const personalId =
    applicantId.value != 0 ? applicantId.value : user.value.personalId;

  try {
    isFetchingJobs.value = true;
    const jobsFetched =
      isRh.value || isAdmin.value
        ? await getAllActiveJobs()
        : await getJobsByPersonalId(personalId);
    if (jobsFetched) {
      jobs.value = jobsFetched;
      jobs.value.sort((a, b) => a.name.localeCompare(b.name));
    }
  } catch (error) {
    console.error("Error fetching applicants: ", error);
  } finally {
    isFetchingJobs.value = false;
  }
};

const fetchJobData = async (id) => {
  try {
    const job = await getJobById(id);
    if (job) {
      /* console.log("the job data: ", job); */
      setSessionStorageItem("selectedJobData", job);
      jobData.value = job;
      jobId.value = job.id;
      jobFunctions.value = job.functions;
      jobSkills.value = job.skills;
      jobObservations.value = job.observations;
      jobConditions.value = job.conditions;

      englishLevel.value = job.englishLevel;
      extraHours.value = job.extraHours;
      travelAvailability.value = job.travelAvailability;
      educationRequired.value = job.education;
      experience.value = job.experience;

      jobFunctionsRequired.value = job.functions;
      jobSkillsRequired.value = job.skills;
    }
  } catch (error) {
    console.error("Error fetching applicants: ", error);
  }
};

const fetchJobDataDetails = async () => {
  try {
    const job = await getJobById(jobDetails.value);
    if (job) {
      jobFunctionsRequired.value = job.functions;
      jobSkillsRequired.value = job.skills;
      selectedJob.value = job;
    }
  } catch (error) {
    console.error("Error fetching applicants: ", error);
  }
};

const resetJobData = () => {
  jobFunctions.value = "";
  jobSkills.value = "";
  englishLevel.value = "";
  educationRequired.value = "";
  experience.value = "";
  selectedJob.value = "Puesto Solicitado";
  extraHours.value = 0;
  travelAvailability.value = 0;

  gender.value = "";
  civilStatus.value = "";
  ageRequired.value = 18;

  jobSkillsRequired.value = "";
  jobFunctionsRequired.value = "";
};

const setDefaultJobValues = () => {
  jobFunctionsRequired.value = jobFunctions.value;
  jobSkillsRequired.value = jobSkills.value;
};

//Previene que se puedan pegar datos no numericos
const onNoVacancyPaste = (event) => {
  const clipboardData = event.clipboardData || window.clipboardData;
  const pastedData = clipboardData.getData("text/plain");
  if (isNaN(pastedData)) {
    event.preventDefault();
  }
};

const handleSelectedApplicant = async (selectedItem) => {
  try {
    const personalData = await getPersonalByName(selectedItem);

    if (personalData) {
      selectedApplicant.value = selectedItem;
      applicant.value = selectedApplicant.value;
      applicantId.value = personalData.id;
      resetJobData();
      fetchJobs();
    }
  } catch (error) {
    console.error("Error fetching applicants: ", error);
  }
};

const handleSelectedJob = (selectedItem) => {
  selectedJob.value = selectedItem;
  job.value = selectedJob.value;

  setSessionStorageItem("selectedJob", selectedJob.value);
  fetchJobData(selectedJob.value.id);
};
</script>

<style scoped>
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

.motive-content {
  background-color: #ffffff;
  height: 100%;
  margin-left: 3%;
  margin-right: 3%;
  width: 95%;
  padding-left: 10%;
}

.motive-checkbox {
  margin-left: 3%;
  font-size: 18px;
}

.motive-title {
  padding-top: 3%;
  font-size: 18px;
  color: aliceblue;
  padding-left: 6%;
}

.dropdown-with-border {
  border-color: #ffffff;
  border-style: solid;
  border-width: 1px;
  width: 300px;
  height: 55px;
  margin-left: 3%;
  background-color: transparent !important;
}

.job-requirements {
  margin-top: 1%;
  width: 50%;
  height: 100%;
  margin-left: 3%;
  margin-right: 3%;
  border-radius: 15px;
  text-align: center;
}

.job-requirements .title {
  font-size: 24px;
}

.job-requirements .content {
  border-radius: 15px;
  height: 330px;
  width: 100%;
  font-size: 18px;
  padding-right: 5%;
  padding-bottom: 2%;
  color: black;
  text-align: start;
  background-color: #ffffff;
  overflow-y: scroll;
}
</style>
