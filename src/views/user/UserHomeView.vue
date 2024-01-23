<template>
  <q-layout view="hHr LpR lFf">
    <q-drawer show-if-above class="menu">
      <div class="q-ml-lg">
        <q-img
          class="logo-turbo"
          :src="getLogoImage"
          style="width: 30%; height: 10%"
        />
      </div>
      <div class="q-ml-lg">
        <p class="turbo">Turbomáquinas</p>
      </div>

      <p class="text-h6 text-white q-ml-xl q-mt-md text-weight-bold">
        Opciones de usuario
      </p>
      <q-item-section class="text-center column q-ml-xl q-mt-xl">
        <div class="q-mr-xl" v-if="isRh">
          <p class="text-subtitle2 text-white text-weight-regular">
            Añadir nota
          </p>
          <q-btn
            @mouseover="hoverHome = true"
            @mouseleave="hoverHome = false"
            class="q-mb-lg drawer-button"
            icon="note_alt"
            :style="{
              color: hoverHome ? '#1CABC1' : 'darkslategrey',
            }"
            @click.prevent="changeNoteStatus"
          />
        </div>

        <div class="row q-ml-md" v-if="!isRh">
          <div>
            <p class="text-subtitle2 q-mr-lg text-white text-weight-regular">
              Inicio
            </p>
            <q-btn
              @mouseover="hoverHome = true"
              @mouseleave="hoverHome = false"
              to="/userHome/perfil"
              class="q-mr-lg drawer-button"
              icon="home"
              :style="{
                color: hoverHome ? '#1CABC1' : 'darkslategrey',
              }"
            >
              <Tooltip :text="'Volver a inicio'" />
            </q-btn>
          </div>
          <div>
            <p
              class="text-subtitle2 text-white text-weight-regular"
              :style="!userHasApplication  ? '' : 'visibility:hidden'"
            >
              Crear
            </p>
            <q-btn
              @mouseover="hoverNewApplication = true"
              @mouseleave="hoverNewApplication = false"
              @click.prevent="onCreateApplication"
              class="q-mb-lg drawer-button"
              icon="description"
              :style="!userHasApplication ? '' : 'visibility:hidden'"
              :disable="userHasApplication || !getUserPhotoUUID"
            >
              <Tooltip
                v-if="!userHasApplication"
                :text="'Crea tu solicitud de trabajo'"
              />
            </q-btn>
          </div>
        </div>
        <div class="row q-ml-md" v-if="!isRh">
          <div>
            <p
              class="text-subtitle2 q-mr-lg text-weight-regular"
              :class="activeApplication ? 'text-white' : 'text-grey'"
            >
              Modificar
            </p>
            <q-btn
              @mouseover="hoverUpdateApplication = true"
              @mouseleave="hoverUpdateApplication = false"
              @click.prevent="onUpdateApplication"
              class="q-mr-lg q-mb-lg drawer-button"
              icon="edit"
              :style="{
                color:
                  hoverUpdateApplication && activeApplication
                    ? '#1CABC1'
                    : 'darkslategrey',
              }"
              :disable="!activeApplication"
              ><Tooltip
                v-if="activeApplication"
                :text="'Modifica tu solicitud de trabajo'"
              />
            </q-btn>
          </div>
          <div>
            <p
              class="text-subtitle2 q-mr-lg text-center text-weight-regular"
              :class="activeApplication ? 'text-white' : 'text-grey'"
            >
              Aplicar
            </p>
            <q-btn
              @mouseover="hoverApplyVacant = true"
              @mouseleave="hoverApplyVacant = false"
              to="/userHome/vacantes"
              class="q-mr-lg q-mb-lg drawer-button"
              icon="add"
              :style="{
                color:
                  hoverApplyVacant && activeApplication
                    ? '#1CABC1'
                    : 'darkslategrey',
              }"
              :disable="!activeApplication"
            >
              <Tooltip
                v-if="activeApplication"
                :text="'Aplica a un puesto de trabajo'"
              />
            </q-btn>
          </div>
        </div>

        <div class="row q-ml-md" v-if="!isRh">
          <div>
            <p
              class="text-subtitle2 q-mr-lg text-center text-weight-regular"
              :class="!userHasApplication ? 'text-grey' : 'text-white'"
            >
              {{ activeApplication ? "Eliminar" : "Activar" }}
            </p>
            <q-btn
              @mouseover="hoverDeleteApplication = true"
              @mouseleave="hoverDeleteApplication = false"
              @click.prevent="onClickDeleteApplication()"
              class="q-mr-lg q-mb-lg drawer-button"
              :icon="activeApplication ? 'delete' : 'autorenew'"
              :style="{
                color:
                  hoverDeleteApplication && activeApplication
                    ? '#C11C1C'
                    : 'darkslategrey',
              }"
              :disable="!userHasApplication"
            >
            <q-tooltip
      v-if="userHasApplication"
      class="bg-dark text-white text-body2"
      anchor="top middle"
      self="center middle"
      transition-show="slide-up"
      transition-hide="fade"
      :delay="300"
      transition-duration="300"
      :offset="[10, 25]"
    >
      {{ toolTipActiveApplicationText }}
    </q-tooltip></q-btn>
          </div>
          <div>
            <p
              class="text-subtitle2 q-mr-lg text-center text-weight-regular"
              :class="activeApplication ? 'text-white' : 'text-grey'"
            >
              Ver
            </p>
            <q-btn
              @mouseover="hoverSeeApplication = true"
              @mouseleave="hoverSeeApplication = false"
              @click.prevent="onViewApplication"
              class="q-mr-lg q-mb-lg drawer-button"
              icon="visibility"
              :style="{
                color:
                  hoverSeeApplication && activeApplication
                    ? '#1CABC1'
                    : 'darkslategrey',
              }"
              :disable="!activeApplication"
            >
              <Tooltip
                v-if="activeApplication"
                :text="'Ve tu solicitud de trabajo'"
              />
            </q-btn>
          </div>
        </div>
      </q-item-section>

      <q-btn
        flat
        dense
        icon="arrow_back"
        class="logout-btn z-top"
        :class="isRh ? 'q-ml-md absolute-bottom q-mb-xl' : 'q-ml-xs'"
        label="Regresar"
        @click.prevent="goToRequisitionApplicants"
        v-if="isRh"
      >
      </q-btn>

      <q-btn
        flat
        dense
        icon="logout"
        class="logout-btn z-top q-mb-sm"
        label="Cerrar Sesión"
        @click.prevent="logout"
        v-if="!isRh"
      >
      </q-btn>
    </q-drawer>
    <q-dialog v-model="openNote">
      <note-component :currentRoute="currentPath" class="note"></note-component>
    </q-dialog>
    <q-dialog v-model="openStatusApplicationDialog" persistent>
      <q-card style="border-radius: 30px">
        <q-card-section class="row items-center">
          <q-avatar
            :icon="activeApplication ? 'warning' : 'info'"
            :color="activeApplication ? 'red' : 'green'"
            text-color="white"
            size="30px"
          />
          <span class="q-ml-sm" style="font-size: large">
            {{
              activeApplication
                ? "Se eliminara tu solicitud ¿Estas seguro?"
                : "Se activara tu solicitud ¿Estas seguro?"
            }}</span
          >
        </q-card-section>

        <q-card-actions align="right">
          <q-btn
            flat
            class="text-white"
            :label="activeApplication ? 'Eliminar' : 'Activar'"
            :class="activeApplication ? 'bg-red' : 'bg-green'"
            v-close-popup
            @click.prevent="onDeleteApplication()"
            style="border-radius: 30px"
            :disable="!userHasApplication"
          />
          <q-btn flat label="Cancelar" color="primary" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
    <router-view class="overflow-hidden-y" :key="componentKeyRouterView" />
  </q-layout>
