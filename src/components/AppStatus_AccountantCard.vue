<template>
  <q-card >
    <q-card-section horizontal style="max-width: 1400px; font-family: Arial">
      <q-card
        style="
        border-bottom-right-radius: 10%;
        border-bottom-left-radius: 10%;
          color: #ffffff;
          background: #050606;
        "
      >
        <q-btn
          class="delete-button absolute-top-right"
          style="
            background: rgb(215, 86, 86);
            border-radius: 10%;
          "
          icon="delete"
        />
        <q-img
          :src="require('@/assets/img/accountant.jpg')"
          style="max-width: 480px; height: 300px"
        />
        <q-card-section>
          <div class="text-h4">Asistente Contable</div>
          <div class="text-h6">Estado:</div>
        </q-card-section>
      </q-card>
    </q-card-section>
  </q-card>
</template>

<script setup>
import { useQuasar } from "quasar";
</script>

<style scoped>
</style>
