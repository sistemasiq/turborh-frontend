<template>
  <q-layout>
    <q-page-container>
      <q-page>
        <div class="login-background">
          <div class="row q-ma-auto" style="padding-left: 15%">
            <div
              class="col-12 col-md-5 col-lg6 q-ma-auto"
              style="
                padding-top: 5%;
                padding-right: 5%;
                z-index: 10;
                position: relative;
              "
            >
              <q-card class="q-pa-lg login-card">
                <div
                  class="row q-ma-auto"
                  style="
                    justify-content: center;
                    align-items: center;
                    padding-left: 3%;
                  "
                >
                  <q-img
                    :src="getLogoImage"
                    alt="Logo"
                    title="Turbomaquinas S.A. de C.V."
                    style="width: 30%; height: 10%"
                    spinner-color="cyan-2"
                  />
                </div>
                <div
                  class="row q-ma-auto"
                  style="justify-content: center; align-items: center"
                >
                  <h5 class="text-h5 text-white q-my-md">Iniciar Sesión</h5>
                </div>
                <q-card-section>
                  <q-form class="q-gutter-md">
                    <q-input
                      dark
                      outlined
                      color="cyan-1"
                      v-model="userName"
                      type="text"
                      label="Usuario o Correo electrónico"
                      label-color="white"
                      lazy-rules
                      :rules="[
                        (value) =>
                          !!value || 'Este campo no puede estar vacío.',
                      ]"
                      class="input-brand"
                    >
                      <template v-slot:prepend>
                        <q-icon name="person_outline" class="color-brand" />
                      </template>
                    </q-input>
                    <q-input
                      dark
                      outlined
                      color="cyan-1"
                      v-model="password"
                      :type="isPasswordVisible ? 'text' : 'password'"
                      label="Contraseña"
                      label-color="white"
                      :rules="[
                        (value) =>
                          !!value || 'Este campo no puede estar vacío.',
                        (value) =>
                          value === password || 'La contraseña es incorrecta',
                      ]"
                      class="input-brand"
                    >
                      <template v-slot:prepend>
                        <q-icon name="lock" class="color-brand" />
                      </template>
                      <template v-slot:append>
                        <q-btn
                          class="card-transparent color-brand"
                          flat
                          no-border
                          v-if="!isPasswordVisible && password"
                          icon="visibility_off"
                          @click="changePasswordVisibility"
                        />
                        <q-btn
                          class="card-transparent color-brand"
                          flat
                          no-border
                          v-if="isPasswordVisible && password"
                          icon="visibility"
                          @click="changePasswordVisibility"
                        />
                      </template>
                    </q-input>
                  </q-form>
                </q-card-section>
                <div>
                  <div style="text-align: center">
                    <q-btn
                      color="primary"
                      @click.prevent="onLoginClick"
                      style="width: 90%"
                      :disabled="disableLoginButton()"
                    >
                      Ingresar
                    </q-btn>
                  </div>
                  <!-- 
                    <q-btn class="btn-text text-capitalize" flat @click.prevent="onRegisterClick">
                      Registrate
                    </q-btn> -->
                </div>
                <div class="q-mt-lg">
                  <div style="text-align: center">
                    <q-btn
                      flat
                      class="text-white"
                      @click="toRestorePassword()"
                      style="font-size: 13px"
                      >¿Has olvidado tu usuario o contraseña?</q-btn
                    >
                  </div>
                </div>
                <div class="q-mt-lg">
                  <div style="text-align: center">
                    <span style="font-size: 15px; color: white">
                      ¿No tienes una cuenta?
                      <a
                        href=""
                        style="color: #1d9bf0; text-decoration: none"
                        @click.prevent="onRegisterClick"
                      >
                        Regístrate
                      </a>
                    </span>
                  </div>
                </div>
              </q-card>
            </div>

            <div class="col-md-7 q-ma-auto">
              <div class="login-image-overlay"></div>
              <q-img
                :src="getLoginMainImage"
                class="login-image"
                spinner-color="cyan-2"
              />
            </div>
            <q-dialog v-model="isHelpDialogOpen" persistent style="z-index: 10">
              <q-card>
                <q-card-section class="row items-center">
                  <q-avatar icon="info" color="yellow-7" text-color="white" />
                  <span class="q-ml-sm text-weight-medium text-h6"
                    >¿Necesitas ayuda o tienes preguntas?
                  </span>
                </q-card-section>
                <q-card-section>
                  <div>
                    Si tienes dudas o necesitas asistencia adicional, no dudes
                    en contactarnos. Puedes escribirnos al siguiente correo
                    detallando tus dudas, problemas o comentarios siendo lo más
                    claro posible:
                    <strong>reclutamiento@turbomaquinas.com</strong>
                  </div>
                  <div>
                    ¡Con gusto resolveremos tus dudas y te atenderemos lo antes
                    posible!
                  </div>
                </q-card-section>
                <q-card-actions align="right">
                  <q-btn flat label="Entendido" color="primary" v-close-popup />
                </q-card-actions>
              </q-card>
            </q-dialog>
          </div>
        </div>
        <HelpBtnComponent
          @click="onClickHelp"
          class="fixed-bottom-right q-ma-lg"
          style="z-index: 1"
        />
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, computed } from "vue";
import { useAuthStore } from "src/stores/auth";
import { setSessionStorageItem } from "src/stores/sessionStorage.js";
import { useLocalStorageStore } from "src/stores/localStorage";
import { useQuasar } from "quasar";
import { useRouter } from "vue-router";
import { storeToRefs } from "pinia";
import {
  getAdminRoute,
  getUserRoute,
  getS3FileUrl,
} from "src/services/profiles.js";
import { notifyPositive, notifyNegative } from "src/utils/notifies.js";
import { getAssetsPath } from "src/utils/folderPaths";
import { useRequestUser } from "src/stores/requestUser";
import { logUser } from "src/services/user";
import { getUserApplicationById } from "src/services/userApplication";
import HelpBtnComponent from "src/components/HelpBtnComponent.vue";
const useAuth = useAuthStore();
const useLocalStorage = useLocalStorageStore();
const useRequest = useRequestUser();
const router = useRouter();
const $q = useQuasar();
const userName = ref("");
const password = ref("");
const isPasswordVisible = ref(false);
const isHelpDialogOpen = ref(false);

