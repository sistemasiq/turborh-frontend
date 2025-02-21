<template>
  <q-layout view="hHh Lpr lff">
    <q-header elevated v-if="$q.screen.width < 1030" class="menu">
      <q-toolbar>
        <q-btn flat @click="drawer = !drawer" round dense icon="menu">
          &nbsp; Menú
        </q-btn>
      </q-toolbar>
    </q-header>
    <q-drawer v-model="drawer" class="menu" :mini="miniState" :width="300" :mini-width="60">
      <q-btn
        v-if="$q.screen.width > 1030"
        class="q-mt-md text-white"
        style="margin-left: 10px"
        flat
        @click="miniState = !miniState"
        round
        dense
        icon="menu"
      />
      <div class="custom-style">
        <template v-if="$q.screen.width < 1030 || !miniState">
          <div class="q-ml-lg">
            <q-img
              class="logo-turbo"
              :src="getLogoImage"
              style="width: 30%; height: 10%"
            />
          </div>
          <div class="q-ml-lg">
            <p class="turbo">Turbomaquinas</p>
          </div>

          <p class="text-h6 text-white q-ml-xl q-mt-md text-weight-bold">
            Opciones de usuario
          </p>
          <q-item-section class="text-center column q-ml-xl q-mt-xl">
            <div class="q-mr-xl" v-if="hideUserApplicationInterface">
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
            <q-btn
              v-if="isRh || isAdmin || isBoss"
              class="q-mr-xl q-mt-lg"
              color="white"
              text-color="dark"
              rounded
              label="Ver curriculum del solicitante"
              @click.prevent="downloadDocument(getCurriculum)"
            />
            <ApplicationModifications v-if="isRh || isBoss || isAdmin" />

            <div class="row q-ml-md" v-if="!hideUserApplicationInterface">
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
                  :style="!userHasApplication ? '' : 'visibility:hidden'"
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
                  :disable="
                    userHasApplication || getUserPhotoUUID === 'default.png'
                  "
                >
                  <Tooltip
                    v-if="!userHasApplication"
                    :text="'Crea tu solicitud de trabajo'"
                  />
                </q-btn>
              </div>
            </div>
            <div class="row q-ml-md" v-if="!hideUserApplicationInterface">
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

            <div class="row q-ml-md" v-if="!hideUserApplicationInterface">
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
                  </q-tooltip></q-btn
                >
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
            :class="
              hideUserApplicationInterface
                ? 'q-ml-md absolute-bottom q-mb-xl q-mr-xl'
                : 'q-ml-xs'
            "
            label="Regresar"
            @click.prevent="goToRequisitionApplicants"
            v-if="hideUserApplicationInterface"
          >
          </q-btn>

          <q-btn
            flat
            dense
            icon="logout"
            class="logout-btn z-top q-mb-sm"
            label="Cerrar Sesión"
            @click.prevent="redirectToLogin"
            v-if="!hideUserApplicationInterface"
          >
          </q-btn>
        </template>
        <!-- Contenido para modo mini -->
        <template v-else>
          <q-list dense class="mini-list">
            <!-- Inicio -->
            <q-item v-if="!hideUserApplicationInterface" clickable>
              <q-btn flat dense to="/userHome/perfil" icon="home" class="mini-btn">
                <q-tooltip>Inicio</q-tooltip>
              </q-btn>
            </q-item>

            <!-- Crear solicitud -->
            <q-item v-if="!hideUserApplicationInterface && !userHasApplication" clickable>
              <q-btn
                flat
                dense
                @click="onCreateApplication"
                icon="description"
                class="mini-btn"
                :disable="userHasApplication || getUserPhotoUUID === 'default.png'"
              >
                <q-tooltip>Crear solicitud</q-tooltip>
              </q-btn>
            </q-item>

            <!-- Modificar -->
            <q-item v-if="!hideUserApplicationInterface && activeApplication" clickable>
              <q-btn
                flat
                dense
                @click="onUpdateApplication"
                icon="edit"
                class="mini-btn"
                :disable="!activeApplication"
              >
                <q-tooltip>Modificar solicitud</q-tooltip>
              </q-btn>
            </q-item>

            <!-- Aplicar a vacante -->
            <q-item v-if="!hideUserApplicationInterface && activeApplication" clickable>
              <q-btn
                flat
                dense
                to="/userHome/vacantes"
                icon="add"
                class="mini-btn"
                :disable="!activeApplication"
              >
                <q-tooltip>Aplicar a vacante</q-tooltip>
              </q-btn>
            </q-item>

            <!-- Eliminar/Activar solicitud -->
            <q-item v-if="!hideUserApplicationInterface && userHasApplication" clickable>
              <q-btn
                flat
                dense
                @click="onClickDeleteApplication"
                :icon="activeApplication ? 'delete' : 'autorenew'"
                class="mini-btn"
                :disable="!userHasApplication"
                :style="{
                  color: hoverDeleteApplication && activeApplication ? '#C11C1C' : 'white'
                }"
                @mouseover="hoverDeleteApplication = true"
                @mouseleave="hoverDeleteApplication = false"
              >
                <q-tooltip>{{ activeApplication ? 'Eliminar solicitud' : 'Activar solicitud' }}</q-tooltip>
              </q-btn>
            </q-item>

            <!-- Ver solicitud -->
            <q-item v-if="!hideUserApplicationInterface && activeApplication" clickable>
              <q-btn
                flat
                dense
                @click="onViewApplication"
                icon="visibility"
                class="mini-btn"
                :disable="!activeApplication"
              >
                <q-tooltip>Ver solicitud</q-tooltip>
              </q-btn>
            </q-item>

            <!-- Ver curriculum (para admin/RH/boss) -->
            <q-item v-if="isRh || isAdmin || isBoss" clickable>
              <q-btn
                flat
                dense
                @click="downloadDocument(getCurriculum)"
                icon="description"
                class="mini-btn"
              >
                <q-tooltip>Ver curriculum</q-tooltip>
              </q-btn>
            </q-item>

            <!-- Añadir nota -->
            <q-item v-if="hideUserApplicationInterface" clickable>
              <q-btn
                flat
                dense
                @click="changeNoteStatus"
                icon="note_alt"
                class="mini-btn"
              >
                <q-tooltip>Añadir nota</q-tooltip>
              </q-btn>
            </q-item>

            <!-- Botón de regresar -->
            <q-item v-if="hideUserApplicationInterface" clickable>
              <q-btn
                flat
                dense
                @click="goToRequisitionApplicants"
                icon="arrow_back"
                class="mini-btn"
              >
                <q-tooltip>Regresar</q-tooltip>
              </q-btn>
            </q-item>

            <!-- Cerrar Sesión -->
            <q-item v-if="!hideUserApplicationInterface" clickable>
              <q-btn
                flat
                dense
                @click="redirectToLogin"
                icon="logout"
                class="mini-btn"
              >
                <q-tooltip>Cerrar Sesión</q-tooltip>
              </q-btn>
            </q-item>
          </q-list>
        </template>
      </div>
    </q-drawer>

    <q-dialog v-model="openNote">
      <note-component :currentRoute="currentPath" class="note"></note-component>
    </q-dialog>
    <q-dialog class="z-max" v-model="openStatusApplicationDialog" persistent>
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

    <q-dialog maximized v-model="showResume">
      <q-card class="no-scroll">
        <q-card-actions class="bg-white" align="right">
          <q-btn flat label="Cerrar" color="red" v-close-popup />
        </q-card-actions>
        <object
          height="100%"
          width="100%"
          v-if="resumeSrc.length > 0"
          :data="resumeSrc"
          type="application/pdf"
        >
          <iframe :src="resumeViewLink"></iframe>
        </object>
      </q-card>
    </q-dialog>
    <q-page-container>
      <router-view class="overflow-hidden-y" :key="componentKeyRouterView" />
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { useRoute } from "vue-router";
import { useRouter } from "vue-router";
import { ref, computed, onBeforeMount, watch, onBeforeUnmount } from "vue";
import {
  getSessionStorageItem,
  removeSessionStorageItem,
} from "src/stores/sessionStorage.js";
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
import { disableCandidateAllRequisitions } from "src/services/candidates";
import { logOut, setHeaderAuthorization } from "src/services/user";
import {
  axiosErrorResponseStatus,
  initInterceptors,
} from "src/services/setupInterceptors";
import ApplicationModifications from "src/components/ApplicationModifications.vue";
import { downloadFile } from "src/services/files";
import { getUserDocumentsPath } from "src/utils/folderPaths";

