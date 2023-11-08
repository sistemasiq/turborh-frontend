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
                  style="width: 30%; height: 10%"
                />
              </div>
              <div class="column q-ma-auto">
                <div
                  class="row q-ma-auto"
                  style="justify-content: center; align-items: center"
                >
                  <h5 class="text-h5 text-white q-my-md">Iniciar Sesión</h5>
                </div>
                <q-card class="q-pa-lg card-transparent">
                  <q-card-section>
                    <q-form class="q-gutter-md">
                      <q-input
                        dark
                        outlined
                        color="cyan-1"
                        v-model="userName"
                        type="text"
                        label="Nombre de usuario"
                        label-color="white"
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
                            value === password || 'La contraseña es incorrecta'
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
                  <q-card-actions
                    class="row q-ma-auto"
                    style="
                      justify-content: center;
                      align-items: center;
                      padding-top: 5%;
                    "
                  >
                    <div class="column">
                      <q-btn
                        unelevated
                        rounded
                        class="btn-brand text-capitalize"
                        @click.prevent="onLoginClick"
                        :disabled="disableLoginButton()"
                      >
                        Ingresar
                      </q-btn>
                    </div>
                    <div class="column" style="padding-left: 3%">
                      <q-btn
                        class="btn-text text-capitalize"
                        flat
                        @click.prevent="onRegisterClick"
                      >
                        Registrate
                      </q-btn>
                    </div>
                  </q-card-actions>
                </q-card>
              </div>
            </div>
            <div class="col-md-7 q-ma-auto">
              <div class="login-image-overlay"></div>
              <q-img
                :src="getLoginMainImage"
                class="login-image"
              />
            </div>
          </div>
        </div>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, computed } from "vue";
import { useAuthStore } from "src/stores/auth";
import { useLocalStorageStore } from "src/stores/localStorage";
import { useQuasar } from "quasar";
import { useRouter } from "vue-router";
import { storeToRefs } from "pinia";
import axios from "axios";
import { getAdminRoute, getUserRoute } from "src/services/profiles.js";
import { notifyPositive, notifyNegative } from "src/utils/notifies.js";
import { getS3FileUrl } from "src/services/profiles.js";
import { getAssetsPath } from "src/utils/folderPaths";
import { useRequestUser } from "src/stores/requestUser";


const useAuth = useAuthStore();
const useLocalStorage = useLocalStorageStore();
const useRequest = useRequestUser();
const router = useRouter();
const $q = useQuasar();
const userName = ref("");
const password = ref("");
const isPasswordVisible = ref(false);

const getLoginMainImage = computed(() => getS3FileUrl(getAssetsPath, "login-main.jpg"))
const getLogoImage = computed(() => getS3FileUrl(getAssetsPath, "logo-turbomaquinas.png"))

const { savedApplication } = storeToRefs(useRequest);
const { user, logged } = storeToRefs(useAuth);



const changePasswordVisibility = () => {
  if (password.value) {
    isPasswordVisible.value = !isPasswordVisible.value;
  }
};

const onRegisterClick = () => {
  router.push("/register");
};

const disableLoginButton = () => {
  return !userName.value || !password.value;
};

const onLoginClick = async () => {


  try {
    $q.loading.show();

    const request = await axios.get(
      `/auth/${userName.value}/pass/${password.value}`
    );

    if (request.status === 200) {

      user.value = request.data;
      logged.value = 1;

      useLocalStorage.save("user", user.value);
      useLocalStorage.save("logged", logged.value);


      if(user.value.role != "u"){
        router.replace(getAdminRoute());
        $q.notify(
        notifyPositive(`Bienvenido`));
      }else{
        await fetchUserApplication();
      }


    } else {
      $q.notify(notifyNegative("Tienes datos incorrectos!"));
    }
  } catch (error) {
    $q.notify(notifyNegative("Hubo un error al iniciar sesion. Intenta de nuevo."));
  } finally {
    $q.loading.hide();
  }
};

const fetchUserApplication = async() => {

  if(user.value.role !== "u")
  return;

  try {
    const request = await axios.get(`/solicitud/${user.value.applicationId}`);

    if (request.status === 200) {
      savedApplication.value = request.data;
      useLocalStorage.save("savedApplication", savedApplication.value);
      $q.notify(
        notifyPositive(`Bienvenido`));
    }
  } catch (error) {

  }finally{
    router.replace(getUserRoute())
  }
}

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
  width: 250px;
  height: 60px;
  font-size: larger;
  background-color: #99c5cc !important;
}

.btn-brand:hover {
  background-color: #d4f9ff !important;
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
</style>
