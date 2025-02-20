<template>
  <q-layout

    style="background-color: rgb(30, 61, 88);"
    v-on:vnode-unmounted="saveLocalStore()"
  >
    <q-card flat bordered class="rounded-borders">
      <q-card-section class="title"> Documentos </q-card-section>

      <q-card-section class="content">
        <pagination-application
          :page="4"
          :required-fields="
            updatingApplication
              ? requiredFieldsOnThisPageUpdating
              : requiredFieldsOnThisPage
          "
          @on-field-validation="validateRequiredFields"
        />
        <div style="margin-top: 6%">
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
                Es obligatorio adjuntar su curriculum, así como llenar los
                campos del RFC y NSS
              </p>
            </q-card-section>
          </q-card>
          <q-form class="q-gutter-md">
            <q-input
              ref="rfcRef"
              hint="Ejemplo del formato del RFC: ABCE123456789"
              hide-hint
              dark
              outlined
              color="cyan-1"
              v-model="rfc"
              type="text"
              label="RFC *"
              mask="XXXXXXXXXXXXX"
              label-color="white"
              :rules="[ruleFieldRequired]"
              :readonly="viewingApplication"
              class="input-brand"
              @update:model-value="updateStore()"
            >
            </q-input>

            <q-input
              ref="imssRef"
              dark
              outlined
              color="cyan-1"
              v-model="imss"
              type="text"
              label="Número de IMSS/ISSSTE *"
              label-color="white"
              mask="###########"
              :readonly="viewingApplication"
              :rules="[ruleFieldRequired]"
              class="input-brand"
              @update:model-value="updateStore()"
            >
            </q-input>

            <q-input
              dark
              outlined
              color="cyan-1"
              v-model="afore"
              type="text"
              label="AFORE"
              label-color="white"
              mask="###########"
              lazy-rules
              :rules="[
                (value) =>
                  /^[0-9]{11}$/.test(value) || 'La clave AFORE debe ser válida',
              ]"
              :readonly="viewingApplication"
              class="input-brand"
              @update:model-value="updateStore()"
            >
            <BadgeOptional class="self-center"/>
            </q-input>

            <q-input
              dark
              outlined
              color="cyan-1"
              v-model="fm2"
              type="text"
              label="Si es extranjero ingrese su número FM2"
              label-color="white"
              class="input-brand"
              :readonly="viewingApplication"
              @update:model-value="updateStore()"
            >
            <BadgeOptional class="self-center"/>
            </q-input>

            <div class="q-my-lg">
              <q-file
                v-if="!isRh"
                style="width: 22%"
                :disable="viewingApplication"
                v-model="curriculumStored"
                max-files="1"
                max-file-size="5242880"
                accept=".pdf"
                filled
                bg-color="teal-14"
                label-color="white"
                use-chips
                @rejected="onRejectedFile"
                :label="checkForCurriculum"
                class="q-mb-md"
              >
                <template v-slot:prepend>
                  <q-icon name="upload" color="white" />
                </template>

                <Tooltip text="Adjunta tu curriculum en PDF"/>
              </q-file>
            </div>
          </q-form>
          <TableDriverLicenses />
        </div>
      </q-card-section>
    </q-card>
    <ButtonApplicationStatus
      v-if="updatingApplication"
      :required-fields="requiredFieldsOnThisPageUpdating"
    />
    <q-dialog maximized v-model="showResume">
    <q-card class="no-scroll">
      <q-card-actions class="bg-white"  align="right">
        <q-btn flat label="Cerrar" color="red" v-close-popup />
      </q-card-actions>
      <object
        height="100%"
        width="100%"
        v-if="resumeSrc.length > 0"
        :data="resumeSrc"
        type="application/pdf"
      >
        <iframe :src="resumeViewLink"></iframe>
      </object>
    </q-card>
  </q-dialog>

  </q-layout>

</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import { useQuasar } from "quasar";
import { useRequestUser } from "src/stores/requestUser";
import { useLocalStorageStore } from "src/stores/localStorage";
import { storeToRefs } from "pinia";
import PaginationApplication from "src/components/PaginationApplication.vue";
import ButtonApplicationStatus from "src/components/ButtonApplicationStatus.vue";
import TableDriverLicenses from "src/components/TableDriverLicenses.vue";
import { notifyNegative, notifyNegativeField, notifyPositive } from "src/utils/notifies";
import BadgeOptional from "src/components/BadgeOptional.vue";
import Tooltip from "src/components/Tooltip.vue";
import { useAuthStore } from "src/stores/auth";
import { downloadFile } from "src/services/files";
import { getUserDocumentsPath } from "src/utils/folderPaths";
import { ruleFieldRequired } from "src/utils/fieldRules";

