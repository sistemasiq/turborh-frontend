<template>
  <div v-on:vnode-unmounted="saveLocalStore()">
    <q-table
      :columns="columns"
      :rows="familyFathersData"
      :rows-per-page-options="[0]"
      no-data-label="Sin datos"
    >
      <template v-slot:body-cell-relationship="{ row }">
        <!-- Eliminamos la impresión de datos que causa confusión -->
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
          />
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

// Función para inicializar correctamente los datos familiares según el parentesco
function initializeFamilyData() {
  // Crear un array con padre y madre siempre
  const initialData = [
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
  
  // Si es casado/unión libre, agregar esposo/a
  if (isCasadoOrUnionLibre.value) {
    initialData.push({
      relationship: "Esposo/a",
      name: "",
      birthdate: "",
      job: "",
      jobAddress: "",
    });
  }
  
  // Asignar los datos iniciales
  familyFathersData.value = initialData;
  console.log("Datos inicializados:", JSON.stringify(familyFathersData.value));
}

// Función para actualizar los datos según el estado civil, manteniendo la integridad de los datos
function updateFamilyData(isCasadoOrUnion) {
  console.log("Actualizando datos familiares. Estado civil casado/unión libre:", isCasadoOrUnion);
  
  // Crear un nuevo array para mantener la integridad de los datos
  let updatedData = [];
  
  // Buscar registros por tipo de relación (no por posición) para evitar confusiones
  const padreData = familyFathersData.value.find(item => item.relationship === "Padre") || {
    relationship: "Padre",
    name: "",
    birthdate: "",
    job: "",
    jobAddress: "",
  };
  
  const madreData = familyFathersData.value.find(item => item.relationship === "Madre") || {
    relationship: "Madre",
    name: "",
    birthdate: "",
    job: "",
    jobAddress: "",
  };
  
  // Agregar padre y madre al arreglo actualizado
  updatedData.push(padreData);
  updatedData.push(madreData);
  
  // Si es casado o unión libre, buscar o crear el registro de Esposo/a
  if (isCasadoOrUnion) {
    const esposoData = familyFathersData.value.find(item => item.relationship === "Esposo/a") || {
      relationship: "Esposo/a",
      name: "",
      birthdate: "",
      job: "",
      jobAddress: "",
    };
    updatedData.push(esposoData);
  }
  
  // Actualizar el arreglo de datos
  familyFathersData.value = updatedData;
  
  console.log("Datos actualizados:", JSON.stringify(familyFathersData.value));
}

// Verificar si es una relación fija
const isFixedRelationship = (row) => {
  const relationship = row.relationship;
  // Verificar por tipo de relación, no por índice
  return relationship === "Padre" || 
         relationship === "Madre" || 
         (relationship === "Esposo/a" && isCasadoOrUnionLibre.value);
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

// Función mejorada para cargar datos guardados
const setSavedStoredValues = () => {
  if (!savedApplication.value) return;
  
  const savedFamilyData = savedApplication.value.datos_familiares;
  if (savedFamilyData && savedFamilyData.length) {
    // Filtrar entradas con trabajo (elimina entradas nulas/vacías)
    const validEntries = savedFamilyData.filter(element => element.job !== null);
    
    // Crear un nuevo array con las relaciones correctas
    const correctedData = [];
    
    // Buscar y asignar el padre específicamente por relación
    const padre = validEntries.find(item => item.relationship === "Padre");
    correctedData.push(padre || {
      relationship: "Padre",
      name: "",
      birthdate: "",
      job: "",
      jobAddress: "",
    });
    
    // Buscar y asignar la madre específicamente por relación
    const madre = validEntries.find(item => item.relationship === "Madre");
    correctedData.push(madre || {
      relationship: "Madre",
      name: "",
      birthdate: "",
      job: "",
      jobAddress: "",
    });
    
    // Si es casado/unión libre, buscar y asignar el esposo/a
    if (isCasadoOrUnionLibre.value) {
      const esposo = validEntries.find(item => item.relationship === "Esposo/a");
      if (esposo) {
        correctedData.push(esposo);
      } else {
        correctedData.push({
          relationship: "Esposo/a",
          name: "",
          birthdate: "",
          job: "",
          jobAddress: "",
        });
      }
    }
    
    // Asignar los datos corregidos
    familyFathersData.value = correctedData;
    console.log("Datos cargados desde aplicación guardada:", JSON.stringify(familyFathersData.value));
  } else {
    // Inicializar con valores por defecto si no hay datos guardados
    initializeFamilyData();
  }
};

// Validar campos requeridos
const validateRequiredFields = () => {
  if (nameRef.value) {
    nameRef.value.validate();
  }
  
  // Verificar todos los campos obligatorios
  return familyFathersData.value.every((relative) => {
    const isEsposo = relative.relationship === "Esposo/a";
    // Si es esposo/a y no es casado/unión libre, no validar
    if (isEsposo && !isCasadoOrUnionLibre.value) {
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

// Guardar en localStorage
const saveLocalStore = () => {
  if (!viewingApplication.value && !updatingApplication.value) {
    useLocalStorage.save("familyFathersData", familyFathersData.value);
    $q.notify(notifyPositive("Se ha guardado su progreso.", 1000));
  }
};

// Observar cambios en el estado civil para actualizar los datos familiares
watch(isCasadoOrUnionLibre, (newValue) => {
  console.log("Estado civil cambió a casado/unión libre:", newValue);
  updateFamilyData(newValue);
});

// Función para cargar correctamente los datos al iniciar
const loadFamilyData = () => {
  // Determinar qué datos cargar según el modo de la aplicación
  if (updatingApplication.value || viewingApplication.value) {
    console.log("Cargando datos guardados (modo edición/visualización)");
    setSavedStoredValues();
  } else {
    console.log("Inicializando datos nuevos");
    initializeFamilyData();
  }
};

onMounted(() => {
  console.log("Componente montado");
  console.log("Estado aplicación - updatingApplication:", updatingApplication.value);
  console.log("Estado aplicación - viewingApplication:", viewingApplication.value);
  
  // Esperar un momento para asegurar que todas las propiedades computadas estén actualizadas
  setTimeout(() => {
    console.log("Estado civil:", civilStatus.value);
    console.log("¿Es casado o unión libre?:", isCasadoOrUnionLibre.value);
    
    // Cargar los datos
    loadFamilyData();
    
    // Forzar una actualización final para asegurar consistencia
    updateFamilyData(isCasadoOrUnionLibre.value);
  }, 100);
});

defineExpose({ validateRequiredFields });
</script>