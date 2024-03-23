<!--This is a component of the agenda to go to the current month-->
<template>
    <div class="row justify-center">
      <div class="q-pa-md q-gutter-sm row">
        <q-btn
          no-caps
          @click="handleToday"
        >
          Hoy
        </q-btn>

      </div>
    </div>
  </template>

  <script setup>
  import { defineEmits } from 'vue';

  // Defines the eventos that you can emit from this component
  const emits = defineEmits(['today']);

  // events handler
  const handleToday = () => {
    emits('today');
  };

  </script>


