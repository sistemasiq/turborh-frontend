<template>
  <div v-on:vue:unmounted="saveLocalStore()">
    <q-table
      no-data-label="Sin referencias familiares"
      :columns="columns"
      :rows="familyReferencesData"
      :rows-per-page-options="[0]"
    >
      <template v-slot:body-cell-name="{ row }">
        <q-td>
          <q-input
            v-model="row.name"
            :readonly="viewingApplication"
            :rules="[lettersRule]"
          />
        </q-td>
      </template>
      <template v-slot:body-cell-job="{ row }">
        <q-td>
          <q-input
            autogrow
            v-model="row.job"
            :readonly="viewingApplication"
            :rules="[lettersRule]"
          />
        </q-td>
      </template>
      <template v-slot:body-cell-cellphone="{ row }">
        <q-td>
          <q-input
            mask="##########"
            v-model="row.cellphone"
            :readonly="viewingApplication"
            :rules="[phoneRule]"
          />
        </q-td>
      </template>
    </q-table>
    <br />
    <q-btn
      v-if="!viewingApplication"
      rounded
      :style="{
        background: disableAddButton() ? 'grey' : 'rgb(104, 192, 197)',
      }"
      style="position: relative; bottom: 2%; left: 2%"
      icon="add"
      label="Agregar familiar"
      @click="addNewFamiliarReference"
      :disable="disableAddButton()"
    />
    <q-btn
      v-if="!viewingApplication"
      rounded
      :style="{ background: disableDeleteButton ? 'grey' : 'rgb(244, 36, 36)' }"
      style="position: relative; bottom: 2%; left: 5%"
      icon="delete"
      label="Eliminar ultimo"
      @click="deleteLastReference"
      :disable="disableDeleteButton"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRequestUser } from "src/stores/requestUser";
import { useLocalStorageStore } from "src/stores/localStorage";
import { storeToRefs } from "pinia";
import { notifyPositive } from "src/utils/notifies";
import { useQuasar } from "quasar";

const $q = useQuasar();
const useLocalStorage = useLocalStorageStore();
const useRequest = useRequestUser();

const disableDeleteButton = ref(true);

const currentIndex = ref(0);

const {
  familyReferencesData,
  savedApplication,
  viewingApplication,
  updatingApplication,
} = storeToRefs(useRequest);

const columns = [
  { name: "name", align: "left", label: "Nombre", field: "name" },
  { name: "job", align: "left", label: "Trabajo", field: "job" },
  { name: "cellphone", align: "left", label: "Telefono", field: "cellphone" },
];

onMounted(() => {
  loadLocalStore();
  setCurrentIndex();

  if (viewingApplication.value || updatingApplication.value) {
    setSavedStoredValues();
  }

  disableDeleteButton.value =
    familyReferencesData.value.length === 0 ? true : false;
});

const disableAddButton = () => {
  if (familyReferencesData.value.length === 0) return false;

  if (
    familyReferencesData.value[currentIndex.value].name === "" ||
    familyReferencesData.value[currentIndex.value].job === "" ||
    familyReferencesData.value[currentIndex.value].cellphone === "" ||
    familyReferencesData.value.length === 0
  ) {
    return true;
  }
  return false;
};

const setSavedStoredValues = () => {
  familyReferencesData.value = savedApplication.value.referencias_familiares;
};

const lettersRule = (value) => {
  const charactersValid = /^[A-Za-zñ áéíóúÁÉÍÓÚ]*$/.test(value);
  const requiredValid = !!value;

  if (!charactersValid) {
    return "Ingresa solo letras";
  } else if (!requiredValid) {
    return "Este campo es requerido";
  }

  return true; // La validación pasa
};

const phoneRule = (value) => {
  const numericValid = /^\d*$/.test(value);
  const requiredValid = !!value;

  if (!numericValid) {
    return "Ingresa solo números";
  } else if (!requiredValid) {
    return "Este campo es requerido";
  } else if (value.length > 10 || value.length < 10) {
    return "Ingresa unicamente 10 números";
  }

  return true; // La validación pasa
};

const addNewFamiliarReference = () => {
  if (familyReferencesData.value.length < 3) {
    const newFamiliar = {
      name: "",
      job: "",
      cellphone: "",
    };

    familyReferencesData.value.push(newFamiliar);
    setCurrentIndex();
    disableDeleteButton.value = false;
  }
};

const deleteLastReference = () => {
  if (familyReferencesData.value.length > 0) {
    disableDeleteButton.value = false;
    disableAddButton.value = false;

    familyReferencesData.value.pop();
    setCurrentIndex();

    if (familyReferencesData.value.length === 0) {
      disableDeleteButton.value = true;
    }
  }
};

const setCurrentIndex = () => {
  if (familyReferencesData.value.length > 0)
    currentIndex.value = familyReferencesData.value.length - 1;
};

const saveLocalStore = () => {
  if (!viewingApplication.value && !updatingApplication.value) {
    useLocalStorage.save("familyReferencesData", familyReferencesData.value);
    $q.notify(notifyPositive("Se ha guardado su progreso.", 1000));
  }
};

const loadLocalStore = () => {
  const familyReferenceslocalStoreData = useLocalStorage.load(
    "familyReferencesData"
  );

  if (familyReferenceslocalStoreData) {
    familyReferencesData.value = familyReferenceslocalStoreData;
  }
};
</script>
