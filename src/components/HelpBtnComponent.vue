<template>
  <q-btn
    icon="help"
    label="¿Necesitas ayuda?"
    class="text-dark bg-white"
    @click="emitClick"
  />
</template>

<script setup>

const emit = defineEmits(["click"]);

const emitClick = () => {
  emit("click");
};
</script>
