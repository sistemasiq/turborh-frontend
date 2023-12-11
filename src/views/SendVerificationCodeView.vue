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
          <div class="text-h6">Envío de código de verificación</div>
        </q-card-section>

        <q-separator color="blue-grey-5" />

        <q-card-section>
          <q-card-actions align="center">
            <q-img
              style="width: 100px; height: 100px; border-radius: 100%"
              :src="getUserImage"
              class="q-mb-md q-mr-md"
            />
            <div class="text-grey-8 text-body1">
              <p class="q-mb-xs">{{ userName }}</p>
              <p class="q-mt-xs">{{ userEmail }}</p>
            </div>
          </q-card-actions>
          <div class="text-grey-7 text-body1 text-center">
            Al dar clic en enviar recibirás un código de verificación al correo
            electronico siguiente {{ userEmail }}
          </div>
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
              icon="send"
              label="Enviar"
              class="bg-green-13 text-white"
              style="border-radius: 8px"
              @click="sendVerificationCode()"
            />
          </q-card-actions>
        </q-card-section>
      </q-card>
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref, computed } from "vue";
import axios from "axios";
import { storeToRefs } from "pinia";
import { getS3FileUrl } from "src/services/profiles.js";
import { getUserImagesPath } from "src/utils/folderPaths.js";
import { notifyPositive, notifyNegative } from "src/utils/notifies.js";
import { userCredentials } from "src/utils/operations.js";
import { useAuthStore } from "src/stores/auth.js";
import { useRouter } from "vue-router";
import { useQuasar } from "quasar";
import {
  sendSecurityCode,
  sendEmail,
} from "src/services/mail.js";

const useAuth = useAuthStore();
const { userId, userName, userEmail, photoUUID, verificationCode } = storeToRefs(useAuth);
const $q = useQuasar();
const router = useRouter();
const randomNumber = ref();

const toLogin = () => {
  router.replace("/login");
};

const toChangePassword = () => {
  router.replace("/restore-password/verification");
};

const getUserImage = computed(() => {
  if (
    photoUUID.value === null ||
    photoUUID.value === undefined ||
    photoUUID.value === ""
  ) {
    return getS3FileUrl(getUserImagesPath, "default_user_icon.png");
  } else {
    return getS3FileUrl(getUserImagesPath, photoUUID.value);
  }
});

const generateRandomNumber = () => {
  // Generate a number between 100000 and 999999 which is the verification code
  randomNumber.value = Math.floor(100000 + Math.random() * 900000);
  return randomNumber.value;
};

const sendVerificationCode = () => {
  //Call the 'generateRandomNumber' function to generate the verification code and send an email to the user
  if (userEmail.value != "") {
    try {
      $q.loading.show({ message: "Cargando..." });
      generateRandomNumber();
      verificationCode.value = generateRandomNumber();
      const mailData = sendSecurityCode(userEmail.value, randomNumber.value);
      console.log("Email data: "+mailData);
      sendEmail("security-code", mailData);
      toChangePassword();
    } catch (error) {
      console.log("Error de envío de correo: " + error);
    } finally {
      $q.loading.hide();
    }
  } else if (userEmail.value == "") {
    $q.notify(notifyNegative("Ingrese su correo electrónico"));
  }
};
</script>
