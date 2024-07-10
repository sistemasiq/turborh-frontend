<template>
  <q-layout v-on:vnode-unmounted="saveLocalStore()">
    <div style="margin-top: 6%">
        <div
          style="display: flex; flex-grow: 1; margin-left: 2%; margin-right: 2%"
        >
          <q-card
            flat
            bordered
            rounded
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
                Ordena tu experiencia laboral comenzando por añadir tu último empleo que tuviste hasta el primero
              </p>
            </q-card-section>
          </q-card>
        </div>
      </div>
    <q-expansion-item
      v-for="(item, index) in laboralExperienceData"
      :key="index"
      expand-separator
      default-opened
      icon="mdi-file-document"
      :label="'Empresa: ' + item.company"
      class="bg-white rounded-borders q-mt-lg q-mb-lg"
    >
      <q-card class="expansionCard full-width q-p b-lg">
        <div
          class="row q-gutter-x-sm"
          style="padding-left: 1.3%; padding-top: 25px"
        >
          <q-input
            dark
            outlined
            v-model="item.company"
            color="cyan-1"
            style="width: 30%"
            lazy-rules
            :rules="[(value) => !!value || 'Este campo no puede estar vacío.']"
            :readonly="viewingApplication"
            @update:model-value="disableAddButton"
            type="text"
            label="Nombre Empresa"
            label-color="white"
            class="input-brand"
          >
          </q-input>
          <q-input
            dark
            outlined
            v-model="item.address"
            color="cyan-1"
            style="width: 48.8%"
            lazy-rules
            :rules="[locationRule]"
            :readonly="viewingApplication"
            type="text"
            label="Domicilio"
            label-color="white"
            class="input-location"
          >
          </q-input>
          <q-input
            dark
            outlined
            v-model="item.phone"
            color="cyan-1"
            style="width: 18%"
            inline
            lazy-rules
            mask="##########"
            :rules="[phoneRule]"
            :readonly="viewingApplication"
            type="text"
            label="Teléfono"
            label-color="white"
          >
          </q-input>
        </div>

        <div
          class="row q-gutter-x-sm"
          style="padding-left: 1.3%; padding-top: 10px"
        >
          <q-input
            dark
            outlined
            v-model="item.lastBossName"
            color="cyan-1"
            style="width: 30%"
            inline
            lazy-rules
            :rules="[lettersRule]"
            :readonly="viewingApplication"
            type="text"
            label="Nombre del ultimo jefe"
            label-color="white"
          >
          </q-input>
          <q-input
            dark
            outlined
            v-model="item.lastBossPosition"
            color="cyan-1"
            style="width: 30%"
            inline
            lazy-rules
            :rules="[positionRule]"
            :readonly="viewingApplication"
            type="text"
            label="Puesto del ultimo jefe"
            label-color="white"
          >
          </q-input>
          <q-input
            v-model="item.startDate"
            filled
            hint="AAAA/MM/DD"
            hide-hint
            mask="####/##/##"
            lazy-rules
            :rules="[dateRule]"
            :readonly="viewingApplication"
            dark
            outlined
            color="cyan-1"
            style="width: 18%"
            label="Fecha de inicio"
          >
            <template v-slot:append>
              <q-icon name="event" class="cursor-pointer">
                <q-popup-proxy
                  cover
                  transition-show="scale"
                  transition-hide="scale"
                >
                  <q-date
                    v-model="item.startDate"
                    :readonly="viewingApplication"
                  >
                    <div class="row items-center justify-end">
                      <q-btn
                        v-close-popup
                        label="Cerrar"
                        color="primary"
                        flat
                      />
                    </div>
                  </q-date>
                </q-popup-proxy>
              </q-icon>
            </template>
          </q-input>
          <q-input
            v-model="item.endDate"
            filled
            hint="AAAA/MM/DD"
            hide-hint
            mask="####/##/##"
            lazy-rules
            :rules="[dateRule]"
            :readonly="viewingApplication"
            dark
            outlined
            color="cyan-1"
            style="width: 18%"
            label="Fecha de fin"
          >
            <template v-slot:append>
              <q-icon name="event" class="cursor-pointer">
                <q-popup-proxy
                  cover
                  transition-show="scale"
                  transition-hide="scale"
                >
                  <q-date v-model="item.endDate" :readonly="viewingApplication">
                    <div class="row items-center justify-end">
                      <q-btn
                        v-close-popup
                        label="Cerrar"
                        color="primary"
                        flat
                      />
                    </div>
                  </q-date>
                </q-popup-proxy>
              </q-icon>
            </template>
          </q-input>
        </div>

        <div
          class="row q-gutter-x-sm"
          style="padding-left: 1.3%; padding-top: 10px"
        >
          <q-input
            dark
            outlined
            v-model="item.startingPosition"
            color="cyan-1"
            style="width: 30%"
            inline
            lazy-rules
            :rules="[positionRule]"
            :readonly="viewingApplication"
            type="text"
            label="Puesto inicial"
            label-color="white"
          >
          </q-input>
          <q-input
            dark
            outlined
            v-model="item.endingPosition"
            color="cyan-1"
            style="width: 30%"
            inline
            lazy-rules
            :rules="[positionRule]"
            :readonly="viewingApplication"
            type="text"
            label="Puesto final"
            label-color="white"
          >
          </q-input>
          <q-input
            prefix="$ MXN"
            dark
            outlined
            v-model="item.startMontlySalary"
            color="cyan-1"
            style="width: 18%"
            inline
            lazy-rules
            :rules="[salaryRule]"
            :readonly="viewingApplication"
            mask="######"
            min="0"
            label="Sueldo mensual inicial"
            label-color="white"
          >
          </q-input>
          <q-input
            prefix="$ MXN"
            dark
            outlined
            v-model="item.endingMontlySalary"
            color="cyan-1"
            style="width: 18%"
            inline
            min="0"
            lazy-rules
            :rules="[salaryRule]"
            :readonly="viewingApplication"
            mask="######"
            label="Sueldo mensual final"
            label-color="white"
          >
          </q-input>
        </div>

        <q-input
          dark
          outlined
          v-model="item.functionsPerformed"
          color="cyan-1"
          style="padding-left: 1.3%; padding-top: 10px; width: 99%"
          inline
          lazy-rules
          :rules="[functionsPerformedRule]"
          :readonly="viewingApplication"
          type="text"
          label="Funciones Desempeñadas"
          label-color="white"
        >
        </q-input>

        <q-input
          dark
          outlined
          v-model="item.separationCause"
          color="cyan-1"
          style="padding-left: 1.3%; padding-top: 10px; width: 99%"
          inline
          lazy-rules
          :rules="[separationCauseRule]"
          :readonly="viewingApplication"
          type="text"
          label="Causas de separación"
          label-color="white"
        >
        </q-input>
      </q-card>
    </q-expansion-item>
    <div
      v-if="!viewingApplication"
      class="full-width row justify-end"
    >
      <q-btn
        v-if="!viewingApplication"
        flat
        @click.prevent="addLaboralExperience"
        rounded
        dense
        label="Añadir otro"
        icon="add"
        color="white"
        class="bg-teal-4"
        :disable="disableAddButton"
      />
      <q-btn
        flat
        @click.prevent="removeLaboralExperience"
        rounded
        dense
        label="Borrar último"
        icon="delete"
        color="white"
        class="q-ml-md"
        :class="laboralExperienceData.length <= 1 ? 'bg-grey' : 'bg-red'"
        :disable="laboralExperienceData.length === 1"
      />
    </div>
    <ButtonApplicationStatus v-if="updatingApplication"/>
  </q-layout>
