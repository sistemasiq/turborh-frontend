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
  
  // Define los eventos que puedes emitir desde este componente
  const emits = defineEmits(['today']);
  
  // Manejadores de eventos
  const handleToday = () => {
    emits('today');
  };
  
  </script>
  
  
 