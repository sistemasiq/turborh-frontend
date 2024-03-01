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
      <q-card-actions>
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
          v-if="isAdmin"
          :val="user.role === 'i' ? 'API' : 'APL'"
          unchecked-icon="remove_circle_outline"
          checked-icon="check_circle"
          v-model="filterRadioValue"
          label="Autorizadas por este usuario"
          size="lg"
          color="teal-5"
        />
        <q-radio
          v-if="isAdmin"
          :val="user.role === 'i' ? 'APL' : 'API'"
          unchecked-icon="remove_circle_outline"
          checked-icon="check_circle"
          v-model="filterRadioValue"
          :label="
            user.role === 'i'
              ? 'Autorizadas por: Lic. Ramiro Mata'
              : 'Autorizadas por: Ing. Gerardo García'
          "
          size="lg"
          color="teal-5"
        />
        <q-radio
          v-if="isRh"
          val="AC"
          unchecked-icon="remove_circle_outline"
          checked-icon="check_circle"
          v-model="filterRadioValue"
          label="Autorizadas completamente"
          size="lg"
          color="teal-5"
        />
        <q-radio
          v-if="isRh"
          val="P"
          unchecked-icon="remove_circle_outline"
          checked-icon="check_circle"
          v-model="filterRadioValue"
          label="Publicadas"
          size="lg"
          color="teal-5"
        />
        <q-radio
          unchecked-icon="remove_circle_outline"
          checked-icon="check_circle"
          v-model="filterRadioValue"
          label="Sin autorizar"
          val="DC"
          size="lg"
          color="teal-5"
          :class="isRh ? 'q-mr-xs' : 'q-mr-lg'"
        />
        <q-radio
          v-if="isRh"
          unchecked-icon="remove_circle_outline"
          checked-icon="check_circle"
          v-model="filterRadioValue"
          label="Canceladas"
          val="C"
          size="lg"
          color="teal-5"
          class="q-mr-lg"
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
          @click.prevent="showApplicants(row)"
        >
          <q-badge v-if="row.candidatesNumber > 0" color="red" floating>{{
            row.candidatesNumber
          }}</q-badge>
        </q-btn>
      </q-td>
    </template>
    <template v-slot:body-cell-authorized="{ row }">
      <q-td>
        <div :class="getDesignStatusRequisition(row).rowLabelColor">
          {{ getDesignStatusRequisition(row).rowLabel }}
        </div>
      </q-td>
    </template>
    <template v-slot:body-cell-details="{ row }">
      <q-td>
        <q-btn
          v-if="hasPermitRequisitionAuthorization"
          class="q-ml-sm"
          :class="getDesignStatusRequisition(row).buttonColor"
          rounded
          flat
          :icon="getDesignStatusRequisition(row).buttonIcon"
          color="white"
          @click.prevent="openAuthRequisitionDialogue(row)"
          :disable="row.state === 'P' || row.state === 'C'"
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
            {{ getDesignStatusRequisition(row).tooltipText }}
          </q-tooltip>
        </q-btn>
        <q-btn
          class="q-ml-sm bg-green-5"
          rounded
          flat
          icon="publish"
          color="white"
          :style="!isRh || row.state !== 'AC' ? 'visibility:hidden' : ''"
          @click.prevent="openPublishRequisitionDialogue(row)"
        >
          <Tooltip :text="statePublishButtonTooltip[row.state]" />
        </q-btn>
        <q-btn
          class="q-ml-sm bg-grey-4"
          rounded
          flat
          color="black"
          icon="edit"
          @click.prevent="
            showDetails(row.numRequisition, row.staffName, row.jobId, true)
          "
          :style="canEditRequisition(row) ? '' : 'visibility:hidden'"
        >
          <Tooltip v-if="row.state !== 'C'" :text="'Editar requisición'" />
        </q-btn>
        <q-btn
          class="q-ml-sm bg-grey-4"
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
          @click.prevent="createReport(row.numRequisition, addSignsToReport(row))"
          unelevated
          rounded
          class="text-capitalize bg-grey-4"
          icon="picture_as_pdf"
        >
          <Tooltip :text="'Generar reporte en PDF'" />
        </q-btn>
        <q-btn
          class="q-ml-sm"
          rounded
          flat
          icon="delete"
          color="white"
          @click.prevent="openCancelRequisitionDialogue(row)"
          :style="row.state === 'C' || row.state === 'PC' || !isRh ? 'visibility:hidden' : ''"
          :class="row.state === 'C' ? 'bg-grey' : 'bg-red-5'"
        >
          <Tooltip :text="'Cancelar requisición'" />
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
          :label="
            getDesignStatusRequisition(selectedRequisition).dialogueButtonText
          "
          :class="getDesignStatusRequisition(selectedRequisition).buttonColor"
          v-close-popup
          class="text-white bg-red"
          @click.prevent="updateRequisitionAuthorization(selectedRequisition)"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
  <q-dialog v-model="showPublishRequisitionDialogue" persistent>
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
          label="OK"
          :class="getDesignStatusRequisition(selectedRequisition).buttonColor"
          v-close-popup
          class="text-white bg-red"
          @click.prevent="updateRequisitionStateTo(selectedRequisition, 'P')"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
  <q-dialog v-model="showCancelRequisitionDialogue" persistent>
    <q-card rounded style="border-radius: 30px">
      <q-card-section class="row items-center">
        <span class="q-ml-sm text-h6 text-weight-regular">
          ¿Quieres cancelar esta requisición?
        </span>
      </q-card-section>

      <q-card-actions align="center">
        <q-btn flat label="Cancelar" color="primary" v-close-popup />
        <q-btn
          rounded
          flat
          label="OK"
          v-close-popup
          class="text-white bg-red-5"
          @click.prevent="disableRequisition(selectedRequisition)"
          :disable="isFetchingCandidates"
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
import { useLocalStorageStore } from "src/stores/localStorage";
import { sendCanceledRequisitionEmail } from "src/services/mail";
import { sendCanceledRequisitionMessage } from "src/services/whatsApp";
import Tooltip from "src/components/Tooltip.vue";
import { createRequisitionReport } from "src/services/report";
import { getCandidatesByRequisitionId, disableAllCandidatesFromRequisition } from "src/services/candidates";

