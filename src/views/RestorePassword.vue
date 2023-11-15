<template>
  <q-layout view="hHr LpR lFf" class="bg-blue-grey-1">
    <q-page-container>
      <q-img
        src="~/assets/img/logo_turbo_navegador.png"
        class="q-mt-xl"
        style="width: 5%; height: 5%; position: relative; left: 48%"
      />
      <div class="text-grey-10 text-h6" style="text-align: center">
        Restablecer Contraseña
      </div>
      <q-card
        v-if="verificationStep == 1"
        class="fixed-center"
        style="min-width: fit-content; width: 30%; border-radius: 10px"
      >
        <q-card-section>
          <div class="text-h6">
            Te enviaremos un código a tu correo electrónico
          </div>
        </q-card-section>

        <q-separator color="blue-grey-5" />

        <q-card-section class="q-mb-md">
          <div class="text-grey-7 text-body1">
            Te enviaremos un código al correo asociado a tu cuenta de usuario
          </div>
          <q-card-actions align="center">
            <q-input
              standout="bg-white text-grey-8"
              outlined
              v-model="userName"
              label="Ingresa tu nombre de usuario"
              class="bg-grey-3 q-mt-md"
              style="width: 70%"
            >
              <template v-slot:prepend>
                <q-icon name="person" />
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
              icon="send"
              label="Enviar"
              class="bg-green-13 text-white"
              style="border-radius: 8px"
              @click="getUserEmail()"
            />
          </q-card-actions>
        </q-card-section>
      </q-card>

      <!-- Code verification -->

      <q-card
        v-if="verificationStep == 2"
        class="fixed-center"
        style="min-width: fit-content; width: 30%; border-radius: 10px"
      >
        <q-card-section>
          <div class="text-h6">Ingresa tu código de seguridad</div>
        </q-card-section>

        <q-separator color="blue-grey-5" />

        <q-card-section class="q-mb-md">
          <div class="text-grey-7 text-body1">
            Revisa tu bandeja de correo electrónico.
          </div>
          <div class="text-grey-7 text-body1">
            Se envió un código de 6 dígitos al correo: {{ userData.email }}
          </div>
          <q-card-actions align="center">
            <q-input
              standout="bg-white text-grey-8"
              outlined
              v-model="securityCode"
              label="Ingresa tu código de seguridad"
              class="bg-grey-3 q-mt-md"
              style="width: 70%"
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

      <!-- Code verification -->

      <q-card
        v-if="verificationStep == 3"
        class="fixed-center"
        style="min-width: fit-content; width: 30%; border-radius: 10px"
      >
        <q-card-section>
          <div class="text-h6">Crea una nueva contraseña</div>
        </q-card-section>

        <q-separator color="blue-grey-5" />

        <q-card-section class="q-mb-md">
          <div class="text-grey-7 text-body1">
            Crea una nueva contraseña con un mínimo de 6 caracteres.
          </div>
          <div class="text-grey-7 text-body1">
            Utiliza letras y números para crear una contraseña más segura.
          </div>
          <q-card-actions align="center">
            <q-input
              standout="bg-white text-grey-8"
              outlined
              v-model="password"
              :type="isPasswordVisible ? 'text  ' : 'password'"
              label="Ingresa tu nueva contraseña"
              class="q-mt-md"
              :rules="[
                (value) => !!value || 'Este campo no puede estar vacío.'
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
              @click="changePassword()"
            />
          </q-card-actions>
        </q-card-section>
      </q-card>

      <!-- Code verification -->

      <q-card
        v-if="verificationStep == 4"
        class="fixed-center"
        style="min-width: fit-content; width: 30%; border-radius: 10px"
      >
        <q-card-section>
          <div class="text-h6">Tu contraseña a sido cambiada exitosamente</div>
        </q-card-section>

        <q-separator color="blue-grey-5" />

        <q-card-section class="q-mb-md">
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
import { ref } from "vue";
import axios from "axios";
import { getS3FileUrl } from "src/services/profiles.js";
import { getUserImagesPath } from "src/utils/folderPaths.js";
import { sendSecurityCode, passwordChange, sendEmail } from "src/services/mail.js";
import { notifyPositive, notifyNegative } from "src/utils/notifies.js";
import { userCredentials } from "src/utils/operations.js";
import { useRouter } from "vue-router";
import { useQuasar } from "quasar"

const $q = useQuasar();
const router = useRouter();
const userName = ref("");
const userData = ref();
const randomNumber = ref();
const verificationStep = ref(1);
const securityCode = ref();
const password = ref();
const isPasswordVisible = ref(true)


const toLogin = () => {
  router.push("/login");
};

const generateRandomNumber = () => {
  // Generate a number between 100000 and 999999 which is the verification code
  randomNumber.value = Math.floor(100000 + Math.random() * 900000);
  return randomNumber.value;
};

const getUserEmail = async () => {
  if (userName.value != "") {
    console.log("ojo");
    const path = "/auth/email/";

    try {
      $q.loading.show({message: "Cargando..."});
      const response = await axios.get(path + userName.value);

      if (response.status == 200) {
        userData.value = response.data;
        console.log("Info", userData.value);
        generateRandomNumber();
        console.log("randomNumber", randomNumber.value);

        const mailData = sendSecurityCode(
          userData.value.email,
          userData.value.userName,
          randomNumber.value
        );

        sendEmail("security-code", mailData);
        verificationStep.value = 2;
      }
    } catch (error) {
      notifyNegative("Usuario no encontrado");
    } finally {
      $q.loading.hide();
    }
  } else if (userName.value == "") {
    notifyNegative("Ingrese su nombre de usuario");
    console.log("ojo vacío");
  }
};

const verification = () => {
  if (securityCode.value != "") {
    if (securityCode.value == randomNumber.value) {
      verificationStep.value = 3;
      console.log("well done");
    } else {
      console.log("try again bro");
      console.log("email code: " + securityCode.value);
      console.log("random number: " + randomNumber.value);
    }
  }
};

const changePassword = async () => {

  const url = "/auth/password";

  if(password.value != "") {
    try {
      $q.loading.show({message: "Cargando..."});
      let data = userCredentials(userData.value.id, password.value);

      const request = await axios.put(url, data);

      if(request.status == 200) {
        const mailData = passwordChange(
          userData.value.email,
          userData.value.userName
        );

        sendEmail("password-changed-confirmation", mailData);
        verificationStep.value = 4;
        $q.notify(notifyPositive("Contraseña actualizada"));
      }
    } catch (error) {
      console.log("error: " + error)
    } finally {
      $q.loading.hide();
    }
  }

}
</script>
