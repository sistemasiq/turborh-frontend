<template>
  <q-layout style="background-color: rgb(30, 61, 88)">
    <q-card class="mainCard">
      <q-card-section class="title"> Datos familiares </q-card-section>
      <q-card-section>
        <PaginationApplication
          :page="6"
          :required-fields="requiredFieldsOnThisPage"
          @on-field-validation="validateRequiredFields"
        ></PaginationApplication>

        <div v-if="!viewingApplication" style="margin-top: 6%">
          <q-card
            flat
            bordered
            text-color="white"
            class="q-mb-lg"
            style="
              margin-left: 0%;
              border-color: rgb(255, 248, 43);
              background-color: transparent;
              color: white;
              width: 100%;
              height: 80px;
            "
            v-if="!viewingApplication"
          >
            <q-card-section>
              <div class="text-body1 text-weight-medium row">
                <q-icon name="warning" class="q-mr-md q-mt-xs" />
                Nota
              </div>
              <p class="text-body2">
                Debe ingresar los datos de los padres{{ isCasadoOrUnionLibre ? ' y esposo/a' : '' }} para poder avanzar a la siguiente pantalla
              </p>
              
            </q-card-section>
          </q-card>
        </div>
              
              <div class="q-mt-xl q-ml-xl">
                <p class="text-h6 text-weight-regular text-white">
                Datos de Padres y Esposa(o) 
              </p>
              </div>
        <FamilyFathers ref="familyFathersDataRef" class="table-position" />
        <br />
        <div class="row items-center q-ml-xl " style="width: 93%;">
        
         <div class="text-white text-h6 text-weight-regular"> Datos de Hijas(os)</div>
        <BadgeOptional />
        </div>
        <FamilySons class="table-position" />
      </q-card-section>
    </q-card>
    <ButtonApplicationStatus
      v-if="updatingApplication"
      :required-fields="requiredFieldsOnThisPage"
    />
  </q-layout>
</template>

<!-- SCRIPT BEGGINS ............................................................................................................................ -->
<script setup>
import { computed, onBeforeMount, onMounted, onBeforeUnmount, ref, watch } from "vue";
import { useRequestUser } from "src/stores/requestUser";
import { storeToRefs } from "pinia";
import FamilyFathers from "src/components/TableFamilyData.vue";
import FamilySons from "src/components/TableFamilyData2.vue";
import PaginationApplication from "src/components/PaginationApplication.vue";
import ButtonApplicationStatus from "src/components/ButtonApplicationStatus.vue";
import { useLocalStorageStore } from "src/stores/localStorage";
import { notifyNegativeField } from "src/utils/notifies";
import { useQuasar } from "quasar";
import BadgeOptional from "src/components/BadgeOptional.vue";

const $q = useQuasar()
const useLocalStorage = useLocalStorageStore();
const useApplication = useRequestUser();

const familyFathersDataRef = ref(null);

const {
  updatingApplication,
  familyFathersData,
  viewingApplication,
  savedApplication
} = storeToRefs(useApplication);

// Verificar si el estado civil es casado (C) o unión libre (U)
const currentCivilStatus = ref("");

// Actualizar estado civil desde localStorage o savedApplication
const updateCivilStatus = () => {
  console.log("Actualizando estado civil");
  
  // Si tenemos savedApplication, usamos el valor de ahí
  if (savedApplication.value) {
    currentCivilStatus.value = savedApplication.value.estado_civil;
    console.log("Estado civil desde savedApplication:", currentCivilStatus.value);
  } else {
    // Si no, intentamos obtenerlo del localStorage
    try {
      const personalDataStr = localStorage.getItem("personalData");
      if (personalDataStr) {
        const personalData = JSON.parse(personalDataStr);
        currentCivilStatus.value = personalData.civilStatus;
        console.log("Estado civil desde localStorage:", currentCivilStatus.value);
      }
    } catch (e) {
      console.error("Error al leer el estado civil:", e);
    }
  }
};

// Actualizar estado civil cuando cambie savedApplication
watch(() => savedApplication.value, (newValue) => {
  if (newValue) {
    updateCivilStatus();
  }
}, { immediate: true });

// Verificar regularmente localStorage por cambios en el estado civil
onMounted(() => {
  updateCivilStatus();
  
  // Verificar cambios cada 2 segundos
  const intervalId = setInterval(() => {
    try {
      const personalDataStr = localStorage.getItem("personalData");
      if (personalDataStr) {
        const personalData = JSON.parse(personalDataStr);
        if (personalData.civilStatus && personalData.civilStatus !== currentCivilStatus.value) {
          console.log("Estado civil cambió en localStorage:", personalData.civilStatus);
          currentCivilStatus.value = personalData.civilStatus;
        }
      }
    } catch (e) {
      console.error("Error al verificar estado civil:", e);
    }
  }, 2000);
  
  // Limpiar intervalo cuando se desmonte el componente
  onBeforeUnmount(() => {
    clearInterval(intervalId);
  });
});

