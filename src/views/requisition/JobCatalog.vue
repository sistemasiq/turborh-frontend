<template>
  <q-table
    flat
    bordered
    style="background: rgb(247, 248, 255)"
    title="Listado de puestos"
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
    :rows-per-page-options="[10, 20, 30]"
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
          @click.prevent="createJob()"
        />
      </q-card-actions>
    </template>

    <template v-slot:body-cell-jobName="{ row }">
      <q-td>
        <div>{{ row.jobName }}</div>
      </q-td>
    </template>

    <template v-slot:body-cell-jobKey="{ row }">
      <q-td class="text-center">
        <div>{{ row.jobKey }}</div>
      </q-td>
    </template>
    <template v-slot:body-cell-departmentName="{ row }">
      <q-td class="text-center">
        <div class="row">
          <p
            class="q-pa-sm"
            v-for="(item, index) in row.departments"
            :key="item.id"
          >
            {{ row.departments[index].key }}
          </p>
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
          @click.prevent="updateJob(props)"
        >
          <Tooltip :text="'Modificar'" />
        </q-btn>

        <q-btn
          class="q-ml-sm bg-blue-grey-2 text-grey-10"
          style="width: 70px; height: 16px"
          rounded
          flat
          icon="visibility"
          @click.prevent="seeJob(props.row.id)"
        >
          <Tooltip :text="'Ver'" />
        </q-btn>

        <q-btn
          class="q-ml-sm"
          :class="getDesignStatusJob(props).buttonColor"
          style="width: 70px; height: 16px"
          rounded
          flat
          color="white"
          :icon="getDesignStatusJob(props).buttonIcon"
          @click.prevent="deleteJob(props)"
        >
          <!-- TODO: No se porque este no se actualiza correctamente con el componente ToolTip -->
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
            selectedJob.active
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
          label="OK"
          v-close-popup
          :class="selectedJob.active ? 'bg-red-5' : 'bg-orange-5'"
          class="text-white"
          @click.prevent="confirmDeleteJob()"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { setSessionStorageItem } from "src/stores/sessionStorage";
import Tooltip from "src/components/Tooltip.vue";
import { useQuasar } from "quasar";
import { useJobCatalogStore } from "src/stores/jobCatalog";
import { storeToRefs } from "pinia";
import { useRouter } from "vue-router";
import { getAllJobs, updateJobState } from "src/services/jobs";
import { notifyPositive } from "src/utils/notifies";

const router = useRouter();
const useJobCatalog = useJobCatalogStore();
const { jobId, jobName, readOnly, updatingJob } = storeToRefs(useJobCatalog);

const $q = useQuasar();

const deleteDialog = ref(false);
const selectedJob = ref();
const showDeletedJobs = ref(false);
const filter = ref("");
const noDataLabel = ref("No hay puestos existentes");
const loading = ref(false);
const totalTableRows = ref([]);
const disableCheckbox = ref(false);

onMounted(() => {
  readOnly.value = false;
  showJobs();
});

const getDesignStatusJob = (props) => {
  const active = props.row.active;
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
    loading.value = true;
    disableCheckbox.value = true;
    const jobs = await getAllJobs();

    if (jobs) {
      totalTableRows.value = jobs;
      loading.value = false;
      disableCheckbox.value = false;
    }
  } catch (error) {
    loading.value = false;
    noDataLabel.value = "Error al obtener la lista de puestos";
    disableCheckbox.value = true;
  }
};

const filteredRows = computed(() => {
  return totalTableRows.value.filter((job) => {
    return showDeletedJobs.value ? job.active === 0 : job.active === 1;
  });
});

const changeJobStatus = (newJobStatus) => {
  totalTableRows.value.forEach((element) => {
    if (element.id === newJobStatus.id) {
      element.active = newJobStatus.active;
    }
  });
};

const createJob = () => {
  router.push("/home/edicion-puesto");
};

const updateJob = async (props) => {
  jobId.value = props.row.id;
  jobName.value = props.row.jobName;
  updatingJob.value = true;
  const jobData = {
    jobId: jobId.value,
    jobName: jobName.value,
    updatingJob: updatingJob.value
  }
  setSessionStorageItem("jobData", jobData);
  router.push("/home/edicion-puesto");
};

const confirmDeleteJob = async () => {
  try {
    const newJobState = {
      active: selectedJob.value.active === 1 ? 0 : 1,
      id: selectedJob.value.id,
    };

    loading.value = true;
    const job = await updateJobState(newJobState);

    if (job) {
      const message = selectedJob.value.active
        ? "El puesto se ha desactivado correctamente"
        : "El puesto se ha activado correctamente";
      $q.notify(notifyPositive(message));

      loading.value = false;
      changeJobStatus(newJobState);
    }
  } catch (error) {
    loading.value = false;
  deleteDialog.value = false;
}
};

const deleteJob = (props) => {
  selectedJob.value = props.row;
  deleteDialog.value = true;
};

const seeJob = (id) => {
  readOnly.value = true;
  jobId.value = id;

  const jobData = {
    readOnly: readOnly.value,
    jobId: jobId.value
  }
  setSessionStorageItem("jobData", jobData);
  router.push("/home/edicion-puesto");
};

const columns = [
  {
    name: "jobName",
    label: "Nombre del Puesto",
    required: true,
    align: "left",
    field: (row) => row.jobName,
    sortable: true,
  },
  {
    name: "departmentName",
    label: "Departamento",
    required: true,
    align: "center",
    field: (row) => row.departmentName,
    sortable: true,
  },
  {
    name: "jobKey",
    label: "Clave",
    required: true,
    align: "center",
    sortable: true,
    field: (row) => row.jobKey,
  },
  {
    name: "edicionPuestos",
    label: "Opciones de edición",
    required: true,
    align: "right",
    field: "edicionPuestos",
  },
];
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
