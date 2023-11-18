<template>
  <q-table
    flat
    bordered
    style="background: rgb(247, 248, 255)"
    title="Listado de herramientas"
    v-bind:rows="filteredRows"
    separator="horizontal"
    @request="showJobs"
    :columns="columns"
    row-key="name"
    :loading="loading"
    :filter="filter"
    loading-label="Cargando puestos..."
    rows-per-page-label="Puestos por página"
    :table-header-class="{ 'table-header-style': [true] }"
    :table-class="{ 'table-body-style': [true] }"
    class="my-sticky-header-table q-pa-md"
    v-bind:no-data-label="noDataLabel"
    no-results-label="No hay coincidencias con la busqueda"
    :rows-per-page-options="[5, 10, 15]"
  >
    <template v-slot:top-right>
      <q-card-actions horizontal align="center">
        <q-checkbox
          unchecked-icon="remove_circle_outline"
          checked-icon="check_circle"
          left-label
          v-model="showDeletedJobs"
          label="Mostrar solo eliminados"
          size="lg"
          color="teal-5"
          :disable="disableCheckbox"
        />
        <q-input
          borderless
          dense
          debounce="300"
          v-model="filter"
          placeholder="Buscar"
          class="q-pl-sm q-pr-sm"
          style="
            background: rgb(255, 255, 255);
            border-radius: 5px;
            width: 250px;
            border-radius: 100px;
          "
        >
          <template v-slot:append>
            <q-icon name="search" />
          </template>
        </q-input>
        <q-btn
          class="q-ml-md"
          style="background: rgba(34, 211, 111, 85%)"
          rounded
          flat
          color="white"
          icon="add"
          label="Crear"
          @click.prevent="cardEdition('create', '')"
        />
      </q-card-actions>
    </template>

    <template v-slot:body-cell-name="{ row }">
      <q-td>
        <div>{{ row.name }}</div>
      </q-td>
    </template>

    <template v-slot:body-cell-type="{ row }">
      <q-td class="text-center">
        <div>
          {{
            row.type == "MA"
              ? "Maquinaria"
              : row.type == "HE"
              ? "Herramienta"
              : row.type == "IN"
              ? "Instrumentos de medición"
              : "Otros"
          }}
        </div>
      </q-td>
    </template>

    <template v-slot:body-cell-edicionPuestos="props">
      <q-td class="text-right">
        <q-btn
          class="q-ml-sm"
          style="background: rgb(47, 171, 171); width: 70px; height: 16px"
          rounded
          flat
          color="white"
          icon="edit"
          @click.prevent="cardEdition('update', props.row)"
        >
          <Tooltip :text="'Modificar'" />
        </q-btn>

        <q-btn
          class="q-ml-sm"
          :class="getDesignStatusJob(props).buttonColor"
          style="width: 70px; height: 16px"
          rounded
          flat
          color="white"
          :icon="getDesignStatusJob(props).buttonIcon"
          @click="deleteTool(props.row)"
        >
          <q-tooltip
            class="bg-dark text-white text-body2"
            anchor="top middle"
            self="center middle"
            transition-show="slide-up"
            transition-hide="fade"
            :delay="300"
            transition-duration="300"
            :offset="[10, 25]"
          >
            {{ getDesignStatusJob(props).tooltipText }}
          </q-tooltip>
        </q-btn>
      </q-td>
    </template>
  </q-table>
  <q-dialog v-model="deleteDialog" persistent>
    <q-card rounded style="border-radius: 30px">
      <q-card-section class="row items-center">
        <span class="q-ml-sm text-h6 text-weight-regular">
          {{
            isToolActive == 1
              ? "¿Quieres desactivar este puesto?"
              : "¿Quieres activar este puesto?"
          }}
        </span>
      </q-card-section>

      <q-card-actions align="center">
        <q-btn flat label="Cancelar" color="primary" v-close-popup />
        <q-btn
          rounded
          flat
          :label="selectedTool.active ? 'Desactivar' : 'Activar'"
          v-close-popup
          :class="selectedTool.active ? 'bg-red-5' : 'bg-orange-5'"
          class="text-white"
          @click.prevent="confirmDeleteTool()"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>

  <q-dialog v-model="createDialog">
    <q-card>
      <q-card-section>
        <div class="text-h6">Edición de Maquinaría y herramientas</div>
      </q-card-section>

      <q-separator />

      <q-card-section
        style="width: 550px; max-width: 90vw; max-height: 50vh"
        class="justify-between row"
      >
        <q-input
          light
          outlined
          color="black"
          v-model="name"
          label="Nombre"
          label-color="black"
          lazy-rules
          :rules="[(value) => !!value || 'Este campo no puede estar vacío.']"
          style="width: 40%"
        />

        <q-select
          light
          filled
          label-color="black"
          v-model="selectedType"
          :options="types"
          label="Tipo"
          style="width: 45%"
        />
      </q-card-section>

      <q-separator />

      <q-card-actions align="right">
        <q-btn flat label="Cancelar" color="red" v-close-popup />

        <q-btn
        v-if="operation == 'create'"
          flat
          label="Aceptar"
          color="green"
          v-close-popup
          @click="createJob()"
        />
        <q-btn
        v-if="operation == 'update'"
          flat
          label="Guardar"
          color="blue"
          v-close-popup
          @click="updateTool()"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

/* Script
==================================================================================================================================================*/
<script setup>
import { ref, computed, onMounted } from "vue";
import Tooltip from "src/components/Tooltip.vue";
import axios from "axios";
import { useQuasar } from "quasar";
import { useRouter } from "vue-router";
import { notifyNegative, notifyPositive } from "src/utils/notifies";

