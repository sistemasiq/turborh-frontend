<template>
  <q-table
    class="q-pa-md"
    flat
    bordered
    style="background: rgb(234, 237, 249)"
    title="Historial de requisiciones"
    :columns="columns"
    :rows="filteredRequisitions"
    :loading="loading"
    :filter="filter"
    row-key="name"
    separator="horizontal"
    rows-per-page-label="Puestos por página"
    loading-label="Cargando historial de requisiciones..."
    no-results-label="No hay coincidencias con la busqueda..."
    :no-data-label="noDataLabel"
    :rows-per-page-options="[10, 20, 30]"
  >
    <template v-slot:top-right>
      <q-card-actions horizontal align="center">
        <q-radio
        val="all"
          unchecked-icon="remove_circle_outline"
          checked-icon="check_circle"
          v-model="filterRadioValue"
          label="Todas"
          size="lg"
          color="teal-5"
        />
        <q-radio
        val="authorized"
          unchecked-icon="remove_circle_outline"
          checked-icon="check_circle"
          v-model="filterRadioValue"
          label="Autorizadas"
          size="lg"
          color="teal-5"
        />
        <q-radio
          unchecked-icon="remove_circle_outline"
          checked-icon="check_circle"
          v-model="filterRadioValue"
          label="Sin autorizar"
          val="unauthorized"
          size="lg"
          color="teal-5"
          class="q-mr-xl"
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
        <!-- TODO: Evaluar si es totalmente necesario este boton -->
        <!-- <q-btn
          unelevated
          class="q-ml-md"
          style="background-color: #38638a"
          rounded
          color="white"
          flat
          icon="print"
          label="Imprimir busqueda"
        /> -->
      </q-card-actions>
    </template>

    <template v-if="isRh" v-slot:body-cell-applicants="{ row }">
      <q-td :style="{ color: row.authorized ? 'green' : 'red' }">
        <q-btn
          label="Solicitudes"
          :text-color="row.candidatesNumber > 0 ? 'primary' : 'grey'"
          :disable="row.candidatesNumber === 0"
          color="white"
          rounded
          @click.prevent="showApplicants(row.id)"
        >
          <q-badge v-if="row.candidatesNumber > 0" color="red" floating>{{
            row.candidatesNumber
          }}</q-badge>
        </q-btn>
      </q-td>
    </template>
    <template v-if="!isAdmin" v-slot:body-cell-authorized="{ row }">
      <q-td :style="{ color: row.authorized ? 'green' : 'red' }">
        <div>{{ row.authorized ? "Autorizada" : "Sin autorizar" }}</div>
      </q-td>
    </template>
    <template v-slot:body-cell-authorized="{ row }">
      <q-td>
        <div :class="getDesignAuthorizedLabel(row).textColor">
          {{ getDesignAuthorizedLabel(row).text }}
        </div>
      </q-td>
    </template>
    <template v-slot:body-cell-details="{ row }">
      <q-td style="position: absolute; right: 2%; height: 48px">
        <q-btn
          v-if="isAdmin"
          class="q-ml-sm"
          style="width: 70px; height: 16px"
          :class="
            disableAuthRequisitionButton(row)
              ? 'bg-grey'
              : getDesignStatusRequisition(row).buttonColor
          "
          rounded
          flat
          :icon="getDesignStatusRequisition(row).buttonIcon"
          color="white"
          @click.prevent="openAuthRequisitionDialogue(row)"
          :disable="disableAuthRequisitionButton(row)"
        >
          <q-tooltip
            class="bg-grey text-white text-body2"
            anchor="top middle"
            self="center middle"
            transition-show="slide-up"
            transition-hide="fade"
            :delay="300"
            transition-duration="300"
            :offset="[10, 25]"
          >
            {{
              disableAuthRequisitionButton(row)
                ? "No es posible deautorizar esta requisición"
                : getDesignStatusRequisition(row).tooltipText
            }}
          </q-tooltip>
        </q-btn>
        <q-btn
          class="q-ml-sm"
          style="
            background: rgba(139, 139, 139, 15%);
            width: 70px;
            height: 16px;
          "
          rounded
          flat
          color="black"
          icon="visibility"
          @click.prevent="
            showDetails(row.numRequisition, row.staffName, row.jobId)
          "
        >
        <Tooltip :text="'Ver detalles'" />
        </q-btn>
        <q-btn
          @click.prevent="createReport(row.numRequisition)"
          unelevated
          rounded
          class="text-capitalize"
          icon="picture_as_pdf"
        >
          <Tooltip :text="'Generar reporte en PDF'" />
        </q-btn>
      </q-td>
    </template>
  </q-table>
  <q-dialog v-model="showAuthRequisitionDialogue" persistent>
    <q-card rounded style="border-radius: 30px">
      <q-card-section class="row items-center">
        <span class="q-ml-sm text-h6 text-weight-regular">
          {{ getDesignStatusRequisition(selectedRequisition).dialogueText }}
        </span>
      </q-card-section>

      <q-card-actions align="center">
        <q-btn flat label="Cancelar" color="primary" v-close-popup />
        <q-btn
          rounded
          flat
          :label="getDesignStatusRequisition(selectedRequisition).buttonText"
          :class="getDesignStatusRequisition(selectedRequisition).buttonColor"
          v-close-popup
          class="text-white bg-red"
          @click.prevent="updateRequisitionAuthorization(selectedRequisition)"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
  <q-dialog maximized v-model="showReport">
    <q-card class="no-scroll">
      <q-card-actions align="right">
        <q-btn flat label="Cerrar" color="red" v-close-popup />
      </q-card-actions>
      <object
        height="100%"
        width="100%"
        v-if="reportSrc.length > 0"
        :data="reportSrc"
        type="application/pdf"
      >
        <iframe :src="reportViewLink"></iframe>
      </object>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import { useRouter } from "vue-router";