</template>

<script setup>
import { useRoute } from "vue-router";
import { useRouter } from "vue-router";
import { ref, computed, onMounted, watch } from "vue";
import { useAuthStore } from "src/stores/auth";
import { useRequestUser } from "src/stores/requestUser";
import { storeToRefs } from "pinia";
import { useQuasar } from "quasar";
import { useLocalStorageStore } from "src/stores/localStorage";
import NoteComponent from "src/components/NoteComponent.vue";
import { getAssetsPath } from "src/utils/folderPaths";
import { getS3FileUrl } from "src/services/profiles.js";
import Tooltip from "src/components/Tooltip.vue";
import { notifyNegative, notifyPositive } from "src/utils/notifies";
import { updateUserApplicationState } from "src/services/userApplication";
import { useRequisitionDetailsStore } from "src/stores/requisitionDetails";


const useAuth = useAuthStore();
const useRequest = useRequestUser();
const useRequisitionDetails = useRequisitionDetailsStore();

const openStatusApplicationDialog = ref(false);

const $q = useQuasar();

const router = useRouter();
const route = useRoute();

const componentKeyRouterView = ref(0);
const forceUserHomeRender = ref(0);

const hoverHome = ref(false);
const hoverNewApplication = ref(false);
const hoverApplyVacant = ref(false);
const hoverSeeApplication = ref(false);
const hoverUpdateApplication = ref(false);
const hoverDeleteApplication = ref(false);
const useLocalStorage = useLocalStorageStore();
const { viewAllRequisitions } = storeToRefs(useRequisitionDetails);
const { user, isRh, logged, getUserPhotoUUID } = storeToRefs(useAuth);
const {
  savedApplication,
  viewingApplication,
  updatingApplication,
  userHasApplication,
  curriculumStored,
} = storeToRefs(useRequest);

