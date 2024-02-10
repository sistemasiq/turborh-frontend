<template>
    <div class="q-pa-md q-gutter-md">
      <q-badge rounded color="green" :label="variable == true
       ? 'Opcional'
       : 'Campo Opcional'
       " />
    </div>
  </template>
  <script setup>
  import { ref} from "vue";
  const variable = ref(true)
  </script>