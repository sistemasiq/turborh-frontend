<template>
  <q-layout style="background-color: rgb(30, 61, 88)">
    <q-card flat bordered class="rounded-borders">
      <q-card-section class="title"> Aviso de privacidad </q-card-section>

      <q-card-section>
        <PaginationApplication :page="12"></PaginationApplication>
      </q-card-section>
      <q-card-section class="q-ma-xl center">
        <q-btn
          color="cyan-5"
          icon="policy"
          label="VER EL AVISO DE PRIVACIDAD"
          @click.prevent="createReport()"
        />
        <q-card-actions>
          <q-checkbox
            class="text-white q-mt-xl"
            keep-color
            color="cyan"
            :disable="!seeOnce"
            v-model="accept"
            label="Estoy de acuerdo con el aviso de privacidad."
          >
          <Tooltip v-if="!seeOnce" :text="'Debes ver primero el aviso de privacidad.'" />
        </q-checkbox>
        </q-card-actions>
      </q-card-section>
    </q-card>

    <ButtonApplicationStatus v-if="accept" />
    <q-dialog maximized v-model="showReport">
      <q-card class="no-scroll">
        <q-card-actions class="bg-white" align="right">
          <q-btn flat icon="close" label="Cerrar" color="red" v-close-popup />
        </q-card-actions>
        <object
          height="100%v"
          width="100%"
          v-if="reportSrc.length > 0"
          :data="reportSrc"
          type="application/pdf"
        >
          <iframe :src="reportViewLink"></iframe>
        </object>
      </q-card>
    </q-dialog>
  </q-layout>
</template>

<script setup>
import { ref } from "vue";
import Tooltip from "src/components/Tooltip.vue";
import ButtonApplicationStatus from "src/components/ButtonApplicationStatus.vue";
import PaginationApplication from "src/components/PaginationApplication.vue";
import { useQuasar } from "quasar";
import { createLegalTermsReport } from "src/services/report";

const accept = ref(false);
const $q = useQuasar();

const showReport = ref(false);
const reportSrc = ref("");
const reportViewLink = ref(reportSrc.value);

const seeOnce = ref(false);


const createReport = async () => {
  try {
    $q.loading.show({ message: "Abriendo los términos y condiciones..." });

    const report = await createLegalTermsReport();
    if (report) {
      reportSrc.value = report;
      showReport.value = true;
      seeOnce.value = true;
    }
  } catch (error) {
    console.log(error);
  } finally {
    $q.loading.hide();
  }
};
</script>

<style scoped>
.title {
  font-size: large;
  color: rgb(40, 55, 68);
}

.q-card {
  border-radius: 10px;
  vertical-align: top;
  background: rgba(49, 49, 49, 0.473) 51%;
  position: relative;
  height: 75%;
  width: 75%;
  margin-left: 23.5%;
  margin-top: 2%;
}

.rounded-borders {
  border-radius: 15px;
  background-color: rgba(49, 49, 49, 0.473) 51%;
}

.personaldata-background {
  width: 100%;
  height: 100%;
}
</style>
