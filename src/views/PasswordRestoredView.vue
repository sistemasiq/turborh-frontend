<template>
  <q-layout view="hHr LpR lFf" class="bg-blue-grey-1">
    <q-page-container>
      <q-img
        src="~/assets/img/logo_turbo_navegador.png"
        class="q-mt-xl"
        style="width: 4%; height: 4%; position: relative; left: 48%"
      />
      <div class="text-grey-10 text-h6" style="text-align: center">
        Restablecer Contraseña
      </div>

      <q-card
        class="fixed-center"
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
