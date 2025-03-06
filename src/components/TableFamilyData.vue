<!--This is a component to get the information of the family data of the users-->
<template>
  <div v-on:vnode-unmounted="saveLocalStore()">
    <q-table
      :columns="columns"
      :rows="familyFathersData"
      :rows-per-page-options="[0]"
      no-data-label="Sin datos"
    >
      <template v-slot:body-cell-relationship="{ row }">
        <q-td>
          <q-select
            v-model="row.relationship"
            :readonly="viewingApplication || (isFixedRelationship(row) && row.relationship !== '')"
            :options="relationOptions"
            outlined
            color="black"
            label-color="black"
            class="q-mb-md"
            :rules="[ruleFieldRequired]"
          />
        </q-td>
      </template>
      <template v-slot:body-cell-name="{ row }">
        <q-td>
          <q-input
            autogrow
            ref="nameRef"
            v-model="row.name"
            :readonly="viewingApplication"
            :rules="[ruleFieldRequired]"
            class="q-mt-xs"
          />
        </q-td>
      </template>
      <template v-slot:body-cell-birthdate="{ row }">
        <q-td style="color: rgb(0, 0, 0)">
          <q-input
            label="AAAA/MM/DD"
            v-model="row.birthdate"
            :readonly="viewingApplication"
            mask="####/##/##"
            class="q-mt-xs"
            :rules="[ruleFieldRequired, ruleValidDate]"
          >
            <template v-slot:append>
              <q-icon name="event" class="cursor-pointer">
                <q-popup-proxy
                  v-if="!viewingApplication"
                  cover
                  transition-show="scale"
                  transition-hide="scale"
                >
                  <q-date v-model="row.birthdate">
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
      <template v-slot:body-cell-job="{ row }">
        <q-td>
          <q-input
            autogrow
            v-model="row.job"
            :readonly="viewingApplication"
            :rules="[ruleFieldRequired]"
            class="q-mt-xs"
          /><!--  checar rules ocupacion -->
        </q-td>
      </template>
      <template v-slot:body-cell-jobAddress="{ row }">
        <q-td>
          <q-input
            autogrow
            v-model="row.jobAddress"
            :readonly="viewingApplication"
            :rules="[ruleFieldRequired]"
            class="q-mt-xs"
          />
        </q-td>
      </template>
    </q-table>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, computed } from "vue";
import { useRequestUser } from "src/stores/requestUser";
import { useLocalStorageStore } from "src/stores/localStorage";
import { storeToRefs } from "pinia";
import { notifyPositive } from "src/utils/notifies";
import { useQuasar } from "quasar";
import { ruleFieldRequired, ruleValidDate } from "src/utils/fieldRules";

const $q = useQuasar();
const useLocalStorage = useLocalStorageStore();
const useRequest = useRequestUser();

const relationOptions = ["Padre", "Madre", "Esposo/a"];

const nameRef = ref(null);

const {
  familyFathersData,
  viewingApplication,
  updatingApplication,
  savedApplication,
} = storeToRefs(useRequest);

// Obtener el estado civil desde la aplicación guardada o desde localStorage
const civilStatus = computed(() => {
  let status = null;
  
  if (savedApplication.value) {
    status = savedApplication.value.estado_civil;
    console.log("Estado civil desde savedApplication:", status);
  }
  
  // Si no tenemos un valor de savedApplication, intentamos obtenerlo de localStorage
  if (!status) {
    try {
      const personalDataStr = localStorage.getItem("personalData");
      if (personalDataStr) {
        const personalData = JSON.parse(personalDataStr);
        status = personalData.civilStatus;
        console.log("Estado civil desde localStorage:", status);
      }
    } catch (e) {
      console.error("Error parsing personalData from localStorage:", e);
    }
  }
  
  return status;
});

// Verificar si el estado civil es casado (C) o unión libre (U)
const isCasadoOrUnionLibre = computed(() => {
  return civilStatus.value === "C" || civilStatus.value === "U";
});

// Función para actualizar los datos familiares según el estado civil
function updateFamilyData(isCasadoOrUnion) {
  console.log("Actualizando datos familiares. Estado civil casado/unión libre:", isCasadoOrUnion);
  console.log("Datos actuales:", JSON.stringify(familyFathersData.value));
  
  // Asegurarse de que siempre existan al menos los padres
  if (familyFathersData.value.length === 0) {
    familyFathersData.value.push(
      {
        relationship: "Padre",
        name: "",
        birthdate: "",
        job: "",
        jobAddress: "",
      },
      {
        relationship: "Madre",
        name: "",
        birthdate: "",
        job: "",
        jobAddress: "",
      }
    );
  } else if (familyFathersData.value.length === 1) {
    familyFathersData.value.push({
      relationship: "Madre",
      name: "",
      birthdate: "",
      job: "",
      jobAddress: "",
    });
  }
  
  // Establecer los valores correctos de parentesco para los padres
  if (familyFathersData.value[0]) {
    familyFathersData.value[0].relationship = "Padre";
  }
  
  if (familyFathersData.value[1]) {
    familyFathersData.value[1].relationship = "Madre";
  }
  
  // Si es casado o unión libre, asegurarse de que esté el esposo/a
  if (isCasadoOrUnion) {
    console.log("Usuario casado/unión libre, agregando esposo/a");
    // Si no existe el tercer elemento (esposo/a), lo agregamos
    if (familyFathersData.value.length < 3) {
      familyFathersData.value.push({
        relationship: "Esposo/a",
        name: "",
        birthdate: "",
        job: "",
        jobAddress: "",
      });
    } else {
      // Si existe, asegurarse de que sea esposo/a
      familyFathersData.value[2].relationship = "Esposo/a";
    }
  } else {
    console.log("Usuario soltero, eliminando esposo/a si existe");
    // Si no es casado ni unión libre, eliminar el esposo/a si existe
    if (familyFathersData.value.length > 2) {
      familyFathersData.value.splice(2, 1);
    }
  }
  
  console.log("Datos actualizados:", JSON.stringify(familyFathersData.value));
}

