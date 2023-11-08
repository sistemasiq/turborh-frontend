<template>
  <q-layout
    style="background-color: rgb(30, 61, 88)"
    v-on:vnode-unmounted="saveLocalStore()"
  >
    <q-card flat bordered class="rounded-borders">
      <q-card-section class="title"> Información Médica y Situación Socioeconómica </q-card-section>

      <q-card-section>
        <pagination-application :page="3"></pagination-application>
        <div style="margin-top: 6%">
          <q-card
            bordered
            class="bg-yellow-2 q-mb-lg"
            style="margin-left: 0%"
            v-if="!viewingApplication"
          >
            <q-card-section>
              <div class="text-body1 text-weight-medium row">
                <q-icon name="warning" class="q-mr-md q-mt-xs" />
                Nota
              </div>
              <p class="text-body2">
                Solo seleccione unicamente si necesita alguna de las siguientes
                opciones.
              </p>
            </q-card-section>
          </q-card>

          <q-form class="q-gutter-md">
            <div class="rounded-borders">
              <q-checkbox
                v-model="isCheckedDiseases"
                @update:model-value="updateStore()"
                color="cyan"
                unchecked-icon="radio_button_unchecked"
                checked-icon="radio_button_checked"
                size="lg"
                class="checkbox"
                label="Ha sido operado o ha sufrido enfermedades graves o contagiosas (Especifíque)"
                style="color: black"
                :disable="viewingApplication"
              >
              </q-checkbox>
            </div>
            <q-input
              dark
              outlined
              v-if="isCheckedDiseases"
              color="cyan-1"
              v-model="diseases"
              type="text"
              label="Escribe aquí"
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

            <div class="rounded-borders">
              <q-checkbox
                v-model="isCheckedAllergies"
                @update:model-value="updateStore()"
                color="cyan"
                unchecked-icon="radio_button_unchecked"
                checked-icon="radio_button_checked"
                size="lg"
                class="checkbox"
                label="Es alérgico a algún medicamento (Especifique)"
                style="color: black"
                :disable="viewingApplication"
              ></q-checkbox>
            </div>
            <q-input
              dark
              outlined
              v-if="isCheckedAllergies"
              color="cyan-1"
              v-model="allergies"
              type="text"
              label="Escribe aquí"
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

            <div class="rounded-borders">
              <q-checkbox
                v-model="isCheckedCar"
                @update:model-value="updateStore()"
                color="cyan"
                unchecked-icon="radio_button_unchecked"
                checked-icon="radio_button_checked"
                size="lg"
                class="checkbox"
                label="¿Tiene automóvil?"
                style="color: black"
                :disable="viewingApplication"
              ></q-checkbox>
            </div>

            <q-input
              dark
              outlined
              v-if="isCheckedCar"
              color="cyan-1"
              v-model="car"
              type="text"
              label="Marca y modelo"
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

            <div class="rounded-borders">
              <q-checkbox
                v-model="isCheckedIncome"
                @update:model-value="updateStore()"
                color="cyan"
                unchecked-icon="radio_button_unchecked"
                checked-icon="radio_button_checked"
                size="lg"
                class="checkbox"
                label="¿Tiene otros ingresos?"
                style="color: black"
                :disable="viewingApplication"
              ></q-checkbox>
            </div>

            <q-input
              dark
              outlined
              v-if="isCheckedIncome"
              color="cyan-1"
              v-model="incomesConcept"
              type="number"
              label="¿Cuanto son tus ingresos al mes?"
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
          </q-form>

          <div class="column q-pt-md">
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
          </div>
        </div>
      </q-card-section>
    </q-card>
    <ButtonApplicationStatus v-if="updatingApplication" />
  </q-layout>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRequestUser } from "src/stores/requestUser";
import { useLocalStorageStore } from "src/stores/localStorage";
import { storeToRefs } from "pinia";
import PaginationApplication from "src/components/PaginationApplication.vue";
import ButtonApplicationStatus from "src/components/ButtonApplicationStatus.vue";
import { useQuasar } from "quasar";
import { notifyPositive } from "src/utils/notifies";

const $q = useQuasar();

const useRequest = useRequestUser();
const useLocalStorage = useLocalStorageStore();

const isCheckedDiseases = ref(false);
const isCheckedAllergies = ref(false);
const isCheckedCar = ref(false);
const isCheckedIncome = ref(false);

const diseases = ref("");
const allergies = ref("");
const car = ref("");
const incomesConcept = ref(0);

const {
  personalData,
  savedApplication,
  viewingApplication,
  updatingApplication,
} = storeToRefs(useRequest);

onMounted(() => {
  loadLocalStore();
  if (viewingApplication.value) {
    setSavedStoredValues();
  } else {
    setStoredValues();
  }
});

const setSavedStoredValues = () => {
  diseases.value = savedApplication.value.padecimiento;
  allergies.value = savedApplication.value.alergia_medicamento;
  car.value = savedApplication.value.automovil_marca_modelo;
  incomesConcept.value = savedApplication.value.otro_ingreso;
  isCheckedDiseases.value = diseases.value ? true : false;
  isCheckedAllergies.value = allergies.value ? true : false;
  isCheckedCar.value = car.value ? true : false;
  isCheckedIncome.value = incomesConcept.value ? true : false;
};

const setStoredValues = () => {
  diseases.value = personalData.value.diseases;
  allergies.value = personalData.value.allergies;
  car.value = personalData.value.brand;
  incomesConcept.value = personalData.value.incomesConcept;
  isCheckedDiseases.value = personalData.value.isCheckedDiseases;
  isCheckedAllergies.value = personalData.value.isCheckedAllergies;
  isCheckedCar.value = personalData.value.isCheckedCar;
  isCheckedIncome.value = personalData.value.isCheckedIncome;
};

const updateStore = () => {
  if (viewingApplication.value) return;

  personalData.value.diseases = isCheckedDiseases.value ? diseases.value : "";
  personalData.value.allergies = isCheckedAllergies.value
    ? allergies.value
    : "";
  personalData.value.brand = isCheckedCar.value ? car.value : "";
  personalData.value.incomesConcept = isCheckedIncome.value
    ? incomesConcept.value
    : "";
  personalData.value.isCheckedDiseases = isCheckedDiseases.value;
  personalData.value.isCheckedAllergies = isCheckedAllergies.value;
  personalData.value.isCheckedCar = isCheckedCar.value;
  personalData.value.isCheckedIncome = isCheckedIncome.value;
};

const clean = () => {
  diseases.value = "";
  allergies.value = "";
  car.value = "";
  incomesConcept.value = 0;
  isCheckedDiseases.value = false;
  isCheckedAllergies.value = false;
  isCheckedIncome.value = false;
};

const saveLocalStore = () => {
  useLocalStorage.save("personalData", personalData.value);

  if (!viewingApplication.value && !updatingApplication.value) {
    $q.notify(notifyPositive("Se ha guardado su progreso.", 1000));
  }
};

const loadLocalStore = () => {
  console.log(useLocalStorage.load("personalData"));
  const localStoreData = useLocalStorage.load("personalData");

  if (localStoreData) personalData.value = localStoreData;
};
</script>

<style scoped>
.btn-clean {
  text-align: center;
  margin-top: 0%;
  width: 10%;
  margin-left: 90%;
}

.rounded-borders {
  border-radius: 15px;
  background-color: #ffffff;
}

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
</style>
