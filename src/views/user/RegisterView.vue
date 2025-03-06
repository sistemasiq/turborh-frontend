<template>
  <q-layout class="layout_background" view="hHr LpR lFf">
    <q-toolbar> </q-toolbar>
    <q-drawer side="left" show-if-above bordered style="background: rgba(30, 61, 88)" class="menu" :breakpoint="800"
      content-class="bg-grey-1">
      <div class="q-mt-sm">
        <q-img :src="getS3FileUrl(getAssetsPath, 'logo-turbomaquinas.png')"
          style="width: 30%; height: 10%; margin-left: 30%" />
        <p class="turbo q-ml-xl">Turbomáquinas</p>
      </div>

      <q-list>
        <div style="position: absolute; top: 20%; left: 5%">
          <q-item v-ripple class="drawer-item">
            <q-item-section avatar class="text-center">
              <q-avatar class="text-center drawer-avatar" style="color: #f6f7f8d0">1</q-avatar>
            </q-item-section>

            <q-item-section style="font-size: x-large; color: #f6f7f8d0">
              Registro</q-item-section>
          </q-item>
        </div>
      </q-list>
    </q-drawer>

    <q-card class="layout-background">
      <q-card-section class="tittle"> Registro de usuario </q-card-section>
      <q-card-section class="card-register">
        <q-form class="q-gutter-md">
          <q-input outlined color="black" v-model="userName" type="text" label="Nombre de usuario"
            @blur="checkIfUserNameAlreadyExists" label-color="black" lazy-rules :rules="[
              (value) => value.length >= 6 || 'El nombre debe ser minimo de 6 letras',
              (value) => /^[a-zA-Z0-9._]+$/.test(value) || 'Solo se permiten letras, números, punto (.) y guion bajo (_), no se permiten espacios',
              (value) => !/\s/.test(value) || 'No se permiten espacios'
            ]">
          </q-input>
          <q-input outlined color="black" v-model="email" @blur="checkIfEmailAlreadyExists" type="text"
            label="Correo electrónico" label-color="black" lazy-rules :rules="[
              (value) => !!value || 'El correo electrónico es requerido',
              (value) =>
                /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(
                  value
                ) || 'El correo electrónico debe ser válido',
            ]">
          </q-input>
          <q-input outlined color="black" v-model="curp" @blur="checkIfCurpAlreadyExists"
            mask="AAAA######AAAAAAX#" label="CURP" label-color="black" lazy-rules :rules="[
              (value) => !!value || 'La clave CURP es requerida',
              (value) =>
                /^[A-Z]{4}[0-9]{6}(H|M)[A-Z]{5}[A-Z0-9][0-9]$/.test(value) ||
                'La clave CURP debe ser válida',
            ]">
          </q-input>

          <q-input outlined color="black" v-model="password" :type="isPasswordVisible ? 'text' : 'password'"
            label="Contraseña" label-color="black" lazy-rules :rules="[
              (value) =>
                (value && value.length > 0) ||
                'Este campo no puede estar vacío.',
            ]">
            <template v-slot:prepend>
              <q-icon name="lock" />
            </template>
            <template v-slot:append>
              <q-btn class="card-transparent color-brand" flat no-border v-if="!isPasswordVisible && password"
                icon="visibility_off" @click.prevent="changePasswordVisibility" />
              <q-btn class="card-transparent color-brand" flat no-border v-if="isPasswordVisible && password"
                icon="visibility" @click.prevent="changePasswordVisibility" />
            </template>
          </q-input>

          <q-input outlined color="black" v-model="confirmPassword" @blur="passwordMatching"
            :type="isConfirmPasswordVisible ? 'text' : 'password'" label="Confirmar Contraseña" label-color="black"
            lazy-rules :rules="[
              (value) =>
                (value && value.length > 0) ||
                'Este campo no puede estar vacío.',
            ]">
            <template v-slot:prepend>
              <q-icon name="lock" class="color-brand" />
            </template>
            <template v-slot:append>
              <q-btn class="card-transparent color-brand" flat no-border
                v-if="!isConfirmPasswordVisible && confirmPassword" icon="visibility_off"
                @click.prevent="changeConfirmPasswordVisibility" />
              <q-btn class="card-transparent color-brand" flat no-border
                v-if="isConfirmPasswordVisible && confirmPassword" icon="visibility"
                @click="changeConfirmPasswordVisibility" />
            </template>
          </q-input>

          <div class="column" style="padding-left: 5px">
            <q-btn class="btn-register" rounded text-color="black" color="white" label="Registrarse"
              @click.prevent="registerUser" :disable="disableRegisterButton()" />
          </div>
        </q-form>
      </q-card-section>
    </q-card>
  </q-layout>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from "vue";
