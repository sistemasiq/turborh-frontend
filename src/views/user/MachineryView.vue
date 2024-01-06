<template>
  <q-layout
    style="background-color: rgb(30, 61, 88)"
    v-on:vnode-unmounted="saveLocalStore()"
  >
    <q-card flat bordered class="rounded-borders">
      <q-card-section class="title">
        <p>Maquinaria y herramientas que manejas</p>
      </q-card-section>
      <q-card-section class="handling-content">
        <pagination-application :page="8" />
        <div v-if="!viewingApplication" style="margin-top: 4%">
          <q-btn-dropdown
            :disable="machinery.length === 0"
            class="q-mb-md button-dropdown"
            label="Maquinaría"
          >
            <q-list>
              <q-item
                v-for="(item, index) in machinery"
                :key="index"
                clickable
                v-close-popup
                @click.prevent="addMachinery(item)"
              >
                <q-item-section>
                  <q-item-label>{{ item }}</q-item-label>
                </q-item-section>
              </q-item>
            </q-list>
          </q-btn-dropdown>
          <q-btn-dropdown
            :disable="tools.length === 0"
            class="q-mb-md button-dropdown"
            label="Herramienta"
          >
            <q-list>
              <q-item
                v-for="(item, index) in tools"
                :key="index"
                clickable
                v-close-popup
                @click.prevent="addTools(item)"
              >
                <q-item-section>
                  <q-item-label>{{ item }}</q-item-label>
                </q-item-section>
              </q-item>
            </q-list>
          </q-btn-dropdown>
          <q-btn-dropdown
            :disable="measuringInstruments.length === 0"
            class="q-mb-md button-dropdown"
            style="width: 24%"
            label="Instrumentos de medición"
          >
            <q-list>
              <q-item
                v-for="(item, index) in measuringInstruments"
                :key="index"
                clickable
                v-close-popup
                @click.prevent="addMeasuringInstruments(item)"
              >
                <q-item-section>
                  <q-item-label>{{ item }}</q-item-label>
                </q-item-section>
              </q-item>
            </q-list>
          </q-btn-dropdown>
          <q-btn-dropdown
            :disable="otherTools.length === 0"
            class="q-mb-md button-dropdown"
            style="width: 24%"
            label="Otros"
          >
            <q-list>
              <q-item
                v-for="(item, index) in otherTools"
                :key="index"
                clickable
                v-close-popup
                @click.prevent="addOtherTool(item)"
              >
                <q-item-section>
                  <q-item-label>{{ item }}</q-item-label>
                </q-item-section>
              </q-item>
            </q-list>
          </q-btn-dropdown>
        </div>
        <p
          v-if="machineryData.length > 0"
          class="text-h5 text-center q-mt-xl text-white"
        >
          Maquinaría
        </p>
        <q-expansion-item
          default-opened
          switch-toggle-side
          :label="item.name"
          class="rounded-borders q-mt-lg"
          v-for="(item, index) in machineryData"
          :key="index"
          flat
          bordered
          style="background-color: white"
        >
          <q-btn
            v-if="!viewingApplication"
            style="margin-left: 95%"
            color="red"
            icon="close"
            @click.prevent="removeMachinery(item)"
          />
          <q-input
            v-if="item.type === 'Otro'"
            v-model="item.name"
            class="q-pa-sm q-pb-lg"
            outlined
            type="text"
            color="blue-grey"
            label="Especifica el nombre de la maquinaria"
            label-color="black"
            :rules="[(value) => !!value || 'Este campo no puede estar vacío.']"
            :readonly="viewingApplication"
          >
          </q-input>
          <q-input
            v-model="item.model"
            class="q-pa-sm q-pb-lg"
            outlined
            type="text"
            color="blue-grey"
            label="Especifica el modelo o tipo"
            label-color="black"
            :rules="[(value) => !!value || 'Este campo no puede estar vacío.']"
            :readonly="viewingApplication"
          >
          </q-input>
          <q-input
            v-model="item.time"
            class="q-pa-sm q-pb-lg"
            outlined
            type="text"
            color="blue-grey"
            label="Especifica cuanto tiempo de experiencia con la maquinaria seleccionada"
            label-color="black"
            :rules="[(value) => !!value || 'Este campo no puede estar vacío.']"
            :readonly="viewingApplication"
          >
          </q-input>
          <q-input
            v-model="item.description"
            class="q-pa-sm q-pb-lg"
            outlined
            type="textarea"
            color="blue-grey"
            label="Especifica que proyecto realizaste con la maquinaria seleccionada"
            label-color="black"
            :rules="[(value) => !!value || 'Este campo no puede estar vacío.']"
            :readonly="viewingApplication"
          >
          </q-input>
        </q-expansion-item>
        <p
          v-if="toolsData.length > 0"
          class="text-h5 text-center q-mt-xl text-white"
        >
          Herramienta
        </p>
        <q-expansion-item
          default-opened
          switch-toggle-side
          :label="item.toolName"
          class="rounded-borders q-mt-lg"
          v-for="(item, index) in toolsData"
          :key="index"
          flat
          bordered
          style="background-color: white"
        >
          <q-btn
            v-if="!viewingApplication"
            style="margin-left: 95%"
            color="red"
            icon="close"
            @click.prevent="removeTools(item)"
          />
          <q-input
            v-model="item.toolDescription"
            class="q-pa-sm q-pb-lg"
            outlined
            type="text"
            color="blue-grey"
            label="Especifica cual"
            label-color="black"
            :rules="[(value) => !!value || 'Este campo no puede estar vacío.']"
            :readonly="viewingApplication"
          >
          </q-input>
        </q-expansion-item>
        <p
          v-if="measuringInstrumentsData.length > 0"
          class="text-h5 text-center q-mt-xl text-white"
        >
          Instrumentos de medición
        </p>
        <q-expansion-item
          default-opened
          switch-toggle-side
          :label="measuringInstrumentsData[index].measuringInstrumentName"
          class="rounded-borders q-mt-lg"
          v-for="(item, index) in measuringInstrumentsData"
          :key="index"
          flat
          bordered
          style="background-color: white"
        >
          <q-btn
            style="margin-left: 95%"
            color="red"
            icon="close"
            @click.prevent="removeMeasuringInstruments(item)"
            v-if="!viewingApplication"
          />
          <q-input
            v-model="
              measuringInstrumentsData[index].measuringInstrumentDescription
            "
            class="q-pa-sm q-pb-lg"
            outlined
            type="text"
            color="blue-grey"
            label="Especifica cuales"
            label-color="black"
            :rules="[(value) => !!value || 'Este campo no puede estar vacío.']"
            :readonly="viewingApplication"
          >
          </q-input>
        </q-expansion-item>
        <p
          v-if="otherToolsData.length > 0"
          class="text-h5 text-center q-mt-xl text-white"
        >
          Otros
        </p>
        <q-expansion-item
          default-opened
          switch-toggle-side
          :label="item.otherToolName"
          class="rounded-borders q-mt-md"
          v-for="(item, index) in otherToolsData"
          :key="index"
          flat
          bordered
          style="background-color: white"
        >
          <q-btn
            v-if="!viewingApplication"
            style="margin-left: 95%"
            color="red"
            icon="close"
            @click.prevent="removeOtherTool(item)"
          />
          <q-input
            v-if="item.otherToolName === 'Computadora'"
            v-model="item.toolDescription"
            class="q-pa-sm q-pb-lg"
            outlined
            type="text"
            color="blue-grey"
            label="Especifica que software has usado"
            label-color="black"
            :rules="[(value) => !!value || 'Este campo no puede estar vacío.']"
            :readonly="viewingApplication"
          >
          </q-input>
        </q-expansion-item>
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
import { notifyPositive } from "src/utils/notifies";
import { useQuasar } from "quasar";
import { getAllMachineryActive } from "src/services/machineryTools";