const useAuth = useAuthStore();
const useRequest = useRequestUser();
const useRequisitionDetails = useRequisitionDetailsStore();

const openStatusApplicationDialog = ref(false);
const drawer = ref(true);
const miniState = ref(false);

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
const { viewAllRequisitions, viewAllSelectedCandidates } = storeToRefs(
  useRequisitionDetails
);
const { user, isRh, logged, getUserPhotoUUID, isUser, isBoss, isAdmin } =
  storeToRefs(useAuth);
const {
  savedApplication,
  viewingApplication,
  updatingApplication,
  userHasApplication,
} = storeToRefs(useRequest);

const openNote = ref(false);

const activeApplication = ref(false);
const userPhotoUUID = ref("");
const settedHeaderAuthorization = ref(false);

const resumeSrc = ref("");
const resumeViewLink = ref(resumeSrc.value);
const showResume = ref(false);

const toolTipActiveApplicationText = computed(() => {
  return activeApplication.value
    ? "Elimina tu solicitud de trabajo"
    : "Activa tu solicitud de trabajo";
});

const hideUserApplicationInterface = computed(() => {
  return isRh.value || isAdmin.value || isBoss.value;
});

onBeforeMount(() => {
  if (
    getSessionStorageItem("viewAllRequisitions") &&
    getSessionStorageItem("viewAllSelectedCandidates")
  ) {
    viewAllRequisitions.value =
      getSessionStorageItem("viewAllRequisitions") === "true";
    viewAllSelectedCandidates.value =
      getSessionStorageItem("viewAllSelectedCandidates") === "true";
  }
  loadUserData();
});

