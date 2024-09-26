<!--This component is used to get the info about driver´s licences of the users-->
<template>
  <div v-on:vnode-unmounted="saveLocalStore()">
    <q-table
      no-data-label="Sin Licencias de Manejo"
      :rows="drivingLicenceData"
      :columns="columns"
      :rows-per-page-options="[0]"
    >
      <template v-slot:body-cell-type="{ row }">
        <q-td>
          <div style="display: flex; flex-grow: 1" class="q-ml-md">
            <q-select
              v-model="row.type"
              :options="licensesTypes"
              label="Tipo de licencia"
              :readonly="viewingApplication"
              outlined
              color="black"
              label-color="black"
              class="full-width"
            />
          </div>
        </q-td>
      </template>
      <template v-slot:body-cell-number="{ row }">
        <q-td>
          <q-input v-model="row.number" :readonly="viewingApplication" />
        </q-td>
      </template>

      <template v-slot:body-cell-expirationDate="{ row }">
        <q-td style="color: rgb(0, 0, 0)">
          <q-input
            v-if="!row.isLicencePermanent"
            label="AAAA/MM/DD"
            v-model="row.expirationDate"
            :readonly="viewingApplication"
            mask="####/##/##"
            lazy-rules
            :rules="[dateRule]"
          >
            <template v-slot:append>
              <q-icon name="event" class="cursor-pointer">
                <q-popup-proxy
                v-if="!viewingApplication"
                  cover
                  transition-show="scale"
                  transition-hide="scale"
                >
                  <q-date
                    :readonly="viewingApplication"
                    v-model="row.expirationDate"
                  >
                    <div class="row items-center justify-end">
                      <q-btn v-close-popup label="Cerrar" flat />
                    </div>
                  </q-date>
                </q-popup-proxy>
              </q-icon>
            </template>
          </q-input>
        </q-td>
      </template>

      <template v-slot:body-cell-isLicencePermanent="{ row }">
        <q-checkbox
          :disable="viewingApplication"
          class="q-mt-md"
          checked-icon="radio_button_checked"
          unchecked-icon="radio_button_unchecked"
          v-model="row.isLicencePermanent"
          label="Es permanente"
          @update:model-value="onPermanentCheck(row)"
        />
      </template>
    </q-table>
    <q-btn
      v-if="!viewingApplication"
      rounded
      style="position: relative; bottom: 2%; left: 2%"
      :style="{
        background: disableAddButton() ? 'grey' : 'rgb(104, 192, 197)',
      }"
      icon="add"
      label="Agregar licencia"
      @click.prevent="addNewDriverLicense"
      :disable="disableAddButton()"
      class="q-mt-md"
    />
    <q-btn
      v-if="!viewingApplication"
      rounded
      :style="{ background: disableDeleteButton ? 'grey' : 'rgb(244, 36, 36)' }"
      style="position: relative; bottom: 2%; left: 5%"
      icon="delete"
      label="Eliminar ultimo"
      @click.prevent="deleteLastReference"
      :disable="disableDeleteButton"
      class="q-mt-md"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRequestUser } from "src/stores/requestUser";
import { useLocalStorageStore } from "src/stores/localStorage";
import { storeToRefs } from "pinia";

const useLocalStorage = useLocalStorageStore();
const useRequest = useRequestUser();

const currentIndex = ref(0);

const {
  drivingLicenceData,
  savedApplication,
  viewingApplication,
  updatingApplication,
} = storeToRefs(useRequest);

const columns = [
  { name: "type", align: "left", label: "Tipo", field: "type" },
  {
    name: "number",
    align: "left",
    label: "Número de licencia",
    field: "number",
  },
  {
    name: "expirationDate",
    align: "left",
    label: "Fecha de vencimiento",
    field: "expirationDate",
  },
  {
    name: "isLicencePermanent",
    align: "left",
    label: "Sin fecha de vencimiento",
    field: "isLicencePermanent",
  },
];

const licensesTypes = ["Automovil", "Chofer", "Moto", "Otro"];

onMounted(() => {
  loadLocalStore();

  setCurrentIndex();

  if (viewingApplication.value || updatingApplication.value) {
    setSavedStoredValues();
  }

  disableDeleteButton.value =
    drivingLicenceData.value.length === 0 ? true : false;
});

const onPermanentCheck = (row) => {
  row.expirationDate = "";
};

const disableAddButton = () => {
  if (drivingLicenceData.value.length === 0) return false;

  if (
    drivingLicenceData.value[currentIndex.value].number === "" ||
    drivingLicenceData.value[currentIndex.value].type === "" ||
    drivingLicenceData.value.length === 0
  ) {
    return true;
  }
  return false;
};

const setSavedStoredValues = () => {
  drivingLicenceData.value = savedApplication.value.licencias_manejo;
};

const dateRule = (value) => {
  const dateValid = /^\d{4}\/\d{2}\/\d{2}$/.test(value);
  const requiredValid = !!value;

  if (!dateValid) {
    return "Ingresa una fecha válida en el formato AAAA/MM/DD";
  } else if (!requiredValid) {
    return "Este campo es requerido";
  }

  return true; // La validación pasa
};

const disableDeleteButton = ref(true);

const addNewDriverLicense = () => {
  const newReference = {
    number: "",
    type: "",
    expirationDate: "",
  };

  drivingLicenceData.value.push(newReference);
  setCurrentIndex();
  disableDeleteButton.value = false;
};

const deleteLastReference = () => {
  if (drivingLicenceData.value.length > 0) {
    disableDeleteButton.value = false;
    drivingLicenceData.value.pop();
    setCurrentIndex();
    if (drivingLicenceData.value.length === 0) {
      disableDeleteButton.value = true;
    }
  }
};

const saveLocalStore = () => {
  if(!updatingApplication.value && !viewingApplication.value)
  useLocalStorage.save("drivingLicenceData", drivingLicenceData.value);
};

const loadLocalStore = () => {
  const driverLicensesLocalStoreData =
    useLocalStorage.load("drivingLicenceData");

  if (driverLicensesLocalStoreData) {
    drivingLicenceData.value = driverLicensesLocalStoreData;
  }
};

const setCurrentIndex = () => {
  if (drivingLicenceData.value.length === 0) {
    currentIndex.value = 0;
    return;
  }

  currentIndex.value = drivingLicenceData.value.length - 1;
};
</script>
