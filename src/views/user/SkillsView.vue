<template>
  <q-layout
    style="background-color: rgb(30, 61, 88)"
    v-on:vnode-unmounted="saveLocalStore()"
  >
    <q-card flat bordered class="rounded-borders">
      <q-card-section class="title">
        <p>Oficios en los que te has desempeñado</p>
      </q-card-section>
      <q-card-section class="content">
        <pagination-application :page="9"></pagination-application>
        <p
          class="text-h5 text-center q-mt-xl text-white"
          v-if="hasNoSkillsRegistered"
        >
          Sin oficios registrados
        </p>
        <div v-if="!hasNoSkillsRegistered" style="margin-top: 6%">

          <div class="q-mt-xl">
            <q-btn-dropdown
              v-if="!viewingApplication"
              :disable="offices.length === 0"
              class="q-mb-md button-dropdown"
              label="Lista de oficios"
            >
              <q-list>
                <q-item
                  v-for="(item, index) in offices"
                  :key="index"
                  clickable
                  v-close-popup
                  @click.prevent="addOffice(item)"
                >
                  <q-item-section>
                    <q-item-label>{{ item }}</q-item-label>
                  </q-item-section>
                </q-item>
              </q-list>
            </q-btn-dropdown>
          </div>
          <q-expansion-item
            default-opened
            expand-separator
            switch-toggle-side
            :label="officesData[index].name"
            class="rounded-borders q-mt-md"
            v-for="(item, index) in officesData"
            :key="index"
            flat
            bordered
            style="background-color: white"
          >
            <div class="handling-item row items-center">
              <q-btn
                v-if="!viewingApplication"
                flat
                class="bg-red"
                style="margin-left: 95%"
                color="white  "
                icon="close"
                @click.prevent="removeOffice(item)"
              />
            </div>
            <q-input
              v-model="item.time"
              class="q-pa-sm q-pb-lg"
              outlined
              type="text"
              color="blue-grey"
              label="Especifica cuanto tiempo de experiencia en el oficio seleccionado"
              label-color="black"
              :rules="[
                (value) => !!value || 'Este campo no puede estar vacío.',
              ]"
              :readonly="viewingApplication"
            >
            </q-input>
            <q-input
              v-model="item.description"
              class="q-pa-sm q-pb-lg"
              outlined
              type="text"
              color="blue-grey"
              label="Especifica tus principales logros o proyectos en el oficio seleccionado"
              label-color="black"
              :rules="[
                (value) => !!value || 'Este campo no puede estar vacío.',
              ]"
              :readonly="viewingApplication"
            >
            </q-input>
          </q-expansion-item>
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
const hasNoSkillsRegistered = ref(false);

const {
  officesData,
  savedApplication,
  viewingApplication,
  updatingApplication,
} = storeToRefs(useRequest);

const offices = ref([
  "Mécanico Automotríz",
  "Electricista",
  "Electrónico",
  "Chofer",
  "Secretaría",
  "Auxiliar Contable",
  "Intendencia",
  "Vigilancia",
  "Logística",
  "Empaque y/o emplayado",
  "Carpintería",
]);

onMounted(() => {
  loadLocalStore();

  sortOffices();

  if (viewingApplication.value || updatingApplication.value) {
    setSavedStoredValues();
  }

  setStoredValues();
});

const setSavedStoredValues = () => {
  officesData.value = savedApplication.value.conocimientos_oficios;
  hasNoSkillsRegistered.value = officesData.value.length === 0
};

const setStoredValues = () => {
  officesData.value.forEach((element) => {
    removeRepeatedOffice(element.name);
  });
};
const removeRepeatedOffice = (name) => {
  offices.value = offices.value.filter((element) => {
    return element !== name;
  });
};

const sortOffices = () => {
  offices.value.sort((a, b) => a.localeCompare(b));
};

const addOffice = (item) => {
  const index = offices.value.indexOf(item);
  if (index != -1) {
    offices.value.splice(index, 1);
  }

  officesData.value.push({
    name: item,
    time: "",
    description: "",
  });
};

const removeOffice = (item) => {
  const index = officesData.value.indexOf(item);
  if (index != -1) {
    officesData.value.splice(index, 1);
  }
  offices.value.push(item.name);
  sortOffices();
};

const saveLocalStore = () => {
  if (!viewingApplication.value && !updatingApplication.value) {
    useLocalStorage.save("officesData", officesData.value);
    $q.notify(notifyPositive("Se ha guardado su progreso.",1000));
  }
};

const loadLocalStore = () => {
  const localStoreData = useLocalStorage.load("officesData");

  if (localStoreData) officesData.value = localStoreData;
};
</script>

<style scoped>
.title {
  font-size: large;
  color: rgb(40, 55, 68);
}
.button-dropdown {
  border-color: #ffffff;
  color: white;
  border-style: solid;
  border-width: 1px;
  width: 15%;
  height: 55px;
  margin-left: 3%;
  background-color: transparent;
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

.rounded-borders {
  border-radius: 15px;
  background-color: rgba(49, 49, 49, 0.473) 51%;
}

.content {
  height: 100%;
  background-color: rgb(40, 55, 68);
  padding-top: 2%;
}
</style>