onBeforeUnmount(() => {
  removeUserApplicationOnAdminUser();
});

const removeUserApplicationOnAdminUser = () => {
  if (!isRh.value && !isAdmin.value && !isBoss.value) return;

  savedApplication.value = {};
  useRequest.clearMachinery();
  useLocalStorage.remove("savedApplication");
  useLocalStorage.remove("addingNotesApplicationId");
};

const loadUserData = () => {
  //Retrieve and assign the user session values from the session storage
  const userStored = JSON.parse(getSessionStorageItem("user"));
  const loggedStored = Number(getSessionStorageItem("logged"));

  //if the user session information is correct, then it assigns the user session information to the store and needed data to the local variables
  if (userStored && loggedStored) {
    user.value = userStored;
    logged.value = loggedStored;
  } else {
    //If the user session information is incorrect, then it shows a dialog with the error message and sends the user to the login
    $q.dialog({
      title: "Oops! Hubo un problema con tu sesión",
      message: "Por favor, vuelve a iniciar sesión",
      persistent: true,
      ok: {
        push: true,
        color: "positive",
        label: "Iniciar Sesión",
      },
    }).onOk(() => {
      router.replace("/");
    });
  }

  if (isUser.value) {
    loadLocalStorage();
    initInterceptors(router);
    router.replace("/userHome/perfil");
  } else {
    loadApplicationLocalStorage();
  }
};

const loadApplicationLocalStorage = () => {
  const isViewingApplication = useLocalStorage.load("viewingApplication");
  const userApplicationStored = useLocalStorage.load("savedApplication");
  setHeaderAuthorization(user.value.token);
  settedHeaderAuthorization.value = true;

  if (isViewingApplication) {
    viewingApplication.value = isViewingApplication;
  }
  if (userApplicationStored) {
    savedApplication.value = userApplicationStored;
  }
};

const loadLocalStorage = () => {
  const isViewingApplication = useLocalStorage.load("viewingApplication");
  const isUpdatingApplication = useLocalStorage.load("updatingApplication");
  const userApplicationStored = useLocalStorage.load("savedApplication");

  userPhotoUUID.value = user.value.photoUUID;
  setHeaderAuthorization(user.value.token);
  settedHeaderAuthorization.value = true;
  checkUserApplication(false);

  if (isViewingApplication) {
    viewingApplication.value = isViewingApplication;
  }
  if (isUpdatingApplication) {
    updatingApplication.value = isUpdatingApplication;
  }
  if (userApplicationStored) {
    savedApplication.value = userApplicationStored;
  }
};