import {
  getAllRequisitions,
  getRequisitionByNum,
  getRequisitionsByPersonalId,
  updateRequisitionStateByAdmin,
  updateRequisitionState,
  cancelRequisition,
} from "src/services/requisition";

const useLocalStorage = useLocalStorageStore();
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
const showPublishRequisitionDialogue = ref(false);
const showCancelRequisitionDialogue = ref(false);
const selectedRequisition = ref();
const selectedRequisitionCandidates = ref([]);
const isFetchingCandidates = ref(false);

const {
  isAdmin,
  isRh,
  user,
  hasPermitRequisitionAuthorization,
  isIng,
  isLic
} = storeToRefs(useAuth);

const {
  requisitionData,
  showingDetails,
  numRequisitionDetails,
  idRequisitionDetails,
  applicantDetails,
  jobDetails,
  updatingRequisition,
} = storeToRefs(useRequisitionDetails);

const filterRadioValue = ref("all");

const stateRowLabels = {
  DC: "Sin autorizar",
  C: "CANCELADA",
  API: "Autorizada por: Ing. Gerardo García",
  APL: "Autorizada por: Lic. Ramiro Mata",
  AC: "Autorizada completamente",
  P: "Publicada",
  PC: "COMPLETADA",
};

const stateRowLabelsColors = {
  DC: "text-red-5",
  C: "text-red-10",
  API: "text-green-10",
  APL: "text-green-10",
  AC: "text-green-5",
  P: "text-cyan-5",
  PC: "text-green"
};

const stateButtonColors = {
  DC: "bg-green",
  C: "bg-grey-5",
  API: isIng.value ? "bg-red-5" : "bg-green-10",
  APL: isLic.value ? "bg-red-5" : "bg-green-10",
  AC: isRh.value ? "bg-green-5" : "bg-red-5",
  P: "bg-grey-5",
};

const stateButtonIcons = {
  DC: "done",
  C: "delete",
  API: isIng.value ? "remove" : "done",
  APL: isLic.value ? "remove" : "done",
  AC: "remove",
  P: "verified",
};

const stateButtonTooltipText = {
  DC: "Autorizar requisición",
  C: "Requisición cancelada",
  API: isIng.value ? "Desautorizar requisición" : "Autorizar requisición",
  APL: isLic.value ? "Desautorizar requisición" : "Autorizar requisición",
  AC: "Desautorizar requisición",
  P: "Esta requisición ya ha sido publicada",
};

