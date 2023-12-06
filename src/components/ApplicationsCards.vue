<template>
   <div class="column">
    <p class="text-h4 q-ml-xl text-grey-8">
              <strong> {{ getTitleApplications() }} </strong>
              <q-spinner
                v-if="loadingApplications"
                class="q-ml-lg"
                color="grey"
                :thickness="5"
              />
   </p>
  <div class="row">
    <q-card
    v-for="(item, index) in currentApplications"
    :key="index"
    horizontal
    class="q-ml-lg bg-dark text-white"
    style="border-radius: 30px;"
  >
    <q-btn
      class="absolute-top-right bg-red"
      flat
      style="border-radius: 0 30px 0 30px"
      icon="delete"
      @click.prevent="openDeleteApplicationDialog(item.requisitionId)"
    />
    <img
      :src="getS3FileUrl(getDefaultPath(item.jobUUID, getJobImagesPath), getDefaultJobUUID(item.jobUUID))"
      style="max-width: 100%; max-height: 260px; border-radius: 30px 30px 0 0"
    />
    <q-card-section>
      <p class="text-h6">{{ item.jobName }}</p>
      <p class="text-body1">
        Estado: {{ checkStatusApplication[item.status] }}
        <q-icon
          name="circle"
          :color="checkStatusApplicationColor[item.status]"
        />
      </p>
    </q-card-section>
    <q-dialog v-model="showDeleteApplicationDialog">
      <q-card style="border-radius: 30px">
        <q-card-section class="row items-center">
          <q-avatar
            icon="mdi-alert"
            color="red"
            text-color="white"
            size="30px"
          />
          <span class="q-ml-sm" style="font-family: 'arial'; font-size: large">
            ¿Deseas eliminar tu solicitud a esta vacante?</span>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn
            flat
            label="Eliminar"
            v-close-popup
            @click.prevent="disableApplication()"
            style="
              background: rgb(245, 77, 77);
              color: rgb(255, 255, 255);
              border-radius: 30px;
            "
          />
          <q-btn flat label="Cancelar" color="primary" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-card>
  </div>
   </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useAuthStore } from "src/stores/auth";
import { storeToRefs } from "pinia";
import { useQuasar } from "quasar";
import { getS3FileUrl } from "src/services/profiles.js";
import { getDefaultJobUUID, getDefaultPath, getJobImagesPath } from "src/utils/folderPaths";
import { useLocalStorageStore } from "src/stores/localStorage";
import { notifyNegative, notifyPositive } from "src/utils/notifies";
import { getCandidateJobs, disableCandidate } from "src/services/candidates";

const $q = useQuasar();
const useAuth = useAuthStore();
const useLocalStorage = useLocalStorageStore();

const { user } = storeToRefs(useAuth);


const showDeleteApplicationDialog = ref(false);

const loadingApplications = ref(false);

const currentRequisitionId = ref(null);
const currentApplications = ref([]);


onMounted(() => {
  loadLocalStorage();
});

const loadLocalStorage = () => {
  const userStored = useLocalStorage.load("user");

  if(userStored){
    user.value = userStored;
  }

  fetchApplications();

}


const getTitleApplications = () => {

  if(loadingApplications.value){
    return 'Cargando aplicaciones'
  }

  return currentApplications.value.length > 0 ? 'Mis solicitudes' : 'Sin solicitudes'

}

const openDeleteApplicationDialog = (requisitionId) => {
  currentRequisitionId.value = requisitionId;
  showDeleteApplicationDialog.value = true;
}

const fetchApplications = async () => {

  if(!user.value)
  return;

  currentApplications.value = [];
  try {

    loadingApplications.value = true;

    const candidateJobs = await getCandidateJobs(user.value.id);

    if (candidateJobs) {
      for (let i = 0; i < candidateJobs.length; i++) {
        if (candidateJobs[i].active === 1) {
          currentApplications.value.push(candidateJobs[i]);
        }
      }
    }
  } catch (error) {
    console.log(error);
  } finally{
    loadingApplications.value = false;
  }
};

const checkStatusApplication = {
  "P" : "Pendiente",
  "E" : "Entrevistado",
  "C" : "Citado"
}


const checkStatusApplicationColor = {
  "P": "grey",
  "E": "green",
  "C": "blue"
}

const disableApplication = async () => {
  try {
    const disabled = await disableCandidate(currentRequisitionId.value, user.value.id);

    if (disabled) {
      $q.notify(notifyPositive("Se ha eliminado tu solicitud a esta vacante correctamente"));
      currentRequisitionId.value = null;
      fetchApplications();
    } else {
      $q.notify(notifyNegative("Hubo un error al eliminar tu solicitud a esta vacante."));
    }
  } catch (error) {
    $q.notify(notifyNegative("Hubo un error al eliminar tu solicitud a esta vacante."));
    console.log(error)
  }
};
</script>

<style scoped>
.my-card {
  max-width: 360px;
  max-height: 380px;
  border-radius: 30px;
  color: #ffffff;
  background: #050606;
  font-family: Arial;
  margin-top: 15px;
}
</style>
