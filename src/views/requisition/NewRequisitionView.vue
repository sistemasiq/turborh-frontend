<template>
    <q-layout>
        <q-page-container>
            <q-page>
                <q-card flat bordered class="rounded-borders">
                    <q-card-section style="height: 100%;">
                        <p class="text-h4" style="font-size: 25px;">{{ showingDetails ? "Detalles" : "Perfil Requerido" }}</p>
                    </q-card-section>
                    <q-card-section class="requisition-content">
                        <div class="pagination">
                            <router-link :to="{ path: '/home/nueva-requisicion-' + currentPage }">
                                <q-pagination v-model="currentPage" color="cyan" :max="2" :max-pages="2" boundary-numbers />
                            </router-link>

                        </div>
                        <div class="requisition-dropdown row items-center">
                            <q-input v-if="showingDetails" v-model="numRequisitionDetails" dark outlined color="cyan-1" label="No Requisición" label-color="white"
                                style="margin-left: 3%; width:10%;" :readonly="showingDetails">
                            </q-input>
                            <q-btn-dropdown style="height: 55px;" icon="search" :label="selectedApplicant" no-ripple
                            class="transparent q-ml-xl" outline text-color="white" :disable="showingDetails">
                                <q-list>
                                    <q-item v-for="(item, index) in applicants" :key="index" clickable v-close-popup
                                        @click.prevent="handleSelectedApplicant(item)">
                                        <q-item-section>
                                            <q-item-label>{{ item }}</q-item-label>
                                        </q-item-section>
                                    </q-item>
                                </q-list>
                            </q-btn-dropdown>

                            <q-btn-dropdown style="height: 55px;" icon="search" color="primary" :label="selectedJob.name" no-ripple
                                class="transparent q-ml-md" outline text-color="white" :disable="isFetchingJobs || showingDetails">
                                <q-list>
                                    <q-item v-for="(item, index) in jobs" :key="index" clickable v-close-popup
                                        @click.prevent="handleSelectedJob(item)">
                                        <q-item-section>
                                            <q-item-label>{{ item.name }}</q-item-label>
                                        </q-item-section>
                                    </q-item>
                                </q-list>
                            </q-btn-dropdown>
                            <q-input v-model="vacancyNumbers" dark outlined color="cyan-1" label="No. de plazas"
                                label-color="white" class="q-ml-md" type="number" min="1"
                                @paste="onNoVacancyPaste" step="1"
                                :disable="showingDetails">
                            </q-input>
                        </div>
                        <div class="motive-title">
                            <p>Motivo de la solicitud</p>
                        </div>
                        <div class="motive-content rounded-borders">
                            <q-radio val="N" color="cyan" unchecked-icon="radio_button_unchecked"
                                checked-icon="radio_button_checked" size="lg" class="motive-checkbox"
                                v-model="motiveCreation"
                                label="Nueva Creación" :disable="showingDetails" />
                            <q-radio val="S" color="cyan" unchecked-icon="radio_button_unchecked"
                                checked-icon="radio_button_checked" size="lg" class="motive-checkbox"
                                v-model="motiveCreation"
                                label="Sustitución" :disable="showingDetails"/>
                            <q-radio val="I" color="cyan" unchecked-icon="radio_button_unchecked"
                                checked-icon="radio_button_checked" size="lg" class="motive-checkbox"
                                v-model="motiveCreation"
                                label="Incapacidad" :disable="showingDetails"/>
                            <q-radio val="P" color="cyan" unchecked-icon="radio_button_unchecked"
                                checked-icon="radio_button_checked" size="lg" class="motive-checkbox"
                                v-model="motiveCreation"
                                label="Aumento de Producción" :disable="showingDetails"/>
                            <q-radio val="O" color="cyan" unchecked-icon="radio_button_unchecked"
                                checked-icon="radio_button_checked" size="lg" class="motive-checkbox"
                                v-model="motiveCreation" label="Otro" :disable="showingDetails"/>
                        </div>


                        <div style="display: flex; justify-content: space-between; margin-top:5%;">

                            <q-card flat bordered  class="bg-dark job-requirements">
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
                                <q-card-section >
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
            </q-page>
        </q-page-container>
    </q-layout>
</template>

<script setup>

import { ref, onMounted} from 'vue';
import { useRequisitionStore } from 'src/stores/requisition';
import { useRequisitionDetailsStore } from 'src/stores/requisitionDetails';
import { useAuthStore } from 'src/stores/auth'
import { useJobStore } from 'src/stores/job';
import { storeToRefs } from 'pinia';
import axios from "axios";

const useRequisition = useRequisitionStore();
const useRequisitionDetails = useRequisitionDetailsStore();
const useAuth = useAuthStore();
const useJob = useJobStore();

const selectedApplicant = ref('')
const applicants = ref([''])


const selectedJob = ref('')
const jobs = ref([''])

const jobFunctionsRequired = ref("");
const jobSkillsRequired = ref("");

const currentPage = ref(1);

const isFetchingJobs = ref(false);


