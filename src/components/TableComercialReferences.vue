<template>
  <div v-on:vnode-unmounted="saveLocalStore()">
    <q-table
      no-data-label="Sin referencias comerciales"
      :rows="commercialReferencesData"
      :columns="columns"
      :rows-per-page-options="[0]"
    >
      <template v-slot:body-cell-business="{ row }">
        <q-td>
          <q-input
            v-model="row.business"
            :readonly="viewingApplication"
            :rules="[companiesRule]"
          />
        </q-td>
      </template>
      <template v-slot:body-cell-contact="{ row }">
        <q-td>
          <q-input
            v-model="row.contact"
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
          <!--que avise si no hay menos de 10 digitos -->
        </q-td>
      </template>
    </q-table>
    <q-btn
      v-if="!viewingApplication"
      rounded
      style="
        position: relative;
        bottom: 2%;
        left: 2%;
      "
      :style="{ background: disableAddButton() ? 'grey' : 'rgb(104, 192, 197)' }"
      icon="add"
      label="Agregar Empresa"
      @click.prevent="addNewCommercialReference"
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
  commercialReferencesData,
  savedApplication,
  viewingApplication,
  updatingApplication,
} = storeToRefs(useRequest);

const columns = [
  { name: "business", align: "left", label: "Empresa", field: "business" },
  { name: "contact", align: "left", label: "Contacto", field: "contact" },
  { name: "cellphone", align: "left", label: "Telefono", field: "cellphone" },
];

onMounted(() => {
  loadLocalStore();

  setCurrentIndex();

  if (viewingApplication.value || updatingApplication.value) {
    setSavedStoredValues();
  }

  disableDeleteButton.value =
    commercialReferencesData.value.length === 0 ? true : false;
});

const disableAddButton = () => {
  if (commercialReferencesData.value.length === 0) return false;

  if (
    commercialReferencesData.value[currentIndex.value].business === "" ||
    commercialReferencesData.value[currentIndex.value].contact === "" ||
    commercialReferencesData.value[currentIndex.value].cellphone === "" ||
    commercialReferencesData.value.length === 0
  ) {
    return true;
  }
  return false;
};

const setSavedStoredValues = () => {
  commercialReferencesData.value =
    savedApplication.value.referencias_comerciales;
};

const lettersRule = (value) =>
  /^[A-Za-zñ áéíóúÁÉÍÓÚ]+$/.test(value) || "Ingresa solo letras";

const companiesRule = (value) => {
  const charactersValid = /^[A-Za-z0-9ñ áéíóúÁÉÍÓÚ]*$/.test(value);
  const requiredValid = !!value;

  if (!charactersValid) {
    return "Ingresa solo letras o números";
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

const disableDeleteButton = ref(true);

const addNewCommercialReference = () => {
  const newReference = {
    business: "",
    contact: "",
    cellphone: "",
  };

  commercialReferencesData.value.push(newReference);
  setCurrentIndex();
  disableDeleteButton.value = false;
};

const deleteLastReference = () => {
  if (commercialReferencesData.value.length > 0) {
    disableDeleteButton.value = false;
    commercialReferencesData.value.pop();
    setCurrentIndex();
    if (commercialReferencesData.value.length === 0) {
      disableDeleteButton.value = true;
    }
  }
};

const saveLocalStore = () => {
 useLocalStorage.save("commercialReferencesData", commercialReferencesData.value);
}

const loadLocalStore = () => {
  const commercialReferenceslocalStoreData = useLocalStorage.load("commercialReferencesData");

  if(commercialReferenceslocalStoreData){
    commercialReferencesData.value = commercialReferenceslocalStoreData;
  }
}

const setCurrentIndex = () => {

  if(commercialReferencesData.value && commercialReferencesData.value.length > 0)
  currentIndex.value = commercialReferencesData.value.length - 1;
};

</script>