</template>

/* SCRIPT SETUP BEGINS
.........................................................................................................................
*/

<script setup>
import ButtonApplicationStatus from "./ButtonApplicationStatus.vue";
import { ref, computed, onMounted } from "vue";
import { useRequestUser } from "src/stores/requestUser";
import { useLocalStorageStore } from "src/stores/localStorage";
import { storeToRefs } from "pinia";
import { useQuasar } from "quasar";
import { notifyPositive } from "src/utils/notifies";

const $q = useQuasar();
const useRequest = useRequestUser();
const useLocalStorage = useLocalStorageStore();

const currentIndex = ref(0);

const {
  laboralExperienceData,
  savedApplication,
  viewingApplication,
  updatingApplication,
} = storeToRefs(useRequest);

onMounted(() => {
  loadLocalStore();

  if (viewingApplication.value || updatingApplication.value) {
    setSavedStoredValues();
    if (updatingApplication.value) {
      setCurrentIndex();
    }
  } else {
    setCurrentIndex();

  }
});

const setSavedStoredValues = () => {
  laboralExperienceData.value = savedApplication.value.experiencia_laboral;
};

//TODO: Encontrar una mejor manera para checar cada campo del objeto en el arreglo
//NOTE: Esta fea esta cosa pero funcionara en lo que mientras xd
const disableAddButton = computed(() => {
  return (
    !laboralExperienceData.value[currentIndex.value].company ||
    !laboralExperienceData.value[currentIndex.value].address ||
    !laboralExperienceData.value[currentIndex.value].phone ||
    !laboralExperienceData.value[currentIndex.value].lastBossName ||
    !laboralExperienceData.value[currentIndex.value].lastBossPosition ||
    !laboralExperienceData.value[currentIndex.value].startDate ||
    !laboralExperienceData.value[currentIndex.value].endDate ||
    !laboralExperienceData.value[currentIndex.value].startingPosition ||
    !laboralExperienceData.value[currentIndex.value].endingPosition ||
    !laboralExperienceData.value[currentIndex.value].startMontlySalary ||
    !laboralExperienceData.value[currentIndex.value].endingMontlySalary ||
    !laboralExperienceData.value[currentIndex.value].functionsPerformed ||
    !laboralExperienceData.value[currentIndex.value].separationCause
  );
});

