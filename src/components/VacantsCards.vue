<template>
  <q-card
  horizontal
  class="my-card q-ml-lg"
  v-for="(item, index) in currentVacants"
  >
    <div
  class="absolute-right text-body2"
  style="
    background: rgb(215, 86, 86);
        width: 160px;
        height: 30px;
        border-radius: 0 30px 0 30px;
        color: rgb(255, 255, 255);
    ">
     <p class="q-ml-md q-mt-xs">Num.Vacantes: {{ item.vacancyNumber }}</p>
    </div>
    <img
      :src="getS3FileUrl(getJobImagesPath, getDefaultJobUUID(item.jobUUID))"
      style="max-width: 100%; max-height: 260px; border-radius: 30px 30px 0 0"
    />
    <q-card-section>
      <div class="text-h6">{{ item.jobName }}</div>
      <div class="text-h6">
       <q-btn
       label="Detalles"
       @click.prevent="fetchJobDetails(item.jobId, item.id)"
       unelevated
       flat
       style="
       background: rgb(255, 255, 255);
       color: rgb(0, 0, 0);
       border-radius: 15px;
       height: 30px;
       "
       />
      </div>
    </q-card-section>
    <q-dialog
          full-width
          full-height
          v-model="showJobDetails"
          class="q-mr-xl"
        >
          <q-card class="dialog-card">
            <q-img
            :src="getS3FileUrl(getDefaultPath(jobDetails ? jobDetails.photo_uuid : null, getJobImagesPath), getDefaultJobUUID(jobDetails ? jobDetails.photo_uuid : null))"
              spinner-color="white"
              class="full-width q-pt-md"
              style="height: 25%; border-radius: 30px"
            />
            <q-card-section>
              <q-btn
                color="red"
                size="lg"
                flat
                icon="close"
                class="absolute-right"
                v-close-popup
              ></q-btn>
            </q-card-section>

            <q-card-section class="row items-center">
              <p class="q-ml-xl text-h4">{{ jobDetails ? jobDetails.name : "" }}</p>
              <q-btn
              :disable="isCandidate"
              :color = "isCandidate ? 'grey': 'cyan'"
              rounded
              icon="send"
              label="Aplicar"
              class="q-ml-xl q-mb-sm"
              @click.prevent="showApplyToVacant = true" />
            </q-card-section>

            <q-card-section>
              <div class="q-ml-xl">
                <p class="text-h5 text-weight-regular">Función principal</p>
                <p class="text-h6 text-weight-regular">
                  {{ jobDetails ? jobDetails.mainFunction : "" }}
                </p>
              </div>
            </q-card-section>
            <div
              style="display: flex; justify-content: space-between"
              class="q-mb-xl"
            >
              <q-card flat bordered class="job-requirements">
                <q-card-section style="background-color: #151515">
                  <p class="text-h6 text-weight-regular">
                    Funciones del puesto
                  </p>
                </q-card-section>
                <q-card-section class="bg-white text-black">
                  <p class="text-h6 text-weight-regular text-left">
                    <ul v-if="jobDetails" style="list-style: none;">
                      <li v-for="jobFunction in jobDetails.functions.split('\n')" :key="index">{{ jobFunction }}</li>
                    </ul>
                  </p>
                </q-card-section>
              </q-card>
              <q-card flat bordered class="job-requirements">
                <q-card-section style="background-color: #151515">
                  <p class="text-h6 text-weight-regular">
                    Habilidades y/o conocimientos
                  </p>
                </q-card-section>
                <q-card-section class="bg-white text-black">
                  <p class="text-left text-h6 text-weight-regular">
                    <ul v-if="jobDetails" style="list-style: none;">
                      <li v-for="skill in jobDetails.skills.split('\n')" :key="index">{{ skill }}</li>
                    </ul>
                  </p>
                </q-card-section>
              </q-card>
            </div>
          </q-card>
        </q-dialog>
        <q-dialog v-model="showApplyToVacant" persistent>
    <q-card rounded>
      <q-card-section class="row items-center">
        <span class="q-ml-sm text-h6 text-weight-regular">
          ¿Deseas aplicar a esta vacante?</span
        >
      </q-card-section>

      <q-card-actions align="center">
        <q-btn
          rounded
          flat
          label="Aplicar"
          v-close-popup
          class="bg-cyan text-white"
          @click.prevent = "fetchAddCandidate(currentRequisitionId)"
        />
        <q-btn flat label="Cancelar" color="primary" v-close-popup />
      </q-card-actions>
    </q-card>
  </q-dialog>
  </q-card>


