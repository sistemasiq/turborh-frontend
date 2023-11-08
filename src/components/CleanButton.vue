<template>
  <q-btn
    v-on:vnode-mounted="setFields(fields)"
    size="md"
    class="btn-clean q-mt-xl"
    rounded
    text-color="white"
    color="red-5"
    label="Limpiar"
    icon="cleaning_services"
    @click.prevent="clean"
  />
</template>

<script setup>
import { ref } from "vue";

const props = defineProps(["fields"]);

const localFields = ref(props.fields);

const clean = () => {
  Object.keys(localFields.value).forEach((field) => {
    localFields.value[field] = "";
  });
};

const setFields = (fields) => {
  // Ensure fields is reactive
  localFields.value = ref(fields);
};
</script>
