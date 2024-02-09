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
        style="width: 100%; height: 150px"
        class="row justify-center"
      >
      <q-card
        style="min-width: 35%; max-width: 40%; border-radius: 10px"
      >
        <q-card-section>
          <div class="text-h6">Ingresa tu código de verificación</div>
        </q-card-section>

        <q-separator color="blue-grey-5" />

        <q-card-section class="q-mb-md">
          <div class="text-grey-7 text-body1">
            Revisa tu bandeja de correo electrónico.
          </div>
          <div class="row text-grey-7 text-body1">
            Se envió un código de 6 dígitos al correo:
            <p class="text-weight-medium">{{ userEmail }}</p>
          </div>
          <q-card-actions align="center">
            <q-input
              outlined
              v-model="securityCode"
              label="Ingresa tu código de verificación "
              mask="######"
              clearable
              counter
              standout="text-green-13"
              label-color="grey-8"
              class="q-mt-md"
              style="width: 70%"
              lazy-rules
              :rules="[
                (value) => !!value || 'Este campo no puede estar vacío.',
              ]"
            >
              <template v-slot:prepend>
                <q-icon name="lock" />
              </template>
            </q-input>
          </q-card-actions>
        </q-card-section>

        <q-separator color="blue-grey-5" />

        <q-card-section>
          <q-card-actions class="justify-end">
            <q-btn
              flat
              label="Cancelar"
              class="bg-grey-4 text-grey-8 q-mr-sm"
              style="border-radius: 8px"
              @click="toLogin()"
            />
            <q-btn
              flat
              label="Verificar"
              class="bg-green-13 text-white"
              style="border-radius: 8px"
              @click="verification()"
            />
          </q-card-actions>
        </q-card-section>
      </q-card>
      </div>
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref } from "vue";
import { storeToRefs } from "pinia";
import { notifyPositive, notifyNegative } from "src/utils/notifies.js";
import { useAuthStore } from "src/stores/auth.js";
import { useRouter } from "vue-router";
import { useQuasar } from "quasar";

const useAuth = useAuthStore();
const { verificationCode, userEmail } = storeToRefs(useAuth);
const $q = useQuasar();
const router = useRouter();
const securityCode = ref();

const toLogin = () => {
  router.replace("/login");
};

const toChangePassword = () => {
  router.replace("/restore-password/change-password");
};

const verification = () => {
  if (securityCode.value != "") {
    if (securityCode.value == verificationCode.value) {
      toChangePassword();
      $q.notify(notifyPositive("Código verificado"));
    } else {
      $q.notify(notifyNegative("Código incorrecto, intente nuevamente"));
    }
  }
};
</script>
