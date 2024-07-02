<template>
  <q-btn
    label="Ver últimas modificaciones"
    :text-color="lastModificationsCount > 0 ? 'primary' : 'grey'"
    color="white"
    rounded
    class="q-mr-xl q-mt-lg"
    :disable="lastModificationsCount === 0"
    @click.prevent="showLastModificationsDialog = true"
  >
    <q-badge
      class="q-mr-sm"
      v-if="lastModificationsCount > 0"
      color="red"
      floating
      >{{ lastModificationsCount }}</q-badge
    >
  </q-btn>

  <q-dialog v-model="showLastModificationsDialog" persistent>
    <q-card>
      <q-card-section>
        <div class="text-h6">
          Ultima modificación hecha el: {{ dateLastModified }}
        </div>
      </q-card-section>
      <q-separator />

      <div v-for="(item, index) in modifications" :key="index">
        <q-card-section v-if="!pageNameAlreadySet(index)">
          <q-input
            class="q-ml-sm q-mr-sm"
            standout
            readonly
            :label="item.pageName"
          />
        </q-card-section>

        <q-input
          class="q-ml-xl q-mr-xl q-mt-xs"
          readonly
          v-model="item.newValue"
          :label="item.fieldName"
        />
      </div>

      <q-card-actions align="right">
        <q-btn flat label="CERRAR" color="red" v-close-popup />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { ref, onMounted } from "vue";

import { useRequestUser } from "src/stores/requestUser";
import { storeToRefs } from "pinia";

const useUserApplication = useRequestUser();

const { savedApplication } = storeToRefs(useUserApplication);

const lastModificationsCount = ref(0);
const showLastModificationsDialog = ref(false);
const modifications = ref();

const dateLastModified = ref();

onMounted(() => {
  setLastModifications();
});

const setLastModifications = () => {
  if (savedApplication.value.ultimas_modificaciones === null) return;

  modifications.value = savedApplication.value.ultimas_modificaciones;
  lastModificationsCount.value =
    savedApplication.value.ultimas_modificaciones.length;
  dateLastModified.value = savedApplication.value.modificado;
};

const pageNameAlreadySet = (currentIndex) => {
  if (currentIndex === 0) return false;

  const previousIndex = currentIndex - 1;

  if (
    modifications.value[previousIndex].pageName ===
    modifications.value[currentIndex].pageName
  )
    return true;

  return false;
};
</script>