import { storeToRefs } from "pinia";
import { useRequisitionDetailsStore } from "src/stores/requisitionDetails";
import { useAuthStore } from "src/stores/auth";
import { notifyPositive } from "src/utils/notifies";
import { useQuasar } from "quasar";
import { getAxiosBaseUrl } from "src/services/profiles";
import Tooltip from "src/components/Tooltip.vue";

import axios from "axios";

const useRequisitionDetails = useRequisitionDetailsStore();
const router = useRouter();
const useAuth = useAuthStore();
const $q = useQuasar();

const totalRequisitions = ref([]);

const loading = ref(false);
const filter = ref("");
const noDataLabel = ref("No hay historial de requisiciones");

const reportSrc = ref("");
const reportViewLink = ref(reportSrc.value);
const showReport = ref(false);

const showAuthRequisitionDialogue = ref(false);
const selectedRequisition = ref();

const { numRequisitionDetails } = storeToRefs(useRequisitionDetails);
const { isAdmin, isRh, user } = storeToRefs(useAuth);

const filterRadioValue = ref("all");

const openAuthRequisitionDialogue = (row) => {
  showAuthRequisitionDialogue.value = true;
  selectedRequisition.value = row;
};

const filteredRequisitions = computed(() => {
  return totalRequisitions.value.filter((item) => {
    return isAdmin.value ? filterItemAdmin(item) : filterItem(item);
  });
});

const filterItem = (item) => {
  if (filterRadioValue.value === "authorized") {
    return item.authorized === 1;
  } else if (filterRadioValue.value === "unauthorized") {
    return item.authorized === 0;
  } else if (filterRadioValue.value === "all") {
    return item;
  }
};

const filterItemAdmin = (item) => {
  if (filterRadioValue.value === "authorized") {
    return user.value.role === "i"
      ? item.authorizedIng === 1
      : item.authorizedLic === 1;
  } else if (filterRadioValue.value === "unauthorized") {
    return user.value.role === "i"
      ? item.authorizedIng === 0
      : item.authorizedLic === 0;
  } else if (filterRadioValue.value === "all") {
    return item;
  }
};

const updateRequisitionAuthorization = async (requisition) => {
  const adminUser = user.value.role === "i" ? "ing" : "lic";
  const currentAuthState =
    user.value.role === "i"
      ? requisition.authorizedIng
      : requisition.authorizedLic;
  const newAuthState = currentAuthState === 1 ? 0 : 1;

  try {
    $q.loading.show();
    const request = await axios.put(
      `/requisicion/autorizar/${adminUser}/${newAuthState}/num/${requisition.numRequisition}`
    );

    if (request.status === 201) {
      requisition.authorizedIng =
        user.value.role === "i" ? newAuthState : currentAuthState;
      requisition.authorizedLic =
        user.value.role === "l" ? newAuthState : currentAuthState;
      requisition.authorized =
        requisition.authorizedIng === 1 && requisition.authorizedLic === 1
          ? 1
          : 0;
      updateSelectedRequisition(requisition);
      const message =
        newAuthState === 1
          ? `La requisicion ${requisition.numRequisition} ha sido autorizada.`
          : `La requisicion ${requisition.numRequisition} ha sido desautorizada.`;
      $q.notify(notifyPositive(message));
    }
  } catch (error) {
  } finally {
    $q.loading.hide();
  }
};

onMounted(() => {
  fetchRequisitions();
});

const getDesignStatusRequisition = (row) => {
  const active =
    user.value.role === "i" ? row.authorizedIng : row.authorizedLic;

  return {
    tooltipText:
      active === 1 ? "Desautorizar requisición" : "Autorizar requisición",
    buttonColor: active === 1 ? "bg-red-5" : "bg-green-5",
    buttonIcon: active === 1 ? "remove" : "done",
    dialogueText:
      active === 1
        ? "¿Quieres desautorizar esta requisición?"
        : "¿Quieres autorizar esta requisición?",
    buttonText: active === 1 ? "Remover" : "Autorizar",
  };
};

