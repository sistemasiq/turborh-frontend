<template>
   <div class="column">
    <p class="text-h3" style="color: rgb(83, 83, 83); margin-left: 58px; font-family: 'Arial'; font-size: 40px;">
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
    class="my-card q-ml-lg qmt"
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
        Estado: {{ checkStatusApplication(item.active, item.selected) }}
        <q-icon
          name="circle"
          :color="checkStatusApplicationColor(item.active, item.selected)"
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
import axios from "axios";
import { useLocalStorageStore } from "src/stores/localStorage";

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

    const request = await axios.get(
      `/candidatos/trabajos/${user.value.id}`
    );

    if (request.status === 200) {
      for (let i = 0; i < request.data.length; i++) {
        if (request.data[i].active === 1) {
          currentApplications.value.push(request.data[i]);
        }
      }
    }
  } catch (error) {
    console.log(error);
  } finally{
    loadingApplications.value = false;
  }
};

const checkStatusApplication = (active, selected) => {
  if (active === 0) {
    return "Rechazada";
  }
  return selected === 1 ? "Aceptada" : "En revisión";
};

const checkStatusApplicationColor = (active, selected) => {
  if (active === 0) {
    return "red";
  }
  return selected === 1 ? "green" : "grey";
};

const disableApplication = async () => {
  try {
    const request = await axios.put(
      `/candidatos/desactivar/usuarioId/${user.value.id}/requisicionId/${currentRequisitionId.value}`
    );

    if (request.status === 201) {
      $q.notify({
        type: "positive",
        message:
          "<p style='font-size:medium;' class='q-mt-md'>Se ha eliminado tu solicitud a esta vacante.</p>",
        timeout: 2000,
        progress: true,
        html: true,
      });
      currentRequisitionId.value = null;
      fetchApplications();
    } else {
      $q.notify({
        type: "negative",
        message:
          "<p style='font-size:medium;' class='q-mt-md'>Hubo un error al eliminar tu solicitud a esta vacante.</p>",
        actions: [{ label: "CERRAR", color: "yellow" }],
        progress: true,
        html: true,
      });
      console.log(request.status);
    }
  } catch (error) {
    $q.notify({
      type: "negative",
      message:
        "<p style='font-size:medium;' class='q-mt-md'>Hubo un error al eliminar tu solicitud a esta vacante.</p>",
      actions: [{ label: "CERRAR", color: "yellow" }],
      progress: true,
      html: true,
    });
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
