<!--This is a component of the agenda to go to the next month-->
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

// Defines the eventos that you can emit from this component
const emits = defineEmits(['next']);

// events handler
const handleNext = () => {
  emits('next');
};
</script>