const {  showingDetails, requisitionData, numRequisitionDetails, applicantDetails, jobDetails } = storeToRefs(useRequisitionDetails);
const {  applicantId, applicant, job, vacancyNumbers, motiveCreation } = storeToRefs(useRequisition);
const { user } = storeToRefs(useAuth);
const { jobId, jobFunctions, jobSkills, englishLevel, educationRequired, experience, extraHours, travelAvailability } = storeToRefs(useJob);

onMounted(() => {

    if(!showingDetails.value){
        newCreation();
    }else{
        showRequisitionDetails();
    }
    
})

const showRequisitionDetails = () => {  

    selectedApplicant.value = applicantDetails.value;
    motiveCreation.value = requisitionData.value.motiveCreation;
    fetchJobDataDetails()
}

const newCreation = () => {
    selectedApplicant.value = applicant.value;
    selectedJob.value = job.value;

    if (applicant.value === "") {
        fetchDefaultApplicant();
    }

    fetchApplicants();
    fetchJobs();
    setDefaultJobValues();
}


const fetchDefaultApplicant = async () => {

    try {
        const request = await axios.get(`/personal/id/${user.value.personalId}`);
        if (request.status === 200) {
            applicantId.value = request.data.id; 
            selectedApplicant.value = request.data.name;
            applicant.value = selectedApplicant.value;
        }
    } catch (error) {
        console.error('Error fetching default applicant: ', error)
    }
}

const fetchApplicants = async () => {
    try {
        const request = await axios.get("/personal");
        if (request.status === 200) {
            applicants.value = request.data;
        }
    } catch (error) {
        console.error('Error fetching applicants: ', error)
    }
}

const fetchJobs = async () => {

    const departmentId = applicantId.value != 0 ? applicantId.value : user.value.personalId;

    try {
        isFetchingJobs.value = true;
        const request = await axios.get(`/puestos/departamento/${departmentId}`);
        if (request.status === 200) {
            jobs.value = request.data;
        }else{
            console.log(request.status)
        }
    } catch (error) {
        console.error('Error fetching applicants: ', error)
    }finally{
        isFetchingJobs.value = false;
    }
}

const fetchJobData = async () => {

    try {
        const request = await axios.get(`/puestos/buscar/${selectedJob.value.id}`);
        if (request.status === 200) {
            console.log(request.data)
            jobId.value = request.data.id;
            jobFunctions.value = request.data.functions;
            jobSkills.value = request.data.skills;

            englishLevel.value = request.data.englishLevel;
            extraHours.value = request.data.extraHours;
            travelAvailability.value = request.data.travelAvailability;
            educationRequired.value = request.data.education;
            experience.value = request.data.experience;

            jobFunctionsRequired.value = request.data.functions;
            jobSkillsRequired.value = request.data.skills;
        }
    } catch (error) {
        console.error('Error fetching applicants: ', error)
    }
}

const fetchJobDataDetails = async () => {
    try {
        const request = await axios.get(`/puestos/buscar/${jobDetails.value}`);
        if (request.status === 200) {

            jobFunctionsRequired.value = request.data.functions;
            jobSkillsRequired.value = request.data.skills;
            selectedJob.value = request.data;

        }
    } catch (error) {
        console.error('Error fetching applicants: ', error)
    }
}

const resetJobData = () => {
    jobFunctions.value = "";
    jobSkills.value = "";
    englishLevel.value = "";
    educationRequired.value = "";
    experience.value = "";
    selectedJob.value = "Puesto Solicitado"; 
    extraHours.value = 0;
    travelAvailability.value = 0;
    
    jobSkillsRequired.value = "";
    jobFunctionsRequired.value = "";
}

const setDefaultJobValues = () => {
    jobFunctionsRequired.value = jobFunctions.value;
    jobSkillsRequired.value = jobSkills.value;
}



//Previene que se puedan pegar datos no numericos
const onNoVacancyPaste = (event) => {
    const clipboardData = event.clipboardData || window.clipboardData;
    const pastedData = clipboardData.getData('text/plain');
    if (isNaN(pastedData)) {
        event.preventDefault();
    }
}

const handleSelectedApplicant = async (selectedItem) => {

    try {
        const requestApplicantId = await axios.get(`/personal/nombre/${selectedItem}`);
        if (requestApplicantId.status === 200) {
            selectedApplicant.value = selectedItem;
            applicant.value = selectedApplicant.value;
            applicantId.value = requestApplicantId.data.id
            resetJobData();
            fetchJobs();   
        }

    } catch (error) {
        console.error('Error fetching applicants: ', error)
    }
}

const handleSelectedJob = (selectedItem) => {

    selectedJob.value = selectedItem;
    job.value = selectedJob.value;

    fetchJobData();
}





</script>
  
<style scoped>
    .pagination {
    padding-left: 92%;
    padding-bottom: 5%
}

.rounded-borders {
    border-radius: 15px;
    background-color: #FFFFFF;
}

.requisition-content {
    background-color: #313131;
    height: 100%;
    padding-top: 2%;
}

.motive-content {
    background-color: #FFFFFF;
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
    border-color: #FFFFFF;
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
    background-color: #FFFFFF;
    overflow-y: scroll;
}
</style>
  