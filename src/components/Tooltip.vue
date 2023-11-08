<template>
    <q-tooltip
      v-if="currentText"
      class="bg-dark text-white text-body2"
      anchor="top middle"
      self="center middle"
      transition-show="slide-up"
      transition-hide="fade"
      :delay="300"
      transition-duration="300"
      :offset="[10, 25]"
    >
      {{ currentText }}
    </q-tooltip>
  </template>
  
  <script setup>
  import { ref, onMounted } from "vue";
  
  const props = defineProps(["text"]);
  
  const currentText = ref("");
  
  onMounted(() => {
    currentText.value = props.text;
  });
  </script>
  