const $q = useQuasar();
const useRequest = useRequestUser();
const useLocalStorage = useLocalStorageStore();

const {
  machineryData,
  toolsData,
  measuringInstrumentsData,
  otherToolsData,
  savedApplication,
  viewingApplication,
  updatingApplication,
} = storeToRefs(useRequest);

const machinery = ref([]);

const tools = ref([]);

const measuringInstruments = ref([]);

const otherTools = ref([]);

onMounted(() => {

  fillCatalog();

  if(!viewingApplication.value && !updatingApplication.value){
    loadLocalStore();
  }

  if (viewingApplication.value || updatingApplication.value) {
    setSavedStoredValues();
  }

  setStoredValues();
  sortAlphabetical(machinery.value, true);
  sortAlphabetical(measuringInstruments.value);
  sortAlphabetical(tools.value);
});

const fillCatalog = async () => {

  if(viewingApplication.value)
  return;

  try {
    const catalog = await getAllMachineryActive()
    console.log(catalog);

    if(catalog) {
      catalog.forEach(element => {
        switch (element.type) {
          case "MA":

            machinery.value.push(element.name);
            break;
          case "HE":
            tools.value.push(element.name); // Assuming tools is a ref
            break;
          case "IN":
            measuringInstruments.value.push(element.name); // Assuming measuringInstruments is a ref
            break;
          case "OT":

          otherTools.value.push(element.name);
            break;
          default:
            break;
        }
      })

    }
  } catch (error) {

  }

}

const setSavedStoredValues = () => {
  if (machineryData.value.length === 0) {
    savedApplication.value.manejo_maquinas_herramientas.forEach((element) => {
      if (element.name != null) {
        machineryData.value.push(element);
      }
    });
  }

  if (toolsData.value.length === 0) {
    savedApplication.value.manejo_maquinas_herramientas.forEach((element) => {
      if (element.toolName != null) {
        toolsData.value.push(element);
      }
    });
  }

  if (measuringInstrumentsData.value.length === 0) {
    savedApplication.value.manejo_maquinas_herramientas.forEach((element) => {
      if (element.measuringInstrumentName != null) {
        measuringInstrumentsData.value.push(element);
      }
    });
  }

  if (otherToolsData.value.length === 0) {
    savedApplication.value.manejo_maquinas_herramientas.forEach((element) => {
      if (element.otherToolName != null) {
        otherToolsData.value.push(element);
      }
    });
  }
};