const getCurriculum = computed(() => {
  if (!savedApplication.value) return "";

  return savedApplication.value.nombre_cv
    ? savedApplication.value.nombre_cv
    : "";
});

const downloadDocument = async (uuid) => {
  try {
    $q.loading.show();
    const fileDownloaded = await downloadFile(uuid, getUserDocumentsPath);
    if (fileDownloaded) {
      resumeSrc.value = fileDownloaded;
      showResume.value = true;
    } else {
      $q.notify(notifyNegative("El archivo solicitado no existe "));
    }
  } catch (error) {
    $q.notify(notifyNegative("Hubo un error al obtener el archivo "));
  } finally {
    $q.loading.hide();
  }
};

const goToRequisitionApplicants = () => {
  if (viewAllRequisitions.value) {
    router.replace("/home/historial-solicitudes");
    return;
  }
  if (viewAllSelectedCandidates.value) {
    router.replace("/home/candidatos-seleccionados");
    return;
  }
  router.replace("/home/historial-requisiciones-solicitudes");
};

const redirectToLogin = () => {
  logOut();
  router.replace("/login").catch(() => {});
};

watch(
  settedHeaderAuthorization, // Watch the desired store value
  (newValue) => {
    if (newValue) {
      componentKeyRouterView.value += 1;
    }
  }
);

watch(
  viewingApplication, // Watch the desired store value
  (newValue) => {
    if (!newValue) {
      componentKeyRouterView.value += 1;
    }
  }
);

watch(
  activeApplication, // Watch the desired store value
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

watch(axiosErrorResponseStatus, (newValue) => {
  console.log(newValue);
  if (newValue === 401 || newValue === 403) {
    console.log("Unauthorized");
    logOut();
  }
});

const onDeleteApplication = async () => {
  const userData = {
    activo: activeApplication.value ? 0 : 1,
    solicitud_id: user.value.applicationId,
  };

  try {
    const updatedState = await updateUserApplicationState(userData);

    if (!updatedState) return;

    const message = activeApplication.value
      ? "Su solicitud ha sido eliminada correctamente"
      : "Su solicitud ha sido activada correctamente";

    $q.notify(notifyPositive(message));

    if (activeApplication.value) {
      const disabledFromApplications = await disableCandidateAllRequisitions(
        user.value.id
      );

      if (disabledFromApplications) {
        $q.notify(
          notifyPositive(
            "Se han eliminado todas tus aplicaciones a los puestos."
          )
        );
      }
    }

    savedApplication.value.activo = userData.activo;
    useLocalStorage.save("savedApplication", savedApplication.value);
    activeApplication.value = userData.activo === 1 ? true : false;
    router.replace("/userHome/perfil");
  } catch (error) {
    $q.notify(
      notifyNegative("Hubo un error al eliminar tu solicitud, intenta de nuevo")
    );
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
  "/userHome/solicitud-1": "Presentacion Personal y Salario Deseado",
  "/userHome/solicitud-2": "Datos Personales y Aspiraciones",
  "/userHome/solicitud-3": "Informacion Medica y Situacion Socioeconomica",
  "/userHome/solicitud-4": "Documentos",
  "/userHome/solicitud-5": "Medios de reclutamiento",
  "/userHome/solicitud-6": "Datos familiares",
  "/userHome/solicitud-7": "Información Escolar",
  "/userHome/solicitud-8": "Maquinaria y herramientas",
  "/userHome/solicitud-9": "Oficios",
  "/userHome/solicitud-10": "Experiencia laboral",
  "/userHome/solicitud-11": "Referencias familiares y comerciales",
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

//Check if the application is active and if it´s created so the option to create does not appear in the nav bar
const checkUserApplication = (sendToApplication = true) => {
  if (!userHasApplication.value) return;

  activeApplication.value = savedApplication.value.activo === 1 ? true : false;
  userHasApplication.value =
    savedApplication.value.solicitud_id !== 0 ? true : false;

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

@media (min-width: 1031px) {
  .custom-style {
    margin-top: -20%;
  }
}

.mini-list {
  padding: 8px 0;
}

.mini-btn {
  width: 40px;
  height: 40px;
  color: white;
  margin: 4px 0;
}

.mini-btn:hover {
  color: #1CABC1;
}
</style>
