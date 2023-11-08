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
  
  // Define los eventos que puedes emitir desde este componente
  const emits = defineEmits(['prev']);
  
  // Manejadores de eventos
  const handlePrev = () => {
    emits('prev');
  };
  </script>
  
  
 