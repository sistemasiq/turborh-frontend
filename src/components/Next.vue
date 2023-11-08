<template>
  <div class="row justify-center">
    <div class="q-pa-md q-gutter-sm row">
      <q-btn
          flat
          round 
          dense
        icon= arrow_forward_ios
        @click="handleNext"
      > 
      <q-tooltip>Siguiente mes</q-tooltip>
    </q-btn>
    </div>
  </div>
</template>

<script setup>
import { defineEmits } from 'vue';

// Define los eventos que puedes emitir desde este componente
const emits = defineEmits(['next']);

// Manejadores de eventos
const handleNext = () => {
  emits('next');
};
</script>


