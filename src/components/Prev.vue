<!--This is a component of the agenda to go to the previous month-->
<template>
    <div class="row justify-center">
      <div class="q-pa-md q-gutter-sm row">
        <q-btn
          flat
          round
          dense
          icon= arrow_back_ios_new
          @click="handlePrev"
        >
        <q-tooltip> Mes anterior </q-tooltip>
      </q-btn>

      </div>
    </div>
  </template>

  <script setup>
  import { defineEmits } from 'vue';

// Defines the eventos that you can emit from this component
  const emits = defineEmits(['prev']);

// events handler
  const handlePrev = () => {
    emits('prev');
  };
  </script>


