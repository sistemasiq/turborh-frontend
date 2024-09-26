<template>
      <q-badge rounded color="green" label="Opcional" :class="extraCssClasses + ' q-pa-xs q-ma-sm'" style="height: fit-content;"/>
  </template>

  <script setup>
const props = defineProps({
  extraCssClasses: {
    type: String,
    default: ''
  }
})
</script>