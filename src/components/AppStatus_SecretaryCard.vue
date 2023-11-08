<template>
  <q-card class="my-card q-ml-lg">
    <q-card-section horizontal >
      <q-card
        class="my-card"
        style="
          max-width: 700px;
          border-radius: 30px;
          color: #ffffff;
          background: #050606;
        "
      >
      <q-btn class="delete-button" style="position: absolute; right: 0; background: rgb(215, 86, 86); border-radius: 10%;" icon="delete" @click="deleteJobApplication" />
        <q-img
          :src="require('@/assets/img/secretary.jpg')"
          style="max-width: 480px; height: 300px"
        />
        <q-card-section>
          <div class="text-h4">Contador</div>
          <div class="text-h6">Estado:</div>
        </q-card-section>
      </q-card>
    </q-card-section>
  </q-card>
</template>

<script setup>
import { useQuasar } from "quasar";

const deleteJobApplication = () => {
  isVisible.value = false;
}
</script>

<style>
.delete-button:not(.q-btn-icon):hover {
  background-color: rgb(215, 86, 86);
}
</style>