const columns = [
  {
    name: "applicants",
    label: "Solicitudes",
    required: true,
    align: "left",
  },
  {
    name: "numRequisition",
    label: "No. Requisicion",
    required: true,
    align: "left",
    field: (row) => row.numRequisition,
    sortable: true,
  },
  {
    name: "staffName",
    label: "Jefe",
    required: true,
    align: "left",
    field: (row) => row.staffName,
  },
  {
    name: "departmentKey",
    label: "Departamento",
    required: true,
    align: "left",
    field: (row) => row.departmentKey,
  },
  {
    name: "jobName",
    label: "Puesto solicitado",
    required: true,
    align: "left",
    field: (row) => row.jobName,
  },
  {
    name: "authorized",
    label: "Estado",
    required: true,
    align: "left",
    field: (row) => row.authorized,
  },
  {
    name: "dateCreated",
    label: "Fecha de creación",
    required: true,
    align: "left",
    field: (row) => row.dateCreated,
    sortable: true,
  },
  {
    name: "details",
    label: "Opciones de requisicion",
    required: true,
    align: "center",
    field: "details",
  },
];

const getDesignAuthorizedLabel = (row) => {
  const active =
    user.value.role === "i" ? row.authorizedIng : row.authorizedLic;

  return {
    textColor: active === 1 ? "text-green" : "text-red",
    text: active === 1 ? "Autorizada" : "Sin autorizar",
  };
};

const showApplicants = (requisitionId) => {
  numRequisitionDetails.value = requisitionId;
  if (!numRequisitionDetails.value) {
    return;
  }
  router.push("historial-requisiciones-solicitudes");
};

const showDetails = async (numRequisition, applicantName, jobId) => {
  const {
    requisitionData,
    showingDetails,
    numRequisitionDetails,
    applicantDetails,
    jobDetails,
  } = storeToRefs(useRequisitionDetails);
  numRequisitionDetails.value = numRequisition;
  applicantDetails.value = applicantName;
  jobDetails.value = jobId;
  showingDetails.value = true;

  try {
    const request = await axios.get(
      `/requisicion/buscar/${numRequisitionDetails.value}`
    );

    if (request.status === 200) {
      requisitionData.value = request.data;
    }
  } catch (error) {
    console.log("Error fetching requisition details " + error);
  }

  router.push("nueva-requisicion-1");
};

const fetchRequisitions = async () => {
  try {
    loading.value = true;

    const request = await axios.get(`/requisicion/todo`);

    if (request.status === 200) {
      totalRequisitions.value = request.data;
    } else {
      console.log("Error on fetch requisitions with status " + request.status);
    }
  } catch (error) {
    console.log(error);
  } finally {
    loading.value = false;
  }
};

const updateSelectedRequisition = (updatedRequisition) => {
  totalRequisitions.value.forEach((element) => {
    if (element.id === updatedRequisition.id) {
      element = updatedRequisition;
    }
  });
};

const createReport = async (numRequisition) => {
  try {
    $q.loading.show({message: "Generando reporte..."});
    const endpoint = `requisicion/reporte?numRequisition=${numRequisition}&endpointURL=${getAxiosBaseUrl()}`
    console.log("endpoint "+endpoint)
    const request = await axios.get(endpoint, {
      responseType: "arraybuffer",
    });

    if (request.status === 200) {
      const blob = new Blob([request.data], { type: "application/pdf" });
      reportSrc.value = URL.createObjectURL(blob);
      showReport.value = true;
    }
  } catch (error) {
    console.log(error);
  } finally {
    $q.loading.hide();
  }
};

const disableAuthRequisitionButton = (row) => {
  return row.authorized === 1 && row.candidatesNumber > 0 ? true : false;
};
</script>

<style scoped>
.rounded-borders {
  border-radius: 15px;
  background-color: #ffffff;
}

.button.details {
  background-color: #38638a;
  color: #ffffff;
}

.button.print {
  background-color: #7ee7e7;
  color: #38638a;
  width: 200px;
  left: 85%;
  position: absolute;
}

.filter {
  height: 100%;
  margin-left: 18%;
  margin-top: 2%;
  width: 95%;
  padding-left: 10%;
  color: #ffffff;
}

.text-requests {
  font-size: 24px;
  background-color: #f1f6fc;
  border-radius: 100px;
  color: #fd999a;
  width: 50px;
  margin-left: 20%;
}

.history-item {
  margin: 1%;
  flex: 1;
}

.history-item p {
  font-size: 20px;
}

.filter-icon {
  margin-left: 0.5%;
  margin-bottom: 0.1%;
}
</style>