import { useQuasar } from "quasar";
import { useRouter } from "vue-router";
import { useAuthStore } from "src/stores/auth";
import { getS3FileUrl } from "src/services/profiles.js";
import { getAssetsPath } from "src/utils/folderPaths";
import { storeToRefs } from "pinia";
import {
  getUserByUserName,
  getUserByCurp,
  getUserByEmail,
  createUser,
} from "src/services/user";
import { useLocalStorageStore } from "src/stores/localStorage";
import { notifyNegative, notifyPositive } from "src/utils/notifies";
import { setSessionStorageItem } from "src/stores/sessionStorage";

const useLocalStorage = useLocalStorageStore();
const $q = useQuasar();
const router = useRouter();
const useAuth = useAuthStore();

const userName = ref("");
const email = ref("");
const curp = ref("");
const password = ref("");
const confirmPassword = ref("");

const isPasswordVisible = ref(false);
const isConfirmPasswordVisible = ref(false);

const curpRegex = new RegExp("^[A-Z]{4}[0-9]{6}(H|M)[A-Z]{5}[A-Z0-9][0-9]$");
let curpExistsValidation = ref(false);
const userNameExistsValidation = ref(false);
const userEmailExistValidation = ref(false);

const { logged, user } = storeToRefs(useAuth);

const disableRegisterButton = () => {
  // Si algún campo está vacío, deshabilitar
  if (!userName.value || !email.value || !curp.value || !password.value || !confirmPassword.value) {
    return true;
  }

  // Valida formato de email
  const emailValid = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email.value);
  if (!emailValid) return true;

  // Valida nombre de usuario (mínimo 6 caracteres y solo letras, números, punto y guion bajo)
  const userNameValid = userName.value.length >= 6 && /^[a-zA-Z0-9._]+$/.test(userName.value);
  if (!userNameValid) return true;

  // Valida CURP
  if (!curpRegex.test(curp.value)) return true;

  // Valida que las contraseñas coincidan
  if (password.value !== confirmPassword.value) return true;

  // Valida que no existan duplicados en la base de datos
  if (!userNameExistsValidation.value || !curpExistsValidation.value || !userEmailExistValidation.value) {
    return true;
  }

  // Si pasa todas las validaciones, habilitar el botón
  return false;
};

/* const disableRegisterButton = () => {
  return (
    !userName.value ||
    !email.value ||
    !curp.value ||
    !password.value ||
    !confirmPassword.value ||
    password.value != confirmPassword.value ||
    !curpExistsValidation.value ||
    !userNameExistsValidation.value ||
    !userEmailExistValidation.value
  );
}; */

const changePasswordVisibility = () => {
  if (password.value) {
    isPasswordVisible.value = !isPasswordVisible.value;
  }
};

const changeConfirmPasswordVisibility = () => {
  if (confirmPassword.value) {
    isConfirmPasswordVisible.value = !isConfirmPasswordVisible.value;
  }
};

const checkIfUserNameAlreadyExists = async () => {
  if (userName.value.length < 6) {
    userNameExistsValidation.value = false;
    return;
  }

  const userExists = await getUserByUserName(userName.value);

  userNameExistsValidation.value = userExists ? false : true;
  if (userExists) {
    $q.notify(notifyNegative("Este nombre de usuario ya esta registrado"));
  }
};

const checkIfCurpAlreadyExists = async () => {
  const curpFormattedCorrectly =
    curp.value.length === 18 && curpRegex.test(curp.value);

  if (!curpFormattedCorrectly) {
    curpExistsValidation.value = false;
    return;
  }
  const curpExists = await getUserByCurp(curp.value);

  curpExistsValidation.value = curpExists ? false : true;

  if (curpExists) {
    $q.notify(notifyNegative("La clave CURP ya está registrada"));
  }
};

const checkIfEmailAlreadyExists = async () => {
  if (!email.value) {
    return;
  }
  const emailExists = await getUserByEmail(email.value);

  userEmailExistValidation.value = emailExists ? false : true;

  if (emailExists) {
    $q.notify(notifyNegative("Este correo electrónico ya está registrado"));
  }
};

/* PASSWORD MATCHING ---------------------------------------------------------------------------------------------------*/
const passwordMatching = () => {
  if (password.value != confirmPassword.value) {
    $q.notify(notifyNegative("Las contraseñas no coinciden"));
  }
};

const registerUser = async () => {
  $q.loading.show();

  try {
    await checkIfCurpAlreadyExists();
    await checkIfUserNameAlreadyExists();
    await checkIfEmailAlreadyExists();

    if (
      userNameExistsValidation.value &&
      curpExistsValidation.value &&
      userEmailExistValidation.value
    ) {
      await addUser();

      /* showCredentialsDialog.value = true;

      $q.notify({
        type: 'positive',
        message: 'Usuario registrado con éxito'
      }); */
    }
  } catch (error) {
    console.error('Error en registro:', error);
    $q.notify({
      type: 'negative',
      message: 'Error al registrar usuario'
    });
  } finally {
    $q.loading.hide();
  }
};

