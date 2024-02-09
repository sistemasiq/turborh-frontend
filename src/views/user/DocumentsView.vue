<template>
  <q-layout
    style="background-color: rgb(30, 61, 88)"
    v-on:vnode-unmounted="saveLocalStore()"
  >
    <q-card flat bordered class="rounded-borders">
      <q-card-section class="title"> Documentos </q-card-section>

      <q-card-section class="content">
        <pagination-application :page="4" :required-fields="updatingApplication ? requiredFieldsOnThisPageUpdating : requiredFieldsOnThisPage" />
        <div style="margin-top: 6%">
          <q-card flat bordered text-color="white"
  class="q-mb-lg"
  style="margin-left: 0%; border-color: rgb(255, 248, 43);
  background-color: transparent; color: white; width: 100%; height: 80px;"
  v-if="!viewingApplication"
>
  <q-card-section>
    <div class="text-body1 text-weight-medium row">
      <q-icon name="warning" class="q-mr-md q-mt-xs" />
      Nota
    </div>
    <p class="text-body2">
     Es obligatorio adjuntar su curriculum, así como llenar los campos del RFC y NSS
    </p>
  </q-card-section>
</q-card>
          <q-form class="q-gutter-md">
            <q-input
              hint="Ejemplo del formato del RFC: ABCE123456789"
              hide-hint
              dark
              outlined
              color="cyan-1"
              v-model="rfc"
              type="text"
              label="RFC *"
              mask="XXXXXXXXXXXXX"
              label-color="white"
              lazy-rules
              :rules="[
                (value) => !!value || 'La clave RFC es requerida',
                (value) =>
                  /^[A-ZÑ&]{3,4}(\d{6})[A-Z\d]{3}$/.test(value) ||
                  'La clave RFC debe ser válida',
              ]"
              :readonly="viewingApplication"
              class="input-brand"
              @update:model-value="updateStore()"
            >
            </q-input>

            <q-input
              dark
              outlined
              color="cyan-1"
              v-model="imss"
              type="text"
              label="Número de IMSS (NSS) *"
              label-color="white"
              mask="###########"
              lazy-rules
              :rules="[
                (value) => !!value || 'El IMSS es requerido',
                (value) =>
                  /^[0-9]{11}$/.test(value) || 'El IMSS debe ser válido',
              ]"
              :readonly="viewingApplication"
              class="input-brand"
              @update:model-value="updateStore()"
            >
            </q-input>

            <q-input
              dark
              outlined
              color="cyan-1"
              v-model="afore"
              type="text"
              label="AFORE"
              label-color="white"
              mask="###########"
              lazy-rules
              :rules="[
                (value) =>
                  /^[0-9]{11}$/.test(value) || 'La clave AFORE debe ser válida',
              ]"
              :readonly="viewingApplication"
              class="input-brand"
              @update:model-value="updateStore()"
            >
            </q-input>

            <q-input
              dark
              outlined
              color="cyan-1"
              v-model="fm2"
              type="text"
              label="Si es extranjero ingrese su número FM2"
              label-color="white"
              class="input-brand"
              :readonly="viewingApplication"
              @update:model-value="updateStore()"
            >
            </q-input>

            <div
              style="
                padding-left: 5px;
                position: relative;
                display: flex;
                align-items: center;
              "
            >
              <q-file
              :disable="viewingApplication"
                v-model="curriculumStored"
                max-files="1"
                accept=".pdf"
                filled
                bg-color="teal-14"
                label-color="white"
                use-chips
                @rejected="onRejectedFile"
                :label="curriculumStored ? 'Curriculum adjuntado' : 'Adjuntar curriculum  *'"
                class="q-mb-md"
              >
                <template v-slot:prepend>
                  <q-icon name="upload" color="white"/>
                </template>
                <q-tooltip
                v-if="curriculumStored"
                class="bg-dark text-white text-body2"
                anchor="top middle"
                self="center middle"
                transition-show="slide-up"
                transition-hide="fade"
                :delay="300"
                transition-duration="300"
                :offset="[10, 25]"
              >
                ¿Cambiar curriculum adjuntado?
              </q-tooltip>
              </q-file>
            </div>
          </q-form>
        <TableDriverLicenses/>
        </div>
      </q-card-section>
    </q-card>
    <ButtonApplicationStatus v-if="updatingApplication" :required-fields="requiredFieldsOnThisPageUpdating"/>
  </q-layout>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import { useQuasar } from "quasar";
import { useRequestUser } from "src/stores/requestUser";
import { useLocalStorageStore } from "src/stores/localStorage";
import { storeToRefs } from "pinia";
import PaginationApplication from "src/components/PaginationApplication.vue";
import ButtonApplicationStatus from "src/components/ButtonApplicationStatus.vue";
import TableDriverLicenses from "src/components/TableDriverLicenses.vue";
import { notifyNegative, notifyPositive } from "src/utils/notifies";


const useRequest = useRequestUser();
const useLocalStorage = useLocalStorageStore();

const $q = useQuasar();
const rfc = ref("");
const imss = ref("");
const afore = ref("");
const fm2 = ref("");

const requiredFieldsOnThisPage = computed(() => [rfc.value, imss.value, curriculumStored.value])
const requiredFieldsOnThisPageUpdating = computed(() => [rfc.value, imss.value])

const {
  documentsData,
  savedApplication,
  viewingApplication,
  updatingApplication,
  curriculumStored
} = storeToRefs(useRequest);

onMounted(() => {
  if (viewingApplication.value || updatingApplication.value) {
    setSavedStoredValues();
  } else {
    loadLocalStore();
    setStoredValues();
  }
});

const setSavedStoredValues = () => {
  rfc.value = savedApplication.value.rfc;
  imss.value = savedApplication.value.numero_imss;
  afore.value = savedApplication.value.numero_afore;
  fm2.value = savedApplication.value.extranjero_numero_fm2;
};

const setStoredValues = () => {
  rfc.value = documentsData.value.rfc;
  imss.value = documentsData.value.imss;
  afore.value = documentsData.value.afore;
  fm2.value = documentsData.value.fm2;

};

const updateStore = () => {
  if (viewingApplication.value) return;
  documentsData.value.rfc = rfc.value;
  documentsData.value.imss = imss.value;
  documentsData.value.afore = afore.value;
  documentsData.value.fm2 = fm2.value;

};


const onRejectedFile = () => {
  $q.notify(notifyNegative("Solo se aceptan archivos .pdf"));
};


const saveLocalStore = () => {
  useLocalStorage.save("documentsData", documentsData.value);
  if (!viewingApplication.value && !updatingApplication.value) {
    $q.notify(notifyPositive("Se ha guardado su progreso.",1000));
  }
};

const loadLocalStore = () => {
  const localStoreData = useLocalStorage.load("documentsData");

  if (localStoreData) documentsData.value = localStoreData;
};


</script>

<style scoped>
.rounded-borders {
  border-radius: 15px;
}
.content {
  height: 100%;
  background-color: rgb(40, 55, 68);
  padding-top: 2%;
}

.btn-adjuntar {
  background: rgba(126, 231, 231) 79%;
  text-align: center;
  height: 20%;
  width: 20%;
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

.title {
  font-size: large;
  color: rgb(40, 55, 68);
}
</style>
