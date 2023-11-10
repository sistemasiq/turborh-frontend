<template>
  <q-card flat bordered class="rounded-borders bg-white fit">
    <q-card-section class="row items-center">
      <p class="text-h5 q-mt-xl">Agregar comentarios: </p>
      <q-btn
        icon="close"
        flat
        color="white"
        class="absolute-top-right bg-red-5"
        v-close-popup
      />
    </q-card-section>

    <q-card-section class="q-pt-none">
      <q-input
        filled
        v-model="note"
        type="textarea"
        autogrow
        borderless
        class="q-mb-md"
      />
    </q-card-section>

    <div class="text-right q-mr-md q-mb-md">
      <q-btn color="green-5" icon="save" label="Guardar" @click="saveNote" :loading="savingNote" />
    </div>
  </q-card>
</template>

  
  <script setup>
  import { ref, onMounted } from "vue";
  import { storeToRefs } from "pinia";
  import { useQuasar } from "quasar";
  import { notifyNegative, notifyPositive } from "src/utils/notifies";
  import axios from "axios";
  import { useRequisitionDetailsStore } from "src/stores/requisitionDetails";
  
  const $q = useQuasar();
  const props = defineProps(["currentNote"]);
  const note = ref("");

  const useRequisitionDetails = useRequisitionDetailsStore();

  const { requisitionData } = storeToRefs(useRequisitionDetails)

  const savingNote = ref(false);

  onMounted(() => {
    note.value = props.currentNote;
    console.log(note.value);
  })
  
  const saveNote = async() => {
    try {
      savingNote.value = true;
      const request = await axios.put(`requisicion/nota/${note.value}/num/${requisitionData.value.numRequisition}`)

      if(request.status === 200){
        $q.notify(notifyPositive("Comentarios guardados correctamente", 600))
        requisitionData.value.notes = note.value;
        savingNote.value = false;
      }
    } catch (error) {
      savingNote.value = false;
      $q.notify(notifyNegative("Hubo un error al guardar sus comentarios"))
    }
  }


  </script>