const stateDialogText = {
  DC: "¿Quieres autorizar esta requisición?",
  C: "Requisición cancelada",
  API: isIng.value
    ? "¿Quieres desautorizar esta requisición?"
    : "¿Quieres autorizar esta requisición?",
  APL: isLic.value
    ? "¿Quieres desautorizar esta requisición?"
    : "¿Quieres autorizar esta requisición?",
  AC: isRh.value
    ? "¿Quieres publicar esta requisición?"
    : "¿Quieres desautorizar esta requisición?",
  P: "¿Quieres cancelar esta requisición?",
};

const statePublishButtonTooltip = {
  DC: "No es posible publicar esta requisición",
  API: "No es posible publicar esta requisición",
  APL: "No es posible publicar esta requisición",
  AC: "Publicar requisición",
  P: "Esta requisición ya ha sido publicada",
};

const stateChangeNotifyText = {
  DC: "Requisición desautorizada correctamente",
  API: "Requisición autorizada correctamente",
  APL: "Requisición autorizada correctamente",
  AC: "Requisición autorizada correctamente",
  P: "Requisición publicada correctamente",
};

const addSignsToReport = (row) => {
  return row.state === 'AC' || row.state === 'P' || row.state === 'PC'
}

const canEditRequisition = (row) => {
  if (row.state !== "DC") return false;

  if (isAdmin.value) {
    return user.value.personalId === row.personalId ? true : false;
  }

  return true;
};

const openAuthRequisitionDialogue = (row) => {
  showAuthRequisitionDialogue.value = true;
  selectedRequisition.value = row;
};

const openPublishRequisitionDialogue = (row) => {
  showPublishRequisitionDialogue.value = true;
  selectedRequisition.value = row;
};

const openCancelRequisitionDialogue = (row) => {
  showCancelRequisitionDialogue.value = true;
  selectedRequisition.value = row;
  console.log(selectedRequisition.value);

  if (selectedRequisition.value.candidatesNumber > 0) {
    onCancelFetchApplicants();
  }
};

const onCancelSendEmailToCandidates = async () => {
  const promises = selectedRequisitionCandidates.value.map((candidate) => {
    return sendCanceledRequisitionEmail(candidate.email, candidate.name, candidate.jobName);
  });

  try {
    const results = await Promise.all(promises);

    const successCount = results.filter((result) => result).length;
    const failureCount = results.length - successCount;
    if(failureCount === 0){
      return true;
    }else{
      return false
    }
  } catch (error) {
    console.error("Error al mandar los emails:", error);
    $q.notify(notifyNegative("Error al notificar a los candidatos"));
    return false;
  }
};

const onCancelSendMessageToCandidates = async () => {
  const promises = selectedRequisitionCandidates.value.map((candidate) => {
    return sendCanceledRequisitionMessage(candidate.phoneNumber, candidate.name, candidate.jobName);
  });

  try {
    const results = await Promise.all(promises);

    const successCount = results.filter((result) => result).length;
    const failureCount = results.length - successCount;
    if(failureCount === 0){
      return true;
    }else{
      return false
    }

  } catch (error) {
    console.error("Error al mandar los mensaje:", error);
    $q.notify(notifyNegative("Error al notificar a los candidatos"));
    return false;
  }
};

const filteredRequisitions = computed(() => {
  return totalRequisitions.value.filter((item) => {
    return filterItem(item);
  });
});

const filterItem = (item) => {
  if (filterRadioValue.value === "all") {
    return item;
  }
  return item.state == filterRadioValue.value;
};

const updateRequisitionAuthorization = async (requisition) => {
  const isIngUpdating = isIng.value ? true : false;

  try {
    $q.loading.show();
    const newState = await updateRequisitionStateByAdmin(
      requisition.numRequisition,
      isIngUpdating
    );

    if (newState) {
      requisition.state = newState;
      updateSelectedRequisition(requisition);
      $q.notify(notifyPositive("Cambio de estado correctamente"));
    }
  } catch (error) {
  } finally {
    $q.loading.hide();
  }
};

const updateRequisitionStateTo = async (requisition, newState) => {
  try {
    $q.loading.show();
    const updatedStateCorrectly = await updateRequisitionState(
      newState,
      requisition.numRequisition
    );

    if (updatedStateCorrectly) {
      requisition.state = newState;
      updateSelectedRequisition(requisition);
      $q.notify(notifyPositive(stateChangeNotifyText[newState]));
    }
  } catch (error) {
  } finally {
    $q.loading.hide();
  }
};

