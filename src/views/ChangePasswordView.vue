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
        <q-card-section horizontal>
          <div class="q-pa-sm  row justify-between" style="width: 100%;">
            <div class="text-h6 q-pa-sm">
            Crea una nueva contraseña
          </div>
          <q-btn round flat icon="help" size="md" @click="helpDialog = !helpDialog" />
          </div>
        </q-card-section>

        <q-separator color="blue-grey-5" />

        <q-card-section class="q-mb-md">
          <div class="text-grey-7 text-body1">
            Utiliza letras y números para crear una contraseña más segura.
          </div>
          <q-card-actions align="center">
            <q-input
              outlined
              v-model="password"
              :type="isPasswordVisible ? 'text  ' : 'password'"
              label="Ingresa tu nueva contraseña"
              standout="text-green-13"
              label-color="grey-8"
              class="q-mt-md"
              :rules="[
                (value) => !!value || 'Este campo no puede estar vacío.',
              ]"
              style="width: 70%"
            >
              <template v-slot:append>
                <q-icon
                  :name="isPasswordVisible ? 'visibility_off' : 'visibility'"
                  class="cursor-pointer"
                  @click="isPasswordVisible = !isPasswordVisible"
                />
              </template>
            </q-input>

            <q-input
              outlined
              v-model="confirmPassword"
              :type="isPasswordVisible ? 'text  ' : 'password'"
              label="Confirma tu contraseña"
              standout="text-green-13"
              label-color="grey-8"
              :rules="[
                (value) => !!value || 'Este campo no puede estar vacío.',
              ]"
              style="width: 70%"
            >
              <template v-slot:append>
                <q-icon
                  :name="isPasswordVisible ? 'visibility_off' : 'visibility'"
                  class="cursor-pointer"
                  @click="isPasswordVisible = !isPasswordVisible"
                />
              </template>
            </q-input>
          </q-card-actions>
          <div class="row text-grey-8">
            Nivel de seguridad de la contraseña:
            <q-badge
            class="q-ml-xs"
            :label="evaluateSecurityLevel"
              :color="
                evaluateSecurityLevel === 'Bajo'
                  ? 'red-13'
                  : evaluateSecurityLevel === 'Buena'
                  ? 'amber-14'
                  : evaluateSecurityLevel === 'Optima'
                  ? 'green-13'
                  : 'grey'
              "
            />
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
              label="Confirmar"
              class="bg-green-13 text-white"
              style="border-radius: 8px"
              @click.prevent="changePassword()"
              :disable="disableButton()"
            />
          </q-card-actions>
        </q-card-section>
      </q-card>
      </div>
      <q-dialog
      v-model="helpDialog"
      >
        <q-card
        class="fixed-center"
        style="min-width: fit-content; width: 30%; border-radius: 10px"
      >
      <q-card-section horizontal>
          <div class="q-pa-sm  row justify-between items-center" style="width: 100%;">
            <div class="text-h6 q-pa-sm">
              Crear una contraseña segura
          </div>
          <q-btn style="width: fit-content; height: fit-content;" round flat icon="close" size="md" @click="helpDialog = !helpDialog" />
          </div>
        </q-card-section>

        <q-separator color="blue-grey-5" />

        <q-card-section class="q-mb-md">

          <div class="text-grey-7 text-body1">

          </div>
          <div class="row text-grey-8">
            Sigue las siguientes recomendaciones para crear una contraseña
            <q-badge
            class="q-ml-xs"
            label="Optima"
              color="green-13"
            />
          </div>
          <div class="q-ml-md q-mt-sm">
            <div class="row text-grey-8">
            <q-icon name="arrow_right" color="black" size="xs"/>
            No uses información personal (e. nombres, apodos, etc.)
          </div>
          <div class="row text-grey-8">
            <q-icon name="arrow_right" color="black" size="xs"/>
            Usa simbolos y números (e. * . - 4 , etc)
          </div>
          <div class="row text-grey-8">
            <q-icon name="arrow_right" color="black" size="xs"/>
            Combina mayusculas y minusculas
          </div>
          <div class="row text-grey-8">
            <q-icon name="arrow_right" color="black" size="xs"/>
            Escribe mínimo 6 caracteres
          </div>
          </div>
        </q-card-section>
      </q-card>
      </q-dialog>
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref, computed } from "vue";
import axios from "axios";
import { storeToRefs } from "pinia";
import {
  passwordChange,
  sendEmail,
} from "src/services/mail.js";
import { notifyPositive, notifyNegative } from "src/utils/notifies.js";
import { userCredentials } from "src/utils/operations.js";
import { useAuthStore } from "src/stores/auth.js";
import { useRouter } from "vue-router";
import { useQuasar } from "quasar";
import { sendPasswordChangedInformation, passwordChangedInformation } from "src/services/whatsApp.js";

const useAuth = useAuthStore();
const { userId, userName, userEmail, userPhoneNumber, photoUUID, verificationCode } = storeToRefs(useAuth);
const $q = useQuasar();
const router = useRouter();
const password = ref("");
const confirmPassword = ref("");
const isPasswordVisible = ref(true);
const securityPasswordLevel = ref("Baja");
const helpDialog = ref(false);

const toLogin = () => {
  router.replace("/login");
};

const toPasswordRestored = () => {
  router.replace("/restore-password/password-restored");
};

const changePassword = async () => {
  const url = "/users/password";

  if (password.value == confirmPassword.value) {
    try {
      $q.loading.show({ message: "Cargando..." });
      let data = userCredentials(userId.value, password.value);

      const request = await axios.put(url, data);

      if (request.status == 200) {
        const mailData = passwordChange(userEmail.value, userName.value);

        sendPasswordChangedInformation(passwordChangedInformation(userPhoneNumber.value, "reclutamiento@turbomaquinas.com"));
        sendEmail("password-changed-confirmation", mailData);
        $q.notify(notifyPositive("Contraseña actualizada"));
        toPasswordRestored();

        userId.value = '';
        userName.value = '';
        userEmail.value = '';
        photoUUID.value = '';
        verificationCode.value = '';
        password.value = '';
      }
    } catch (error) {
      console.log("ERROR while changing the password: " + error);
    } finally {
      $q.loading.hide();
    }
  } else if (password.value != confirmPassword.value) {
    $q.notify(notifyNegative("Las contraseñas no coinciden"));
  }
};

const disableButton = () => {
  return !password.value || !confirmPassword.value;
};

const upperCaseRegex = /[A-Z]/;
const lowerCaseRegex = /[a-z]/;
const numberRegex = /\d/;
const specialCharactersRegex = /[!@#$%^&*()_+{}:;<>,.?~/-]/;

const evaluateSecurityLevel = computed(() => {
  const hasUpperCase = upperCaseRegex.test(password.value);
  const hasLowerCase = lowerCaseRegex.test(password.value);
  const hasNumbers = numberRegex.test(password.value);
  const hasSpecialChars = specialCharactersRegex.test(password.value);

  if (
    password.value.length >= 6 &&
    hasUpperCase &&
    hasLowerCase &&
    hasNumbers &&
    hasSpecialChars
  ) {
    securityPasswordLevel.value = "Optima";
  } else if (
    password.value.length >= 6 &&
    (hasUpperCase || hasLowerCase || hasNumbers || hasSpecialChars)
  ) {
    securityPasswordLevel.value = "Buena";
  } else if (password.value.length < 6) {
    securityPasswordLevel.value = "Bajo";
  }
  return securityPasswordLevel.value;
});
</script>