const addLaboralExperience = () => {
  laboralExperienceData.value.push({
    company: "",
    address: "",
    phone: "",
    lastBossName: "",
    lastBossPosition: "",
    startDate: "",
    endDate: "",
    startingPosition: "",
    endingPosition: "",
    startMontlySalary: "",
    endingMontlySalary: "",
    functionsPerformed: "",
    separationCause: ""
  });
  laboralExperienceData.value[currentIndex.value].expanded = false;
  currentIndex.value++;
};

const removeLaboralExperience = () => {
  laboralExperienceData.value.pop();
  setCurrentIndex();
};

const setCurrentIndex = () => {

  if(laboralExperienceData.value.length > 0){
    currentIndex.value = laboralExperienceData.value.length - 1;
  }
}

/* INPUTS KEY - VALUE - RULES -------------------------------------- */

const locationRule = (value) => {
  const charactersValid = /^([a-zA-Z0-9,.áéíóúÁÉÍÓÚüÜ -])*$/.test(value);
  const requiredValid = !!value;

  if (!charactersValid) {
    return "Ingresa un domicilio válido";
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

const lettersRule = (value) => {
  const charactersValid = /^([a-zA-Z,.\- ])*$/.test(value);
  const requiredValid = !!value;

  if (!charactersValid) {
    return "Ingresa solo letras";
  } else if (!requiredValid) {
    return "Este campo es requerido";
  }

  return true; // La validación pasa
};

const positionRule = (value) => {
  const requiredValid = !!value;

  if (!requiredValid) {
    return "Este campo es requerido";
  }

  return true; // La validación pasa
};

const salaryRule = (value) => {
  const charactersValid = /^([$]|[0-9]|[,.-])*$/.test(value);
  const requiredValid = !!value;

  if (!charactersValid) {
    return "Ingresa un salario válido";
  } else if (!requiredValid) {
    return "Este campo es requerido";
  }

  return true; // La validación pasa
};

const functionsPerformedRule = (value) => {
  const requiredValid = !!value;

  if (!requiredValid) {
    return "Este campo es requerido";
  }

  return true; // La validación pasa
};

const separationCauseRule = (value) => {
  const requiredValid = !!value;

  if (!requiredValid) {
    return "Este campo es requerido";
  }

  return true; // La validación pasa
};

const dateRule = (value) => {
  const dateValid = /^\d{4}\/\d{2}\/\d{2}$/.test(value);
  const requiredValid = !!value;

  if (!dateValid) {
    return "Ingresa una fecha válida";
  } else if (!requiredValid) {
    return "Este campo es requerido";
  }

  return true; // La validación pasa
};

const saveLocalStore = () => {
  useLocalStorage.save("laboralExperienceData", laboralExperienceData.value);
  if (!viewingApplication.value && !updatingApplication.value) {
    $q.notify(notifyPositive("Se ha guardado su progreso.", 1000));
  }
};

const loadLocalStore = () => {
  const localStoreData = useLocalStorage.load("laboralExperienceData");

  if (localStoreData) laboralExperienceData.value = localStoreData;

};
</script>

<style scoped>
.rounded-borders {
  border-radius: 20px;
  /* Ajusta el valor de 20px según tus preferencias */
}

.expansionCard {
  border-radius: 10px;
  background: rgb(30, 30, 30);
}

</style>
