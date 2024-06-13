<template>
  <q-page-sticky position="bottom-right" :offset="[18, 18]">
    <q-btn
      size="lg"
      color="green-5"
      icon="update"
      label="ACTUALIZAR"
      @click.prevent="openConfirmation = true"
    />
  </q-page-sticky>

  <q-dialog v-model="openConfirmation" persistent>
    <q-card rounded style="border-radius: 30px">
      <q-card-section class="row items-center">
        <span class="q-ml-sm text-h6 text-weight-regular">
          ¿Quieres actualizar esta requisición?
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
          @click.prevent="updateRequisition()"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { notifyPositive, notifyNegative } from "src/utils/notifies";
import { useQuasar } from "quasar";
import { useRequisitionDetailsStore } from "src/stores/requisitionDetails";
import { storeToRefs } from "pinia";
import router from "src/router";
import { ref } from "vue";

const openConfirmation = ref(false);

const props = defineProps(["pageOneData", "pageTwoData"])

const $q = useQuasar();
const useRequisitionDetails = useRequisitionDetailsStore();

const { updatingRequisition } = storeToRefs(useRequisitionDetails);

const updateRequisition = () => {
  const newRequisitionData = {
    createdBy: 17,
    personalId: 17,
    jobId: 64,
    numRequisition: 39,
    vacancyNumber: 3,
    motiveCreation: "S",
    travelAvailability: 1,
    age: 25,
    gender: "M",
    civilStatus: "C",
    observations: "Observaciones actualizadas",
    conditions: "Condiciones actualizadas",
  };

  updatingRequisition.value = false;
  router.replace("/home/historial-requisiciones");

  $q.notify(notifyPositive("Su requisición ha sido actualizada correctamente."))
};
</script>