</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useQuasar } from "quasar";
import { useAuthStore } from "src/stores/auth";
import { storeToRefs } from "pinia";
import { getDefaultJobUUID, getDefaultPath, getJobImagesPath } from "src/utils/folderPaths";
import { getS3FileUrl } from "src/services/profiles.js";
import { getRequisitionsByState } from "src/services/requisition";
import { getJobById } from "src/services/jobs";
import { createCandidate, candidateExists } from "src/services/candidates";
import { notifyNegative, notifyPositive } from "src/utils/notifies";

const useAuth = useAuthStore();
const router = useRouter();

const showJobDetails = ref(false);

const showApplyToVacant = ref(false);

const jobDetails = ref();

const $q = useQuasar();

const currentRequisitionId = ref(null);
const isCandidate = ref(false);

const { user } = storeToRefs(useAuth);

const currentVacants = ref([]);

onMounted(() => {
  fetchVacants();
});



const fetchVacants = async () => {
  try {
    $q.loading.show({message: "Cargando vacantes..."})

    const requisitions = await getRequisitionsByState("P");

    if (requisitions) {
      currentVacants.value = requisitions;
      if(requisitions.length === 0){
        router.replace("/userHome/sin-vacantes")
      }
    }
  } catch (error) {
    console.log(error);
  } finally{
    $q.loading.hide();
  }
};

const fetchJobDetails = async (jobId, itemId) => {
  showJobDetails.value = true;
  currentRequisitionId.value = itemId;
  jobDetails.value = null;
  try {

    const job = await getJobById(jobId);

    if (job) {
      jobDetails.value = job;
    }
  } catch (error) {
    console.log(error);
  }finally{
    fetchCandidate(itemId);
  }
};


const fetchAddCandidate = async (requisitionId) => {

  const candidate = {
    "userId" : user.value.id,
    "requisitionId" : requisitionId
  }


  try {
    const candidateCreated = await createCandidate(candidate);

    if(candidateCreated){
      showJobDetails.value = false;
  $q.notify(notifyPositive("Has aplicado a este puesto correctamente."));
    }

  } catch (error) {
    console.log("Error adding candidate "+error);
    $q.notify(notifyNegative("Hubo un error al aplicar a este puesto, intenta de nuevo."));
    }
  }


  const fetchCandidate = async (requisitionId) => {


try {
  const candidate = await candidateExists(requisitionId, user.value.id)
  console.log(candidate);
  if(candidate){
    isCandidate.value = true;
  }else{
    isCandidate.value = false;
  }

} catch (error) {
  console.log("Error fetching candidate "+error);
}
  }



</script>

<style scoped>
.my-card {
  max-height: 380px;
  border-radius: 30px;
  color: #ffffff;
  background: #050606;
  font-family: Arial;
  margin-top: 25px;
}
.delete-button:not(.q-btn-icon):hover {
  background-color: rgb(215, 86, 86);
}
.job-requirements {
  margin-top: 1%;
  width: 50%;
  height: 100%;
  margin-left: 3%;
  margin-right: 3%;
  border-radius: 15px;
  color: #ffffff;
  text-align: center;
}
.dialog-card{
  border-radius: 30px;
  color: #000000;
  background: #ffffff;
}

.vacants {
  background-color: #ff6060;
  border-bottom-right-radius: 10px;
  border-top-right-radius: 10px;
  border-bottom-left-radius: 25px;
}

.details-button {
  background-color: white;
  height: 50px;
  width: 130px;
  font-size: medium;
}

.card-job {
  width: 30%;
}

.rounded-borders {
  border-radius: 10px;
  background-color: #ffffff;
}

.content {
  background-color: #192c3d;
  height: 100%;
  padding-top: 2%;
}
</style>