const openNote = ref(false);

const activeApplication = ref(false);
const userPhotoUUID = ref("");

const toolTipActiveApplicationText = computed(() => {
  return activeApplication.value ? 'Elimina tu solicitud de trabajo' : 'Activa tu solicitud de trabajo'
})


onMounted(() => {
  loadLocalStorage();
});

const loadLocalStorage = () => {
  const userStored = useLocalStorage.load("user");
  const loggedStored = useLocalStorage.load("logged");
  const isViewingApplication = useLocalStorage.load("viewingApplication");
  const isUpdatingApplication = useLocalStorage.load("updatingApplication");

  if (userStored) {
    user.value = userStored;
    userPhotoUUID.value = user.value.photoUUID
    checkUserApplication(false);
  }
  if (loggedStored) logged.value = loggedStored;

  if(isViewingApplication){
    viewingApplication.value = isViewingApplication;
  }
  if(isUpdatingApplication){
    updatingApplication.value = isUpdatingApplication;
  }

};

const goToRequisitionApplicants = () => {
  if(viewAllRequisitions.value){
    router.replace("/home/historial-solicitudes");
    return;
  }
  router.replace("/home/historial-requisiciones-solicitudes");
};

const logout = () => {
  useLocalStorage.remove("user");
  useLocalStorage.remove("logged");
  useLocalStorage.remove("savedApplication");
  user.value = {};
  logged.value = false;
  savedApplication.value = {};
  curriculumStored.value = null;
  router.replace("/login").catch(() => {});
};

watch(
  viewingApplication, // Watch the desired store value
  (newValue) => {
    if (!newValue) {
      componentKeyRouterView.value += 1;
    }
  }
);

watch(
  updatingApplication, // Watch the desired store value
  (newValue) => {
    if (!newValue) {
      componentKeyRouterView.value += 1;
    }
  }
);

watch(userHasApplication, (newValue) => {
  if (newValue) {
    forceUserHomeRender.value += 1;
    checkUserApplication(false);
  }
});