const isCasadoOrUnionLibre = computed(() => {
  return currentCivilStatus.value === "C" || currentCivilStatus.value === "U";
});

// Recalcular los campos requeridos para incluir esposo/a si corresponde
const requiredFieldsOnThisPage = computed(() => {
  const fields = [];
  
  // Siempre requerir los datos de los padres (índices 0 y 1)
  if (familyFathersData.value[0]) {
    fields.push(
      familyFathersData.value[0].job,
      familyFathersData.value[0].jobAddress,
      familyFathersData.value[0].name,
      familyFathersData.value[0].relationship,
      familyFathersData.value[0].birthdate
    );
  }
  
  if (familyFathersData.value[1]) {
    fields.push(
      familyFathersData.value[1].job,
      familyFathersData.value[1].jobAddress,
      familyFathersData.value[1].name,
      familyFathersData.value[1].relationship,
      familyFathersData.value[1].birthdate
    );
  }
  
  // Incluir los datos del esposo/a solo si es casado o unión libre
  if (isCasadoOrUnionLibre.value && familyFathersData.value[2]) {
    fields.push(
      familyFathersData.value[2].job,
      familyFathersData.value[2].jobAddress,
      familyFathersData.value[2].name,
      familyFathersData.value[2].relationship,
      familyFathersData.value[2].birthdate
    );
  }
  
  return fields;
});

const validateRequiredFields = () => {
  if (viewingApplication.value) return;

  let missingFields = [];

  // Determinar cuántas filas validar (2 padres o 3 si incluye esposo/a)
  const rowsToValidate = isCasadoOrUnionLibre.value ? 
    Math.min(3, familyFathersData.value.length) : 
    Math.min(2, familyFathersData.value.length);

  for (let index = 0; index < rowsToValidate; index++) {
    if (!familyFathersData.value[index]) continue;
    
    let rowMissingFields = [];

    // Check each field in the current row
    if (!familyFathersData.value[index].relationship) {
      rowMissingFields.push("Parentesco");
    }
    if (!familyFathersData.value[index].name) {
      rowMissingFields.push("Nombre");
    }
    if (!familyFathersData.value[index].birthdate) {
      rowMissingFields.push("Fecha de nacimiento");
    }
    if (!familyFathersData.value[index].job) {
      rowMissingFields.push("Trabajo");
    }
    if (!familyFathersData.value[index].jobAddress) {
      rowMissingFields.push("Dirección de su trabajo");
    }

    // If there are missing fields for this row, add them to the missingFields array
    if (rowMissingFields.length > 0) {
      let rowLabel = index === 0 ? "Padre" : (index === 1 ? "Madre" : "Esposo/a");
      missingFields.push(`${rowLabel}: ${rowMissingFields.join(", ")}`);
    }
  }

  // Construct the notification message
  if (missingFields.length > 0) {
    let message = `Campos faltantes:\n\n${missingFields.join("\n\n")}`;
    $q.notify(notifyNegativeField(message));
  }

  // Si hay llamada al componente hijo, delegar la validación también allí
  if (familyFathersDataRef.value && familyFathersDataRef.value.validateRequiredFields) {
    familyFathersDataRef.value.validateRequiredFields();
  }
};

onBeforeMount(() => {
  loadLocalStore();
  updateCivilStatus(); // Asegurarse de que el estado civil esté actualizado
});

const loadLocalStore = () => {
  const localStoreData = useLocalStorage.load("familyFathersData");

  if (localStoreData && !viewingApplication.value && !updatingApplication.value)
    familyFathersData.value = localStoreData;
};
</script>

<!-- STYLE BEGGINS ............................................................................................................................ -->
<style scoped>
.q-card {
  border-radius: 10px;
  vertical-align: top;
  background: rgba(49, 49, 49, 0.473) 51%;
  position: relative;
  height: 75%;
  width: 89%;
  margin-left: 6%;
  margin-top: 2%;
}

.title {
  font-size: large;
  color: rgb(40, 55, 68);
}

.mainCard {
  border-radius: 10px;
  background: rgba(49, 49, 49, 0.473) 51%;
}

.mainCard {
  display: relative;
  justify-content: center;
  align-items: center;
}

.avatar {
  position: relative;
  margin-left: 20%;
}

.menu {
  background: rgba(22, 48, 70);
  width: 70px;
}

.menu-register {
  color: rgb(95, 158, 160);
  font-size: 150%;
  margin-top: 15%;
  margin-left: 10%;
}

.logo-turbo {
  margin-top: 5%;
  margin-left: 31%;
}

.turbo {
  color: rgb(255, 255, 255);
  font-size: 150%;
  margin-left: 20%;
}

.personaldata-background {
  display: flex;
  position: relative;
  width: 80%;
  height: 100%;
  left: 10%;
  padding-bottom: 2%;
  padding-top: 3%;
}

.table-position {
  position: relative;
  margin-top: 2%;
  width: 92%;
  left: 4%;
}
</style>