// Verificar si es una relación fija (Padre, Madre, Esposo/a)
const isFixedRelationship = (row) => {
  const index = familyFathersData.value.indexOf(row);
  // Primera fila siempre es Padre, segunda siempre es Madre
  if (index === 0) {
    row.relationship = row.relationship || "Padre";
    return true;
  } 
  if (index === 1) {
    row.relationship = row.relationship || "Madre";
    return true;
  }
  // Tercera fila es Esposo/a si es casado o unión libre
  if (index === 2 && isCasadoOrUnionLibre.value) {
    row.relationship = "Esposo/a";
    return true;
  }
  return false;
};

const columns = [
  {
    name: "relationship",
    align: "left",
    label: "Parentesco *",
    field: "relationship",
  },
  { name: "name", align: "left", label: "Nombre *", field: "name" },
  {
    name: "birthdate",
    align: "left",
    label: "Fecha de nacimiento *",
    field: "birthdate",
  },
  { name: "job", align: "left", label: "Trabajo *", field: "job" },
  {
    name: "jobAddress",
    align: "left",
    label: "Direccion de su trabajo *",
    field: "jobAddress",
  },
];

const initializeFamilyData = () => {
  // Inicializar con padre y madre
  if (familyFathersData.value.length === 0) {
    familyFathersData.value = [
      {
        relationship: "Padre",
        name: "",
        birthdate: "",
        job: "",
        jobAddress: "",
      },
      {
        relationship: "Madre",
        name: "",
        birthdate: "",
        job: "",
        jobAddress: "",
      }
    ];
  }
  
  // Actualizar según el estado civil
  updateFamilyData(isCasadoOrUnionLibre.value);
};

const setSavedStoredValues = () => {
  if (!savedApplication.value) return;
  
  const savedFamilyData = savedApplication.value.datos_familiares;
  if (savedFamilyData && savedFamilyData.length) {
    // Filtrar entradas con trabajo (elimina entradas nulas/vacías)
    familyFathersData.value = savedFamilyData.filter(element => element.job !== null);
    
    // Asegurarse de que los datos estén bien formados
    if (familyFathersData.value.length < 2) {
      // Si faltan entradas, inicializar con los valores por defecto
      initializeFamilyData();
    } else {
      // Actualizar según el estado civil
      updateFamilyData(isCasadoOrUnionLibre.value);
    }
  } else {
    initializeFamilyData();
  }
};

const validateRequiredFields = () => {
  if (nameRef.value) {
    nameRef.value.validate();
  }
  
  // Verificar todos los campos obligatorios
  return familyFathersData.value.every((relative, index) => {
    // Si es el tercer elemento (esposo/a) y no es casado/unión libre, no validar
    if (index === 2 && !isCasadoOrUnionLibre.value) {
      return true;
    }
    
    // Validar que todos los campos requeridos estén llenos
    return relative.relationship && 
           relative.name && 
           relative.birthdate && 
           relative.job && 
           relative.jobAddress;
  });
};

const saveLocalStore = () => {
  if (!viewingApplication.value && !updatingApplication.value) {
    useLocalStorage.save("familyFathersData", familyFathersData.value);
    $q.notify(notifyPositive("Se ha guardado su progreso.", 1000));
  }
};

// Observar cambios en el estado civil para actualizar los datos familiares
// Importante: este watch debe estar después de definir updateFamilyData
watch(isCasadoOrUnionLibre, (newValue, oldValue) => {
  console.log("Estado civil cambió:", oldValue, "->", newValue);
  updateFamilyData(newValue);
});

onMounted(() => {
  console.log("Componente montado");
  console.log("Estado aplicación - updatingApplication:", updatingApplication.value);
  console.log("Estado aplicación - viewingApplication:", viewingApplication.value);
  
  // Verificar el estado civil
  setTimeout(() => {
    console.log("Estado civil:", civilStatus.value);
    console.log("¿Es casado o unión libre?:", isCasadoOrUnionLibre.value);
    
    if (updatingApplication.value || viewingApplication.value) {
      setSavedStoredValues();
    } else {
      initializeFamilyData();
    }
    
    // Forzar actualización de datos según estado civil
    updateFamilyData(isCasadoOrUnionLibre.value);
    
    // Verificar que se actualizó correctamente
    console.log("Después de actualizar - Datos familiares:", JSON.stringify(familyFathersData.value));
  }, 100); // Pequeño retraso para asegurar que el estado esté actualizado
});

defineExpose({ validateRequiredFields });
</script>