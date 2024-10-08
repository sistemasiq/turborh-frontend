<template>
  <q-btn
    rounded
    class="q-ma-sm"
    icon="upload"
    :label="props.buttonText"
    @click.prevent="$emit('onOpenDialog')"
  >
  </q-btn>

  <q-dialog v-model="props.openDialog">
    <q-card>
      <q-card-section>
        <div class="text-h6">{{ props.dialogText }}</div>
      </q-card-section>

      <q-separator />

      <q-card-section class="justify-between" horizontal>
        <div class="row justify-center items-center full-width">
          <q-card-section>
          <q-file
            rounded
            standout
            accept=".pdf, pdf/*"
            :label-color="fileSelected ? 'white' : 'dark'"
            :bg-color="fileSelected ? 'teal-5' : 'white'"
            v-model="fileSelected"
            clearable
            :label="props.fileSelectorLabel"
            input-style="color: #ffffff"
            style="min-width: fit-content; width: 400px;"
          >
            <template v-slot:prepend
              ><q-icon :color="fileSelected ? 'white' : 'dark'" name="folder" />
            </template>
          </q-file>

          <q-btn-dropdown
            flat
            auto-close
            color="white"
            text-color="grey-9"
            :icon="
              selectedPlatform === ''
                ? 'list'
                : selectedPlatform === 'Grupo Arhca'
                ? 'group'
                : 'list'
            "
            :label="
              selectedPlatform != ''
                ? selectedPlatform
                : 'seleccionar plataforma'
            "
            class="text-weight-regular q-mt-lg"
          >
            <q-list>
              <q-item
                v-for="(item, index) in psychometricPlatforms"
                :key="index"
                clickable
                v-close-popup
                @click.prevent="selectPsychPlatform(item)"
              >
                <q-item-section avatar>
                  <q-avatar
                    :icon="
                      item.psychPlatformName != 'Grupo Arhca'
                        ? 'list'
                        : 'group'
                    "
                    :color="
                      item.psychPlatformName === 'Grupo Arhca'
                        ? 'purple-4'
                        : 'grey-4'
                    "
                    text-color="white"
                  />
                </q-item-section>
                <q-item-section>
                  <q-item-label>{{ item.psychPlatformName }}</q-item-label>
                </q-item-section>
              </q-item>
            </q-list>
          </q-btn-dropdown>
        </q-card-section>
        </div>
      </q-card-section>

      <q-separator />

      <q-card-actions class="justify-end q-pa-md">
        <q-btn
          flat
          label="Cerrar"
          v-close-popup
          class="text-red-8 q-mr-sm"
          style="border-radius: 8px"
          @click.prevent="handleOnClose"
        />
        <q-btn
          flat
          icon="upload"
          label="Subir"
          class="text-white"
          :class="disableUploadButton ? 'bg-grey-5' : 'bg-green-13'"
          style="border-radius: 8px"
          @click.prevent="handleUpload"
          :disable="disableUploadButton"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";

import { getPsychometricPlatforms } from "src/services/user";

const psychometricPlatforms = ref();
const platformId = ref(0);
const selectedPlatform = ref('');


const props = defineProps([
  "buttonText",
  "dialogText",
  "fileSelectorLabel",
  "openDialog",
  "usePlatformsDropdown",
  "candidatePsychData"
]);

const disableUploadButton = computed(() => {
  return fileSelected.value === undefined || fileSelected.value === null || platformId.value === 0
})

onMounted(() => {
  getPsychPlatformsData();
})

const getPsychPlatformsData = async () => {
  try {
    const request = await getPsychometricPlatforms();
    if (request) {
      psychometricPlatforms.value = request;

    }
  } catch (error) {}
};

const selectPsychPlatform = (data) => {
  platformId.value = data.id;
  selectedPlatform.value = data.psychPlatformName;
};


const emit = defineEmits(["onOpenDialog","onUpload", "onClose"]);

const fileSelected = ref();

const handleOnClose = () => {

  emit('onClose');
  fileSelected.value = null; // Clear the file input after upload
  selectedPlatform.value = ''; // Clear the selected platform after upload
  platformId.value = 0; // Clear the selected platform ID after upload
}

const handleUpload = () => {
  emit("onUpload", fileSelected.value, platformId.value);
  fileSelected.value = null; // Clear the file input after upload
};
</script>
