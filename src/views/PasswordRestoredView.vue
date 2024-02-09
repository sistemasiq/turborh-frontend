<template>
   <q-layout view="hhr lpr lff" class="bg-blue-grey-1">
    <q-page-container>
      <div
        style="width: 100%; height: 150px"
        class="row justify-center"
      >
        <div style="width: 100%;"
        class="row justify-center q-mt-lg">
          <q-img
            src="~/assets/img/logo_turbo_navegador.png"
            style="width: 70px; height: 70px"
          />
        </div>
        <div class="text-grey-10 text-h6 row justify-center q-mb-lg">
          Restablecer Contraseña
        </div>
      </div>
      <div
        style="width: 100%;"
        class="row justify-center"
      >
      <q-card
        style="min-width: fit-content; width: 30%; border-radius: 10px"
      >
        <q-card-section>
          <div class="text-h6">Tu contraseña a sido cambiada exitosamente</div>
        </q-card-section>

        <q-separator color="blue-grey-5" />

        <q-card-section class="q-mb-md">
          <div class="text-center q-mb-sm">
            <q-icon size="xl" color="green-13" name="check_circle" />
          </div>
          <div class="text-grey-7 text-body1">
            Ahora podrás acceder a tu cuenta utilizando tu nueva contraseña.
          </div>
        </q-card-section>

        <q-separator color="blue-grey-5" />

        <q-card-section>
          <q-card-actions class="justify-center">
            <q-btn
              flat
              label="Finalizar"
              class="bg-green-13 text-white"
              style="border-radius: 8px"
              @click="toLogin()"
            />
          </q-card-actions>
        </q-card-section>
      </q-card>
      </div>
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { useRouter } from "vue-router";

const router = useRouter();

const toLogin = () => {
  router.push("/login");
};

</script>
