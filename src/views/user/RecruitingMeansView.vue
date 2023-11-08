<template>
  <q-layout
    style="background-color: rgb(30, 61, 88)"
    v-on:vnode-unmounted="saveLocalStore()"
  >
    <q-card>
      <q-card-section class="tittle"> Medios de reclutamiento </q-card-section>
      <q-card-section>
        <pagination-application :page="5" :required-fields="requiredFieldsOnThisPage"></pagination-application>

        <div style="margin-top: 6%">

          <q-card
            bordered
            class="bg-yellow-2 q-mb-lg"
            style="margin-left: 1%"
          >
            <q-card-section class="q-mb-xl" >
              <div class="text-h5 text-weight-medium row">
                <q-icon name="warning" class="q-mr-md q-mt-xs" />
                Nota
              </div>
              <div class="text-body1 text-justify">
                Solo seleccione unicamente si necesita alguna de las siguientes
                opciones, de lo contrario no seleccioe nada.
              </div>
            </q-card-section>
          </q-card>

          <q-form class="q-gutter-md">
            <q-input
              dark
              outlined
              color="cyan-1"
              v-model="medium"
              type="text"
              label="Por qué medio o persona llegó a solicitarnos empleo *"
              label-color="white"
              lazy-rules
              :rules="[
                (value) => !!value || 'Este campo no puede estar vacío.',
              ]"
              :readonly="viewingApplication"
              class="input-brand"
              @update:model-value="updateStore()"
            >
            </q-input>

            <div class="home-content rounded-borders" style="display: flex">
              <div class="home-content rounded-borders" style="display: flex">
                <q-checkbox
                  v-model="isCheckedFamiliar"
                  @update:model-value="updateStore()"
                  color="cyan"
                  unchecked-icon="radio_button_unchecked"
                  checked-icon="radio_button_checked"
                  size="lg"
                  class="checkbox"
                  label="Trabaja con nosotros algún familiar de usted"
                  style="color: black"
                  :disable="viewingApplication"
                >
                </q-checkbox>
              </div>
            </div>
            <q-input
              dark
              outlined
              v-if="isCheckedFamiliar"
              color="cyan-1"
              v-model="relative"
              type="text"
              label="¿Quién?"
              label-color="white"
              lazy-rules
              :rules="[
                (value) => !!value || 'Este campo no puede estar vacío.',
              ]"
              :readonly="viewingApplication"
              class="input-brand"
              @update:model-value="updateStore()"
            >
            </q-input>

            <div class="home-content rounded-borders" style="display: flex">
              <div class="home-content rounded-borders" style="display: flex">
                <q-checkbox
                  v-model="isCheckedDepartment"
                  @update:model-value="updateStore()"
                  color="cyan"
                  unchecked-icon="radio_button_unchecked"
                  checked-icon="radio_button_checked"
                  size="lg"
                  class="checkbox"
                  label="¿Trabajó con nosotros anteriormente?"
                  style="color: black"
                  :disable="viewingApplication"
                ></q-checkbox>
              </div>
            </div>
            <q-input
              dark
              outlined
              v-if="isCheckedDepartment"
              color="cyan-1"
              v-model="department"
              type="text"
              label="¿En que departamento?"
              label-color="white"
              lazy-rules
              :rules="[
                (value) => !!value || 'Este campo no puede estar vacío.',
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
              v-model="sindicate"
              type="text"
              label="¿A cuántos sindicatos pertenece o ha pertenecido?"
              label-color="white"
              class="input-brand"
              :readonly="viewingApplication"
              @update:model-value="updateStore()"
            >
            </q-input>
          </q-form>
        </div>
        <q-btn
          v-if="!viewingApplication && !updatingApplication"
          class="btn-clean q-mt-xl"
          rounded
          text-color="white"
          color="red-5"
          label="Limpiar"
          icon="cleaning_services"
          @click.prevent="clean"
        />
      </q-card-section>
    </q-card>
    <ButtonApplicationStatus v-if="updatingApplication" />
  </q-layout>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import { useRequestUser } from "src/stores/requestUser";
import { useLocalStorageStore } from "src/stores/localStorage";
import { storeToRefs } from "pinia";
import PaginationApplication from "src/components/PaginationApplication.vue";
import ButtonApplicationStatus from "src/components/ButtonApplicationStatus.vue";
import { notifyPositive } from "src/utils/notifies";
import { useQuasar } from "quasar";

const $q = useQuasar();
const useRequest = useRequestUser();
const useLocalStorage = useLocalStorageStore();

const isCheckedFamiliar = ref(false);
const isCheckedDepartment = ref(false);

const medium = ref("");
const relative = ref("");
const department = ref("");
const sindicate = ref("");

const {
  recruitingMeansData,
  savedApplication,
  viewingApplication,
  updatingApplication,
} = storeToRefs(useRequest);


const requiredFieldsOnThisPage = computed(() => [medium.value])

onMounted(() => {
  loadLocalStore();

  if (viewingApplication.value) {
    setSavedStoredValues();
  } else {
    setStoredValues();
  }
});

const setSavedStoredValues = () => {
  medium.value = savedApplication.value.medio_reclutamiento;
  relative.value = savedApplication.value.familiar_en_turbomaquinas;
  department.value = savedApplication.value.familiar_departamento;
  sindicate.value = savedApplication.value.sindicato;
  isCheckedFamiliar.value = relative.value ? true : false;
  isCheckedDepartment.value = department.value ? true : false;
};

const setStoredValues = () => {
  medium.value = recruitingMeansData.value.medium;
  relative.value = recruitingMeansData.value.relative;
  department.value = recruitingMeansData.value.department;
  sindicate.value = recruitingMeansData.value.sindicate;
  isCheckedFamiliar.value = recruitingMeansData.value.isCheckedFamiliar;
  isCheckedDepartment.value = recruitingMeansData.value.isCheckedDepartment;
};

const updateStore = () => {
  if (viewingApplication.value) return;

  recruitingMeansData.value.medium = medium.value;
  recruitingMeansData.value.relative = isCheckedFamiliar.value
    ? relative.value
    : "";
  recruitingMeansData.value.department = isCheckedDepartment.value
    ? department.value
    : "";
  recruitingMeansData.value.sindicate = sindicate.value;
  recruitingMeansData.value.isCheckedFamiliar = isCheckedFamiliar.value;
  recruitingMeansData.value.isCheckedDepartment = isCheckedDepartment.value;
};

const clean = () => {
  medium.value = "";
  relative.value = "";
  department.value = "";
  sindicate.value = "";
  isCheckedFamiliar.value = false;
  isCheckedDepartment.value = false;
};

const saveLocalStore = () => {
  useLocalStorage.save("recruitingMeansData", recruitingMeansData.value);
  if (!viewingApplication.value && !updatingApplication.value) {
    $q.notify(notifyPositive("Se ha guardado su progreso.",1000));
  }
};

const loadLocalStore = () => {
  console.log(useLocalStorage.load("recruitingMeansData"));
  const localStoreData = useLocalStorage.load("recruitingMeansData");

  if (localStoreData) recruitingMeansData.value = localStoreData;
};
</script>

<style scoped>
.btn-clean {
  text-align: center;
  width: 10%;
  margin-left: 90%;
}

.rounded-borders {
  border-radius: 15px;
  background-color: #ffffff;
}

.home-content {
  background-color: #ffffff;
  height: 10%;
  width: 100%;
}

.tittle {
  background: rgb(255, 255, 255);
  font-size: large;
  color: rgb(40, 55, 68);
  border-radius: 25%;
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

.card-frontpage {
  display: relative;
  justify-content: center;
  align-items: center;
}
</style>