const onDeleteApplication = async () => {
  const userData = {
    activo: activeApplication.value ? 0 : 1,
    solicitud_id: user.value.applicationId,
  };

  try {
    const updatedState = await updateUserApplicationState(userData);

    if (updatedState) {
      const message = activeApplication.value
        ? "Su solicitud ha sido eliminada correctamente"
        : "Su solicitud ha sido activada correctamente";
      $q.notify(notifyPositive(message));

      savedApplication.value.activo = userData.activo;
      useLocalStorage.save("savedApplication", savedApplication.value);
      activeApplication.value = userData.activo === 1 ? true : false;
      router.replace("/userHome/perfil");
    }
  } catch (error) {
    $q.notify(notifyNegative("Hubo un error al eliminar tu solicitud, intenta de nuevo"));
  }
};

const onClickDeleteApplication = () => {
  openStatusApplicationDialog.value = true;
};

const onCreateApplication = () => {
  viewingApplication.value = false;
  updatingApplication.value = false;
  router.push("/userHome/solicitud-1");
};

const onUpdateApplication = () => {
  checkUserApplication();

  updatingApplication.value = true;
  viewingApplication.value = false;
  useLocalStorage.save("updatingApplication", updatingApplication.value);
  useLocalStorage.save("viewingApplication", viewingApplication.value);
};

const onViewApplication = () => {
  checkUserApplication();

  viewingApplication.value = true;
  updatingApplication.value = false;

  useLocalStorage.save("updatingApplication", updatingApplication.value);
  useLocalStorage.save("viewingApplication", viewingApplication.value);
};

const pathMapping = {
  "/userHome/solicitud-1": "Portada",
  "/userHome/solicitud-2": "Datos Personales 1/2",
  "/userHome/solicitud-3": "Datos Personales 2/2",
  "/userHome/solicitud-4": "Documentos",
  "/userHome/solicitud-5": "Medios de reclutamiento",
  "/userHome/solicitud-6": "Referencias",
  "/userHome/solicitud-7": "Datos familiares",
  "/userHome/solicitud-8": "Escolaridad",
  "/userHome/solicitud-9": "Manejo de máquinas, herramientas y software",
  "/userHome/solicitud-10": "Oficios",
  "/userHome/solicitud-11": "Experiencia laboral",
};

const currentPath = computed(() => {
  for (const [path, title] of Object.entries(pathMapping)) {
    if (route.path === path) {
      return title;
    }
  }

  return "";
});

const getLogoImage = computed(() =>
  getS3FileUrl(getAssetsPath, "logo-turbomaquinas.png")
);

const changeNoteStatus = () => {
  openNote.value = !openNote.value;
};

const checkUserApplication = (sendToApplication = true) => {
  if (!userHasApplication.value) return;

  activeApplication.value = savedApplication.value.activo === 1 ? true : false;

  if (sendToApplication) {
    router.push("/userHome/solicitud-1");
  }
};
</script>

<style>
.note {
  position: absolute;
  top: 0;
  background-color: rgba(0, 0, 0, 0.4);
}

.drawer-avatar {
  border: 1px solid;
  color: white;
  padding-right: 100%;
  padding-bottom: 100%;
}

.drawer-button {
  color: #3c3d3f;
  background: rgb(255, 255, 255);
  border-radius: 100%;
  width: 70px;
  height: 70px;
  font-size: 20px;
}

.title {
  background: rgb(255, 255, 255);
  font-size: large;
  color: rgb(40, 55, 68);
  border-radius: 25%;
}

.avatar {
  position: relative;
  margin-left: 20%;
}

.menu {
  background-color: rgba(22, 48, 70);
  position: absolute;
}

.icon-note {
  position: absolute;
  background-color: #1cabc1;
  color: aliceblue;
  top: 95%;
  left: 5%;
}

.logo-turbo {
  margin-top: 5%;
  margin-left: 30%;
}

.turbo {
  color: rgb(255, 255, 255);
  font-size: 150%;
  margin-left: 20%;
}

.logout-btn {
  background-color: white;
  position: absolute;
  left: 25%;
  border-radius: 10px;
}
</style>