const router = useRouter();
const $q = useQuasar();

const createDialog = ref(false);
const id = ref("");
const createdBy = ref("101");
const modifiedBy = ref ("101")
const name = ref("");
const selectedType = ref("");
const deleteDialog = ref(false);
const selectedJob = ref();
const showDeletedJobs = ref(false);
const filter = ref("");
const noDataLabel = ref("No hay puestos existentes");
const loading = ref(false);
const totalTableRows = ref([]);
const disableCheckbox = ref(false);
const operation = ref("");
const selectedTool = ref("");
const isToolActive = ref();


const types = [
  "Maquinaria",
  "Herramienta",
  "Instrumentos de medición",
  "Otros",
];

const columns = [
  {
    name: "name",
    label: "Nombre de la herramienta",
    required: true,
    align: "left",
    field: (row) => row.name,
    sortable: true,
  },
  {
    name: "type",
    label: "Tipo",
    required: true,
    align: "center",
    field: (row) => row.type,
    sortable: true,
  },
  {
    name: "edicionPuestos",
    label: "Opciones de edición",
    required: true,
    align: "right",
    field: (props) => props.row,
  },
];

onMounted(() => {
  showJobs();
});

const getDesignStatusJob = (props) => {
  const active = props.row.active;
  console.log("ACTIVE: " + active);
  return {
    tooltipText: active === 1 ? "Desactivar" : "Activar",
    buttonColor: active === 1 ? "bg-red-5" : "bg-orange-5",
    buttonIcon: active === 1 ? "delete" : "restore",
    dialogText:
      active === 1
        ? "¿Quieres eliminar este puesto?"
        : "¿Quieres activar este puesto?",
  };
};

const showJobs = async () => {
  try {
    $q.loading.show("Cargando...");
    const request = await axios.get(`/machinerytools/catalog`, {
      timeout: 18000,
    });

    if (request.status === 200) {
      totalTableRows.value = request.data;
      $q.loading.hide();
    }
  } catch (error) {
    console.log("Hubo un error al obtener los datos: " + error);
  }
};

const createJob = async () => {
  const url = `/machinerytools/newmachinerytools`;
  if (selectedType.value != "" && name.value != "") {
    const elementType = selectedType.value.substring(0, 2).toUpperCase();
    console.log("elementType: ",elementType);

    const data = {
      createdBy: createdBy.value,
      type: elementType,
      name: name.value,
    };
    try {
      $q.loading.show("Cargando...");
      const request = await axios.post(url, data);

      if (request.status == 200) {
        console.log(request.data);
        totalTableRows.value.push(request.data);
        $q.loading.hide();
        $q.notify(notifyPositive("Registro exitoso"));
      }
    } catch (error) {
      $q.notify(notifyNegative("Hubo un error al ingresar el elemento"));
    } finally {
      createdBy.value = "";
      selectedType.value = "";
      name.value = "";
    }
  } else {
    $q.notify(notifyNegative("Ambos campos deben ser llenados"));
  }
};

const confirmDeleteTool = async () => {
  console.log("Entró 2");
  const apiUrl = "/machinerytools/offmachinerytools";
  $q.loading.show();
  try {
    const request = await axios.put(apiUrl, null, {
      params: {
        id: id.value,
      },
    });

    if (request.status === 200) {
      console.log("Entró 3");

      $q.notify({
        type: "positive",
        message: selectedTool.value.active
          ? "El puesto se ha desactivado correctamente"
          : "El puesto se ha activado correctamente",
        position: "top",
        timeout: 5000,
        actions: [{ label: "Cerrar", color: "yellow" }],
      });

        const toolIndex = totalTableRows.value
        .map((tool) =>{
          return tool.id;
        })
        .indexOf(data, id);
        totalTableRows.value[toolIndex].active = 0;//[].active=0

        $q.loading.hide();
        $q.notify(notifyPositive("Registro exitoso"));
      changeJobStatus(params);
    }
  } catch (error) {
    if (axios.isCancel(error)) {
      console.log("La solicitud fue cancelada.");
    } else {
      console.log("Error:", error);
      console.log(
        "Error al conectar con el servidor: Tiempo de espera agotado."
      );
      $q.notify({
        type: "negative",
        message: "Hubo un problema al desactivar el puesto",
        position: "top",
        timeout: 5000,
        actions: [{ label: "Cerrar", color: "yellow" }],
      });
      loading.value = false;
    }
}
};

const deleteTool= (row) => {
  isToolActive.value = row.active
  id.value = row.id
  deleteDialog.value = !deleteDialog.value;
  console.log("Entró 1: ", row.active);
};

const cardEdition = (opType, props) => {
  operation.value = opType;

  if(operation.value == 'create') {
    createdBy.value = "";
    selectedType.value = "";
    name.value = "";
  }else if(operation.value == 'update') {
    id.value = props.id
    modifiedBy.value = props.modifiedBy;
    selectedType.value = props.type;
    name.value = props.name;
  }
  createDialog.value = !createDialog.value;
}

const filteredRows = computed(() => {
  return totalTableRows.value.filter((job) => {
    return showDeletedJobs.value ? job.active === 0 : job.active === 1;
  });
});

</script>

/* Style
==================================================================================================================================================*/

<style scoped>
.my-sticky-header-table thead tr th {
  position: sticky;
  z-index: 1;
}

.my-sticky-header-table tbody {
  scroll-margin-top: 48px;
}

.table-body-style {
  background-color: rgb(255, 255, 255);
}
</style>