const useAuth = useAuthStore();
const useRequest = useRequestUser();
const useLocalStorage = useLocalStorageStore();

const $q = useQuasar();
const rfc = ref("");
const imss = ref("");
const afore = ref("");
const fm2 = ref("");
const resumeSrc = ref("");

const rfcRef = ref(null);
const imssRef = ref(null);

const validateRequiredFields = () => {
  if(viewingApplication.value)
  return;

  rfcRef.value.validate();
  imssRef.value.validate();

  if(!curriculumStored.value && !updatingApplication.value){
    $q.notify(notifyNegativeField("Sube tu curriculum por favor"))
  }
};


const resumeViewLink = ref(resumeSrc.value);
const showResume = ref(false);

const requiredFieldsOnThisPage = computed(() => [
  rfc.value,
  imss.value,
  curriculumStored.value,
]);
const requiredFieldsOnThisPageUpdating = computed(() => [
  rfc.value,
  imss.value,
]);

const { isRh, isBoss, isAdmin } = storeToRefs(useAuth)

const {
  documentsData,
  savedApplication,
  viewingApplication,
  updatingApplication,
  curriculumStored,
} = storeToRefs(useRequest);

onMounted(() => {
  if (viewingApplication.value || updatingApplication.value) {
    setSavedStoredValues();
  } else {
    loadLocalStore();
    setStoredValues();
  }
});



const getCurriculum = () => {
  return savedApplication.value && savedApplication.value.nombre_cv ? savedApplication.value.nombre_cv : '';
}

const checkForCurriculum = computed(() => {
  if (!viewingApplication.value && !updatingApplication.value) {
    return curriculumStored.value
      ? "Curriculum adjuntado"
      : "Adjuntar curriculum (MAX 5MB) *";
  }

  if (savedApplication.value) {
    return savedApplication.value.nombre_cv
      ? "Curriculum adjuntado"
      : "Adjuntar curriculum (MAX 5MB) *";
  }
});

const downloadDocument = async (uuid) => {
  try {
    $q.loading.show();
    const fileDownloaded = await downloadFile(uuid, getUserDocumentsPath);
    if (fileDownloaded) {
      resumeSrc.value = fileDownloaded;
      showResume.value = true;
    } else {
      $q.notify(notifyNegative("El archivo solicitado no existe "));
    }
  } catch (error) {
    $q.notify(notifyNegative("Hubo un error al obtener el archivo "));
  } finally {
    $q.loading.hide();
  }
};

const setSavedStoredValues = () => {
  rfc.value = savedApplication.value.rfc;
  imss.value = savedApplication.value.numero_imss;
  afore.value = savedApplication.value.numero_afore;
  fm2.value = savedApplication.value.extranjero_numero_fm2;
};

const setStoredValues = () => {
  rfc.value = documentsData.value.rfc;
  imss.value = documentsData.value.imss;
  afore.value = documentsData.value.afore;
  fm2.value = documentsData.value.fm2;
};

const updateStore = () => {
  if (viewingApplication.value) return;
  documentsData.value.rfc = rfc.value;
  documentsData.value.imss = imss.value;
  documentsData.value.afore = afore.value;
  documentsData.value.fm2 = fm2.value;
};

const onRejectedFile = () => {
  $q.notify(notifyNegative("Solo se aceptan archivos .pdf y tamaño max 5 Mb"));
};

const saveLocalStore = () => {
  if (!viewingApplication.value && !updatingApplication.value) {
    useLocalStorage.save("documentsData", documentsData.value);
    $q.notify(notifyPositive("Se ha guardado su progreso.", 1000));
  }
};

const loadLocalStore = () => {
  if(updatingApplication.value)
  return;

  const localStoreData = useLocalStorage.load("documentsData");

  if (localStoreData) documentsData.value = localStoreData;
};
</script>

<style scoped>
.rounded-borders {
  border-radius: 15px;
}
.content {
  height: 100%;
  background-color: rgb(40, 55, 68);
  padding-top: 2%;
}

.btn-adjuntar {
  background: rgba(126, 231, 231) 79%;
  text-align: center;
  height: 20%;
  width: 20%;
}

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
</style>
