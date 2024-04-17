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
            :src="getS3FileUrl(getAssetsPath, 'logo_turbo_black.png')"
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
        style="min-width: 35%; max-width: 40%; border-radius: 10px"
      >
        <q-card-section>
          <div class="text-h6">Envío de código de verificación</div>
        </q-card-section>

        <q-separator color="blue-grey-5" />

        <q-card-section>
          <q-card-actions align="center">
            <q-img
              style="width: 110px; height: 110px; border-radius: 100%"
              :src="getUserImage"
              class="q-mb-md q-mr-md"
            />
            <div class="text-grey-8 text-body1">
              <p class="q-mb-xs">{{ userName }}</p>
              <p class="q-mb-xs">{{ userEmail }}</p>
              <p class="q-mt-xs">{{ userPhoneNumber }}</p>
            </div>
          </q-card-actions>
          <div v-if="userPhoneNumber != null" class="text-grey-7 text-body1 text-center">
            Al dar clic en
            <q-badge class="q-pa-xs bg-green-13 text-white" label="enviar" />
            recibirás un <strong>código de verificación de un solo uso</strong>.
            <br />
            Podras ver tu código de verificación tanto por whatsApp como en tu
            bandeja de correo electrónico
          </div>

          <div v-if="userPhoneNumber == null" class="text-grey-7 text-body1 text-center">
            Al dar clic en
            <q-badge class="q-pa-xs bg-green-13 text-white" label="enviar" />
            recibirás un <strong>código de verificación de un solo uso</strong>.
            <br />
            Podras ver tu código de verificación en tu
            bandeja de correo electrónico
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
    </div>
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref, computed } from "vue";
import { storeToRefs } from "pinia";
import { getS3FileUrl } from "src/services/profiles.js";
import { getUserImagesPath, getAdminImagesPath, getAssetsPath } from "src/utils/folderPaths.js";
import { notifyNegative } from "src/utils/notifies.js";
import { useAuthStore } from "src/stores/auth.js";
import { useRouter } from "vue-router";
import { useQuasar } from "quasar";
import { sendSecurityCode, sendEmail } from "src/services/mail.js";
import {
  sendVerificationCodeMessage,
  verificationCodeData,
} from "src/services/whatsApp.js";

const useAuth = useAuthStore();
const { userName, userEmail, userPhoneNumber, photoUUID, verificationCode, role } =
  storeToRefs(useAuth);
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
  let folder = role.value === "u" ? getUserImagesPath : getAdminImagesPath;
  if (
    photoUUID.value === null ||
    photoUUID.value === undefined ||
    photoUUID.value === ""
  ) {
    return getS3FileUrl(folder, "default.png");
  } else {
    return getS3FileUrl(folder, photoUUID.value);
  }
});

const generateRandomNumber = () => {
  // Generate a number between 100000 and 999999 which is the verification code
  randomNumber.value = Math.floor(100000 + Math.random() * 900000);
  return randomNumber.value;
};

const sendVerificationCode = () => {
  //Call the 'generateRandomNumber' function to generate the verification code and send an email to the user
  if (userEmail.value != "" && userPhoneNumber.value != null) {
    try {
      $q.loading.show({ message: "Cargando..." });
      generateRandomNumber();
      verificationCode.value = generateRandomNumber();
      const mailData = sendSecurityCode(userEmail.value, randomNumber.value);
      const messageData = verificationCodeData(
        userPhoneNumber.value,
        randomNumber.value
      );
      sendVerificationCodeMessage(messageData);
      sendEmail("security-code", mailData);
      toChangePassword();
    } catch (error) {
      console.log("ERROR while sending the email: " + error);
    } finally {
      $q.loading.hide();
    }
  } else if (userEmail.value != "", userPhoneNumber.value == null) {
    try {
      $q.loading.show({ message: "Cargando..." });
      generateRandomNumber();
      verificationCode.value = generateRandomNumber();
      const mailData = sendSecurityCode(userEmail.value, randomNumber.value);
      sendEmail("security-code", mailData);
      toChangePassword();
    } catch (error) {
      console.log("ERROR while sending the email: " + error);
    } finally {
      $q.loading.hide();
    }
  }
};
</script>
