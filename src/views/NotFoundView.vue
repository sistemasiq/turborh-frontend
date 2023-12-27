<template>
  <div class="q-page column items-center justify-center" style="height: 100vh;">
    <div>
      <q-icon name="mdi_sentiment_dissatisfied" class="text-grey-9 " style="font-size: 165px;" />
      <p class="text-center text-h2 q-mt-lg">Oops! La ruta no fue encontrada</p>
    </div>
    <div class="text-center q-mt-md">
      <q-btn class="q-pa-md" rounded color="blue-13" icon="home" label="Regresar" @click="toHome()" />
    </div>
  </div>
</template>

<script setup>
import { useRouter } from "vue-router";

const router = useRouter();

const toHome = () => {
  router.push("/home");
}
</script>
