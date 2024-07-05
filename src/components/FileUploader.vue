<template>
  <q-btn
    rounded
    class="q-ma-sm"
    icon="upload"
    :label="props.buttonText"
    @click.prevent="$emit('onOpenDialog')"
  >
  </q-btn>

  <q-dialog v-model="props.openDialog" @update:model-value="onCloseDialog()">
    <q-card>
      <q-card-section>
        <div class="text-h6">{{ props.dialogText }}</div>
      </q-card-section>

      <q-separator />

      <q-card-section class="justify-between" horizontal>
        <q-card-section>
          <q-file
            rounded
            standout
            accept=".pdf, pdf/*"
            bg-color="white"
            v-model="fileSelected"
            clearable
            :label="props.fileSelectorLabel"
          >
            <template v-slot:prepend
              ><q-icon color="dark" name="folder" />
            </template>
          </q-file>
        </q-card-section>
      </q-card-section>

      <q-separator />

      <q-card-actions class="justify-end q-pa-md">
        <q-btn
          flat
          label="Cerrar"
          v-close-popup
          class="text-red-8 q-mr-sm"
          style="border-radius: 8px"
          @click.prevent="$emit('onClose')"
        />
        <q-btn
          flat
          icon="upload"
          label="Subir"
          class="text-white"
          :class="!fileSelected ? 'bg-grey-5' : 'bg-green-13'"
          style="border-radius: 8px"
          @click.prevent="$emit('onUpload', fileSelected)"
          :disable="!fileSelected"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { ref } from "vue";

const props = defineProps([
  "buttonText",
  "dialogText",
  "fileSelectorLabel",
  "openDialog"
]);


const emit = defineEmits(["onOpenDialog","onUpload", "onClose"]);

const fileSelected = ref();


</script>