const disableRequisition = async (requisition) => {
  try {
    $q.loading.show();

    const requisitionCanceled = await cancelRequisition(
      requisition.numRequisition
    );

    if (requisitionCanceled) {
      requisition.state = "C";

      if (selectedRequisitionCandidates.value.length > 0) {
        const sendedEmails = await onCancelSendEmailToCandidates();
        const sendedMessages = await onCancelSendMessageToCandidates();
        const disableCandidates = await disableAllCandidatesFromRequisition(selectedRequisitionCandidates.value[0].requisitionId);

        if(sendedEmails && sendedMessages && disableCandidates){
          requisition.candidatesNumber = 0;
          $q.notify(notifyPositive("Los candidatos han sido notificados de la cancelación."));
        }

      }
      updateSelectedRequisition(requisition);

      $q.notify(
        notifyPositive("La requisición ha sido cancelada correctamente")
      );
    }
  } catch (error) {
    console.log(error);
    $q.notify(notifyNegative("Hubo un error al cancelar la requisición"));
  } finally {
    $q.loading.hide();
  }
};

onMounted(() => {
  fetchRequisitions();
});

const getDesignStatusRequisition = (item) => {
  return {
    tooltipText: stateButtonTooltipText[item.state],
    buttonColor: stateButtonColors[item.state],
    buttonIcon: stateButtonIcons[item.state],
    dialogueText: stateDialogText[item.state],
    dialogueButtonText: "OK",
    rowLabel: stateRowLabels[item.state] || "Estado desconocido",
    rowLabelColor: stateRowLabelsColors[item.state] || "bg-grey",
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
    label: "Folio",
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
    name: "vacancyNumber",
    label: "Vacantes",
    required: true,
    align: "center",
    field: (row) => row.vacancyNumber,
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

const onCancelFetchApplicants = async () => {
  try {
    isFetchingCandidates.value = true;
    const candidates = await getCandidatesByRequisitionId(selectedRequisition.value.id);

    if (candidates) {
      selectedRequisitionCandidates.value = candidates;
    }
  } catch (error) {
    console.log(`Error fetching applicants ${error}`);
  } finally {
    isFetchingCandidates.value = false;
  }
};

const showApplicants = (row) => {
  numRequisitionDetails.value = row.numRequisition;
  idRequisitionDetails.value = row.id;
  if (!numRequisitionDetails.value || !idRequisitionDetails.value) {
    return;
  }

  useLocalStorage.save("idRequisitionDetails", idRequisitionDetails.value);
  useLocalStorage.save("numRequisitionDetails", numRequisitionDetails.value);
  router.push("historial-requisiciones-solicitudes");
};

const showDetails = async (
  numRequisition,
  applicantName,
  jobId,
  isUpdating = false
) => {
  numRequisitionDetails.value = numRequisition;
  applicantDetails.value = applicantName;
  jobDetails.value = jobId;

  showingDetails.value = isUpdating ? false : true;
  updatingRequisition.value = isUpdating;

  try {
    const requisitionSearched = await getRequisitionByNum(
      numRequisitionDetails.value
    );

    if (requisitionSearched) {
      requisitionData.value = requisitionSearched;
    }
  } catch (error) {
    console.log("Error fetching requisition details " + error);
  }

  router.push("nueva-requisicion-1");
};

const fetchRequisitions = async () => {
  const userStored = useLocalStorage.load("user");

  if (userStored) {
    user.value = userStored;
  }

  try {
    loading.value = true;

    const requisitionsFetched =
      isAdmin.value || isRh.value
        ? await getAllRequisitions()
        : await getRequisitionsByPersonalId(user.value.personalId);

    if (requisitionsFetched) {
      totalRequisitions.value = requisitionsFetched;
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

const createReport = async (numRequisition, authorized) => {
  try {
    $q.loading.show({ message: "Generando reporte..." });

    const report = await createRequisitionReport(numRequisition, authorized);
    if (report) {
      reportSrc.value = report;
      showReport.value = true;
    }
  } catch (error) {
    console.log(error);
  } finally {
    $q.loading.hide();
  }
};
</script>