const onClickHelp = () => {
  isHelpDialogOpen.value = true;
  console.log("khe");
};

const getLoginMainImage = computed(() =>
  getS3FileUrl(getAssetsPath, "login-main.jpg")
);
const getLogoImage = computed(() =>
  getS3FileUrl(getAssetsPath, "logo-turbomaquinas.png")
);

const { savedApplication } = storeToRefs(useRequest);

const { user, logged, isUser } = storeToRefs(useAuth);

const changePasswordVisibility = () => {
  if (password.value) {
    isPasswordVisible.value = !isPasswordVisible.value;
  }
};

const onRegisterClick = () => {
  router.push("/register");
};

const toRestorePassword = () => {
  router.replace("/restore-password/search-account");
};

const disableLoginButton = () => {
  return !userName.value || !password.value;
};

const onLoginClick = async () => {
  try {
    $q.loading.show();

    const userData = await logUser(userName.value, password.value);

    if (userData) {
      user.value = userData;
      logged.value = 1;
      useLocalStorage.save("user", user.value);
      useLocalStorage.save("logged", logged.value);

      setSessionStorageItem("user", user.value);
      setSessionStorageItem("logged", logged.value);

      if (user.value.role != "u") {
        router.replace(getAdminRoute());
        $q.notify(notifyPositive(`Bienvenido`));
      } else {
        await fetchUserApplication();
      }
    } else {
      console.log(userData);
      $q.notify(notifyNegative("Tienes datos incorrectos!"));
    }
  } catch (error) {
    $q.notify(
      notifyNegative("Hubo un error al iniciar sesion. Intenta de nuevo.")
    );
  } finally {
    $q.loading.hide();
  }
};

const fetchUserApplication = async () => {
  if (!isUser.value) return;

  if (user.value.applicationId === 0) {
    router.replace(getUserRoute());
    savedApplication.value = {};
    useLocalStorage.remove("savedApplication");
    $q.notify(notifyPositive(`Bienvenido`));
    return;
  }

  try {
    const userApplication = await getUserApplicationById(
      user.value.applicationId
    );

    if (userApplication) {
      savedApplication.value = userApplication;
      useLocalStorage.save("savedApplication", savedApplication.value);
      $q.notify(notifyPositive(`Bienvenido`));
    }
  } catch (error) {
  } finally {
    router.replace(getUserRoute());
  }
};

const isLoginPage = ref(true);

const keyDownHandler = (event) => {
  if (event.key === "Enter") {
    if (isLoginPage.value) {
      onLoginClick();
    }
  }
};

onMounted(() => {
  window.addEventListener("keydown", keyDownHandler);
});

onBeforeUnmount(() => {
  window.removeEventListener("keydown", keyDownHandler);
});
</script>

<style scoped>
.btn-brand {
  color: black;
  width: 200px;
  height: 60px;
  font-size: larger;
  background-color: #81d7e4 !important;
}

.btn-brand:hover {
  background-color: #b6f5ff !important;
}

.btn-brand span {
  font-weight: bold;
}

.btn-text {
  color: white;
  font-size: larger;
}

.btn-text:hover {
  text-decoration: underline;
  background-color: transparent;
  box-shadow: none;
}

.no-hover-effect:hover {
  background-color: transparent;
  box-shadow: none;
}

.color-brand {
  color: #99c5cc !important;
}

.input-border {
  border-color: white;
}

.input-brand {
  font-size: 18px;
}

.card-transparent {
  background-color: transparent;
  box-shadow: none;
}

.login-background {
  position: relative;
  background: linear-gradient(
    to right,
    rgba(22, 48, 70, 1) 100%,
    rgba(22, 48, 70, 0.9) 100%,
    rgba(22, 48, 70, 0.8) 100%,
    rgba(22, 48, 70, 0.7) 100%
  );
}

.login-image {
  width: 100%;
  height: 100vh;
  padding-left: 20%;
  opacity: 0.5;
}

.login-image-overlay {
  position: absolute;
  z-index: 1;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    to right,
    rgba(22, 48, 70, 1) 50%,
    rgba(22, 48, 70, 0.8) 70%,
    rgba(22, 48, 70, 0.7) 100%
  );
  opacity: 1;
}

.login-container {
  display: flex;
  height: 100vh;
}

.login-form-section {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #163046;
  padding: 20px;
}

.login-card {
  width: 100%;
  max-width: 400px;
  padding: 40px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 10px;
  backdrop-filter: blur(10px);
}
</style>