const addUser = async () => {
  try {
    const trimmedUserName = userName.value.trim();
    const trimmedEmail = email.value.trim();
    const trimmedCurp = curp.value.trim();
    const trimmedPassword = password.value.trim();

    const newUserData = await createUser(
      trimmedUserName,
      trimmedEmail,
      trimmedCurp,
      trimmedPassword
    );

    if (newUserData) {
      // Usar correctamente el $q.dialog
      await $q.dialog({
        card: true,
        html: true,
        style: {
          width: '400px',
          maxWidth: '90vw'
        },
        message: `
          <div class="q-pa-md">
            <div class="text-center text-h6 text-weight-bold q-mb-md">¡Registro exitoso!</div>

            <div class="text-center q-mb-md">
              <i class="material-icons text-positive" style="font-size: 4em;">check_circle</i>
            </div>
            
            <div class="text-center text-body1 q-mb-md">
              Tu cuenta ha sido creada con éxito.
            </div>

            <div class="q-pa-md bg-blue-1" style="border-radius: 8px; border: 1px solid #1976d2">
              <div class="text-subtitle1 text-weight-bold text-primary q-mb-sm">
                Tus credenciales de acceso:
              </div>
              
              <div class="q-px-sm">
                <div class="row items-center q-mb-sm">
                  <i class="material-icons text-primary q-mr-sm" style="font-size: 1.2em;">person</i>
                  <span class="text-subtitle2">Usuario:</span>
                  <span class="text-weight-bold q-ml-sm">${trimmedUserName}</span>
                </div>
                
                <div class="row items-center">
                  <i class="material-icons text-primary q-mr-sm" style="font-size: 1.2em;">key</i>
                  <span class="text-subtitle2">Contraseña:</span>
                  <span class="text-weight-bold q-ml-sm">${trimmedPassword}</span>
                </div>
              </div>
            </div>

            <div class="text-caption text-weight-medium text-center q-mt-md text-negative">
              <i class="material-icons q-mr-xs" style="font-size: 1.2em;">warning</i>
              Es muy importante que guardes estas credenciales en un lugar seguro.
              Las necesitarás para acceder a tu cuenta.
            </div>
          </div>
        `,
        persistent: true,
        ok: {
          label: 'Entendido',
          color: 'primary',
          flat: true,
          class: 'q-px-md q-py-sm text-weight-bold'
        }
      }).onOk(() => {
        logged.value = 1;
        user.value = newUserData;
        localStorage.clear();
        useLocalStorage.save("logged", logged.value);
        useLocalStorage.save("user", user.value);
        setSessionStorageItem("logged", logged.value);
        setSessionStorageItem("user", user.value);

        $q.notify(notifyPositive("Bienvenido al portal de reclutamiento de Turbomáquinas"));
        router.replace("/userHome/perfil");
      });
    } else {
      $q.notify(
        notifyNegative("Hubo un error en el registro. Intenta de nuevo")
      );
      console.log("newUserData es null");
      console.log(user.value);
    }
  } catch (error) {
    console.log(user.value);
    $q.notify(notifyNegative("Hubo un error en el registro. Intenta de nuevo"));
  } finally {
    $q.loading.hide();
  }
};
</script>

<style scoped>
.drawer-avatar {
  background-color: transparent;
  border: 1px solid;
  color: white;
  padding-right: 100%;
  padding-bottom: 100%;
}

.layout_background {
  background: rgba(30, 61, 88);
}

.avatar {
  position: relative;
}

.menu {
  background: rgba(22, 48, 70);
  border-top-right-radius: 2%;
  border-bottom-right-radius: 2%;
}

.menu-register {
  color: rgb(95, 158, 160);
  font-size: 200%;
  margin-top: 15%;
  margin-left: 20%;
}

.turbo {
  color: rgb(255, 255, 255);
  font-size: x-large;
}

.tittle {
  background: rgba(31, 40, 54, 0.507);
  color: rgb(236, 239, 241);
  font-size: 120%;
  margin-bottom: 25px;
}

.register-p {
  position: relative;
  background: rgb(255, 255, 255);
}

.q-card {
  border-radius: 10px;
  vertical-align: top;
  background: rgba(246, 247, 248, 0.692) 51%;
  position: relative;
  height: 75%;
  width: 75%;
  margin-left: 23.5%;
  margin-top: 2%;
}

.card-register {
  display: relative;
  justify-content: center;
  align-items: center;
}

.btn-register {
  text-align: center;
  margin-top: 0%;
  width: 20%;
  margin-left: 39%;
}

#avatar-registro {
  position: relative;
  top: 0%;
  bottom: 1%;
}
</style>
