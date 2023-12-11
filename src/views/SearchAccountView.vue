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
        style="min-width: 35%; max-width: 40%; border-radius: 10px;"
      >
        <q-card-section>
          <div class="text-h6">
            Recuperación de cuenta
          </div>
        </q-card-section>

        <q-separator color="blue-grey-5" />

        <q-card-section>
          <div class="text-grey-7 text-body1">
            Ingresa tu correo electrónico para buscar tu cuenta.
          </div>
          <q-card-actions align="center">
            <q-input
              outlined
              v-model="email"
              label="Ingresa tu correo electrónico"
              clearable
              standout="text-green-13"
              label-color="grey-8"
              class="q-mt-md"
              style="width: 100%"
              lazy-rules
              :rules="[
                (value) => !!value || 'Este campo no puede estar vacío.',
                (value) =>
                  /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(
                    value
                  ) || 'El correo electrónico debe ser válido',
              ]"
            >
              <template v-slot:prepend>
                <q-icon name="email" />
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
              icon="search"
              label="Buscar"
              class="bg-blue-13 text-white"
              style="border-radius: 8px"
              @click="searchUserAccount()"
            />
          </q-card-actions>
        </q-card-section>
      </q-card>
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref } from "vue";
import { storeToRefs } from "pinia";
import axios from "axios";

import { notifyNegative } from "src/utils/notifies.js";
import { useAuthStore } from "src/stores/auth.js";
import { useRouter } from "vue-router";
import { useQuasar } from "quasar";

const useAuth = useAuthStore();
const { userId, userName, userEmail, photoUUID } = storeToRefs(useAuth);
const $q = useQuasar();
const router = useRouter();
const email = ref("");

const toLogin = () => {
  router.replace("/login");
};

const toSendVerificationCode = () => {
  router.replace("/restore-password/send-verification");
};

const searchUserAccount = async () => {
  //Call the 'generateRandomNumber' function to generate the verification code and send an email to the user
  if (email.value != "") {
    try {
      $q.loading.show({ message: "Cargando..." });

      const request = await axios.get(`/users/verify/email/`+email.value);

        if(request.status == 200) {
          userId.value = request.data.id;
          userName.value = request.data.userName;
          userEmail.value = email.value;
          photoUUID.value = request.data.photoUUID;
          console.log(request.data)
          toSendVerificationCode();
        } else {
          $q.notify(notifyNegative("Usuario no encontrado. Intenta nuevamente"));
        }

    } catch (error) {
      console.log("Error de envío de correo: " + error);
    } finally {
      $q.loading.hide();
    }
  } else if (email.value == "") {
    $q.notify(notifyNegative("Ingrese su correo electrónico"));
  }
};

</script>
