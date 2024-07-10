<template>
    <q-table
      flat
      bordered
      style="background: rgb(247, 248, 255)"
      title="Listado de pruebas psicométricas"
      v-bind:rows="filteredRows"
      separator="horizontal"
      @request="getPsychPlatformsData"
      :columns="columns"
      row-key="name"
      :loading="loading"
      :filter="filter"
      loading-label="Cargando pruebas psicométricas..."
      rows-per-page-label="Pruebas por página"
      :table-header-class="{ 'table-header-style': [true] }"
      :table-class="{ 'table-body-style': [true] }"
      class="my-sticky-header-table q-pa-md"
      v-bind:no-data-label="noDataLabel"
      no-results-label="No hay coincidencias con la busqueda"
      :rows-per-page-options="[5, 10, 15]"
    >
      <template v-slot:top-right>
        <q-card-actions horizontal align="center">
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
  
      <template v-slot:body-cell-psychPlatformName="{ row }">
        <q-td>
          <div>{{ row.psychPlatformName }}</div>
        </q-td>
      </template>
  
      <template v-slot:body-cell-link="{ row }">
        <q-td class="text-center">
          <div>
            {{
              row.link
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
            @click.prevent="editionDialog(props.row)"
          >
            <Tooltip :text="'Modificar'" />
          </q-btn>
        </q-td>
      </template>
    </q-table>
  
    <q-dialog v-model="operationsDialog">
      <q-card>
        <q-card-section>
          <div class="text-h6">Edición de Pruebas Psicométricas</div>
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
            v-model="psychPlatformName"
            label="Título"
            label-color="black"
            lazy-rules
            :rules="[(value) => !!value || 'Este campo no puede estar vacío.']"
            style="width: 40%"
          />
  
          <q-input
            light
            outlined
            color="black"
            v-model="link"
            label="Link"
            label-color="black"
            lazy-rules
            :rules="[(value) => !!value || 'Este campo no puede estar vacío.']"
            style="width: 40%"
          />
        </q-card-section>
  
        <q-separator />
  
        <q-card-actions align="right">
          <q-btn flat label="Cancelar" color="red" v-close-popup />
          <q-btn
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
  
  <script setup>
  import { ref, computed, onMounted } from "vue";
  import Tooltip from "src/components/Tooltip.vue";
  import { useQuasar } from "quasar";
  import { notifyNegative, notifyPositive } from "src/utils/notifies";
  import { useAuthStore } from "src/stores/auth";
  import {
  getPsychometricPlatforms
} from "src/services/user";
 import { putUserPsychTestData } from "/src/services/psychPlatforms.js";
  import { storeToRefs } from "pinia";
  
  const $q = useQuasar();
  const useAuth = useAuthStore();
  
  const operationsDialog = ref(false); //Opens the operations dialog 
  const id = ref(""); //Stores the id of the psych platform
  const psychPlatformName = ref("");//Stores the name of the psych platform
  const link = ref(""); //stores the link of the psych platform
  const filter = ref(""); //stores the string that is filtered 
  const noDataLabel = ref("No hay herramiemtas existentes"); 
  const loading = ref(false);
  const totalTableRows = ref([]); //stores the hole list of psych platforms, is the v-model of the table
  
  const { user } = storeToRefs(useAuth);

  onMounted(() => {
    getPsychPlatformsData();
  });
  
  const columns = [
    {
      name: "psychPlatformName",
      label: "Título de la prueba",
      required: true,
      align: "left",
      field: (row) => row.psychPlatformName,
      sortable: true,
    },
    {
      name: "link",
      label: "Link",
      required: true,
      align: "center",
      field: (row) => row.link,
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
  
  //Retrieves the list of psych Platforms and its data
  const getPsychPlatformsData = async () => {
    try {
      loading.value = true;
      const catalog = await getPsychometricPlatforms();
  
      if (catalog) {
        totalTableRows.value = catalog;
      }
    } catch (error) {
      console.log("Something went wrong while getting the psych platforms data: " + error);
    } finally{
      loading.value = false;
    }
  };

  //Updates the psych platform data of the selected platform in the database
  const updateTool = async () => {
    if (link.value != "" && psychPlatformName.value != "") {
      try {
        $q.loading.show("Cargando...");
        const updatedPsychPlatformStatus = await putUserPsychTestData(user.value.id, psychPlatformName.value, link.value, id.value);
        if (updatedPsychPlatformStatus) {
          updatePsychPlatformData(user.value.id, psychPlatformName.value, link.value, id.value);
  
          $q.notify(notifyPositive("El elemento se ha actualizado correctamente"));
        }
      } catch (error) {
        $q.notify(notifyNegative("Hubo un error al actualizar el elemento"));
        console.log(error);
      } finally {
        link.value = "";
        psychPlatformName.value = "";
        id.value = "";
        $q.loading.hide();
      }
    } else {
      $q.notify(notifyNegative("Ambos campos deben ser llenados"));
    }
  };

    //Updates the psych platform data of the selected platform locally
  const updatePsychPlatformData = (userId, psychPlatformName, link, id) => {
    totalTableRows.value.forEach((element) => {
      if (element.id === id) {
        element.modifiedBy = userId;
        element.psychPlatformName = psychPlatformName;
        element.link = link;
      }
    });
  };
  
  //Opens the dialog for editing the selected psych platform data
  const editionDialog = (props) => {
      id.value = props.id;
      link.value = props.link;
      psychPlatformName.value = props.psychPlatformName;

      operationsDialog.value = !operationsDialog.value; 
  };
  
  //The function to filter the totalTableRows which is the array of the table
  const filteredRows = computed(() => {
    return totalTableRows.value.filter((psychPlatformData) => {
      return psychPlatformData;
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
  