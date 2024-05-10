<template>
  <div v-on:vnode-unmounted="saveLocalStore()">
    <q-table
      :columns="columns"
      :rows="familySonsData"
      :rows-per-page-options="[0]"
      no-data-label="Sin datos"
    >
      <template v-slot:body-cell-son="{ row }">
        <q-td>
          <q-input
            v-model="row.son"
            :readonly="viewingApplication"
            :rules="[lettersRule]"
          />
        </q-td>
      </template>
      <template v-slot:body-cell-sonBirthdate="{ row }">
        <q-td style="color: rgb(0, 0, 0)">
          <q-input
            label="AAAA/MM/DD"
            v-model="row.sonBirthdate"
            :readonly="viewingApplication"
            mask="####/##/##"
            lazy-rules
            :rules="[dateRule]"
          >
            <template v-slot:append>
              <q-icon name="event" class="cursor-pointer">
                <q-popup-proxy
                  cover
                  transition-show="scale"
                  transition-hide="scale"
                >
                  <q-date
                    v-model="row.sonBirthdate"
                    :readonly="viewingApplication"
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
      <template v-slot:body-cell-sonStudyPlace="{ row }">
        <q-td>
          <q-input
            v-model="row.sonStudyPlace"
            :readonly="viewingApplication"
            :rules="[studyPlaceRule]"
          />
        </q-td>
      </template>
    </q-table>
    <br />
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
      label="Agregar familiar"
      @click.prevent="addNewRelative"
      :disable="disableAddButton()"
    />
    <q-btn
      v-if="!viewingApplication"
      rounded
      :style="{ background: disableDeleteButton ? 'grey' : 'rgb(244, 36, 36)' }"
      style="position: relative; bottom: 2%; left: 5%"
      icon="delete"
      label="Eliminar ultimo"
      @click.prevent="deleteLastRelative"
      :disable="disableDeleteButton"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRequestUser } from "src/stores/requestUser";
import { useAuthStore } from "src/stores/auth";
import { useLocalStorageStore } from "src/stores/localStorage";
import { storeToRefs } from "pinia";

const useLocalStorage = useLocalStorageStore();
const useRequest = useRequestUser();
const useAuth = useAuthStore();

const disableDeleteButton = ref(true);

const currentIndex = ref(0)

const { isRh } = storeToRefs(useAuth)

const {
  familySonsData,
  savedApplication,
  viewingApplication,
  updatingApplication,
} = storeToRefs(useRequest);

const columns = [
  { name: "son", align: "left", label: "Nombre de su hijo", field: "son" },
  {
    name: "sonBirthdate",
    align: "left",
    label: "Fecha de nacimiento",
    field: "sonBirthdate",
  },
  {
    name: "sonStudyPlace",
    align: "left",
    label: "Lugar de trabajo o estudio",
    field: "sonStudyPlace",
  },
];

onMounted(() => {
  loadLocalStore();
  setCurrentIndex();
  if (viewingApplication.value || updatingApplication.value) {
    setSavedStoredValues();
  }

  disableDeleteButton.value = familySonsData.value.length === 0 ? true : false;
});

const disableAddButton = () => {
  if (familySonsData.value.length === 0) return false;

  if (
    familySonsData.value[currentIndex.value].son === "" ||
    familySonsData.value[currentIndex.value].sonStudyPlace === "" ||
    familySonsData.value[currentIndex.value].sonBirthdate === "" ||
    familySonsData.value.length === 0
  ) {
    return true;
  }
  return false;
};

const setSavedStoredValues = () => {
  if (!savedApplication.value) return;
  familySonsData.value = []

  savedApplication.value.datos_familiares.forEach((element) => {
    if (element.son != null) {
      familySonsData.value.push(element);
    }
  });
};

const lettersRule = (value) => {
  const charactersValid = /^[A-Za-zñ ]*$/.test(value);
  const requiredValid = !!value;

  if (!charactersValid) {
    return "Ingresa solo letras";
  } else if (!requiredValid) {
    return "Este campo es requerido";
  }

  return true; // La validación pasa
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

const studyPlaceRule = (value) => {
  const charactersValid = /^[A-Za-z0-9ñ ]*$/.test(value);
  const requiredValid = !!value;

  if (!charactersValid) {
    return "Ingresa solo letras o números";
  } else if (!requiredValid) {
    return "Este campo es requerido";
  }

  return true; // La validación pasa
};

const addNewRelative = () => {
  const newRelative = {
    son: "",
    sonBirthdate: "",
    sonStudyPlace: "",
  };

  familySonsData.value.push(newRelative);
  setCurrentIndex();
  disableDeleteButton.value = false;
};

const deleteLastRelative = () => {
  if (familySonsData.value.length > 0) {
    disableDeleteButton.value = false;
    familySonsData.value.pop();
    setCurrentIndex();
    if (familySonsData.value.length === 0) {
      disableDeleteButton.value = true;
    }
  }
};

const saveLocalStore = () => {
  useLocalStorage.save("familySonsData", familySonsData.value);
};

const loadLocalStore = () => {
  if(viewingApplication.value)
  return;

  const localStoreData = useLocalStorage.load("familySonsData");

  if (localStoreData){
    familySonsData.value = localStoreData;
  }
};

const setCurrentIndex = () => {
  currentIndex.value = familySonsData.value.length - 1;
};

</script>