const setStoredValues = () => {
  machineryData.value.forEach((element) => {
    removeRepeatedMachinery(element.name);
  });
  toolsData.value.forEach((element) => {
    removeRepeatedTool(element.toolName);
  });
  measuringInstrumentsData.value.forEach((element) => {
    removeRepeatedMeasuringInstrument(element.measuringInstrumentName);
  });
  otherToolsData.value.forEach((element) => {

    removeRepeatedOtherTool(element.otherToolName);
  });
};

const removeRepeatedMachinery = (name) => {
  machinery.value = machinery.value.filter((element) => {
    return element !== name;
  });
};
const removeRepeatedTool = (name) => {
  tools.value = tools.value.filter((element) => {
    return element !== name;
  });
};
const removeRepeatedMeasuringInstrument = (name) => {
  measuringInstruments.value = measuringInstruments.value.filter((element) => {
    return element !== name;
  });
};
const removeRepeatedOtherTool = (name) => {
  otherTools.value = otherTools.value.filter((element) => {
    return element !== name;
  });
};

const addMachinery = (item) => {
  if (item === "Otro") {
    machineryData.value.push({
      name: item,
      model: "",
      time: "",
      description: "",
      type: "Otro",
    });
    return;
  }

  const index = machinery.value.indexOf(item);
  if (index != -1) {
    machinery.value.splice(index, 1);
  }

  machineryData.value.push({
    name: item,
    model: "",
    time: "",
    description: "",
  });
};

const removeMachinery = (item) => {
  const index = machineryData.value.indexOf(item);
  if (index != -1) {
    machineryData.value.splice(index, 1);
  }
  if (item.type !== "Otro") {
    machinery.value.push(item.name);
    sortAlphabetical(machinery.value, true);
  }
};

const addTools = (item) => {
  const index = tools.value.indexOf(item);
  if (index != -1) {
    tools.value.splice(index, 1);
  }
  toolsData.value.push({
    toolName: item,
    toolDescription: "",
  });
};

const removeTools = (item) => {
  const index = toolsData.value.indexOf(item);
  if (index != -1) {
    toolsData.value.splice(index, 1);
  }
  tools.value.push(item.toolName);
  sortAlphabetical(tools.value);
};

const addMeasuringInstruments = (item) => {
  const index = measuringInstruments.value.indexOf(item);
  if (index != -1) {
    measuringInstruments.value.splice(index, 1);
  }
  measuringInstrumentsData.value.push({
    measuringInstrumentName: item,
    measuringInstrumentDescription: "",
  });
};

const removeMeasuringInstruments = (item) => {
  const index = measuringInstrumentsData.value.indexOf(item);
  if (index != -1) {
    measuringInstrumentsData.value.splice(index, 1);
  }
  measuringInstruments.value.push(item.measuringInstrumentName);
  sortAlphabetical(measuringInstruments.value);
};

const addOtherTool = (item) => {
  const index = otherTools.value.indexOf(item);
  if (index != -1) {
    otherTools.value.splice(index, 1);
  }
  otherToolsData.value.push({
    otherToolName: item,
    otherToolDescription: "",
  });
};

const removeOtherTool = (item) => {
  const index = otherToolsData.value.indexOf(item);
  if (index != -1) {
    otherToolsData.value.splice(index, 1);
  }
  otherTools.value.push(item.otherToolName);
  sortAlphabetical(otherTools.value);
};

const sortAlphabetical = (array) => {
  array.sort((a, b) => a.localeCompare(b));
};

const saveLocalStore = () => {

  if(viewingApplication.value || updatingApplication.value)
  return;

  useLocalStorage.save("machineryData", machineryData.value);
  useLocalStorage.save("toolsData", toolsData.value);
  useLocalStorage.save("otherToolsData", otherToolsData.value);
  useLocalStorage.save(
    "measuringInstrumentsData",
    measuringInstrumentsData.value
  );

  if (!viewingApplication.value && !updatingApplication.value) {
    $q.notify(notifyPositive("Se ha guardado su progreso.",1000));
  }
};

const loadLocalStore = () => {
  const localMachineryStoreData = useLocalStorage.load("machineryData");
  const localToolsStoreData = useLocalStorage.load("toolsData");
  const localOtherToolsStoreData = useLocalStorage.load("otherToolsData");
  const localMeasuringStoreData = useLocalStorage.load(
    "measuringInstrumentsData"
  );

  if (localMachineryStoreData) {
    machineryData.value = localMachineryStoreData;
  }

  if (localToolsStoreData) {
    toolsData.value = localToolsStoreData;
  }

  if (localOtherToolsStoreData) {
    otherToolsData.value = localOtherToolsStoreData;
  }

  if (localMeasuringStoreData) {
    measuringInstrumentsData.value = localMeasuringStoreData;
  }
};
</script>

<style scoped>
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

.rounded-borders {
  border-radius: 15px;
  background-color: rgba(49, 49, 49, 0.473) 51%;
}

.handling-content {
  height: 100%;
  padding-top: 2%;
}
</style>
