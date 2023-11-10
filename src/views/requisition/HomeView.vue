<template>
  <q-layout view="hHr LpR lFf" style="background-color: #1e3d58">
    <q-header elevated class="bg-light-blue-13 shadow-8">
      <q-toolbar class="q-toolbar items-center">
        <q-btn flat @click.prevent="drawer = !drawer" round dense icon="menu" />
        <q-img
          :src="getLogoImage"
          style="width: 45px; height: 45px; margin-left: 45%"
          class=""
        />
        <q-toolbar-title>Turbomaquinas</q-toolbar-title>
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="drawer"
      side="left"
      show-if-above
      bordered
      class="drawer-container"
    >
      <q-list dense bordered padding class="rounded-borders">
        <q-item-section class="profile-section">
          <div class="flex">
            <q-file
              use-chips
              style="width: 100%"
              accept="image/*"
              standout
              v-model="selectedImage"
            >
              <template v-slot:prepend>
                <div class="q-avatar">
                  <q-img
                    :src="getUserImage"
                    style="width: 40px; height: 40px; border-radius: 160px"
                    class="q-mb-xl"
                  >
                  </q-img>
                </div>
                <div class="userData-name q-ml-md q-mt-sm">{{ userName }}</div>
              </template>
              <q-tooltip>Cambiar foto</q-tooltip>
            </q-file>

            <div style="width: 100%">
              <q-btn
                v-if="selectedImage"
                @click.prevent="uploadImage"
                label="Subir"
                icon="upload"
                class="q-mt-sm flex flex-center"
                rounded
                style="margin-left: 30%"
              ></q-btn>
            </div>
          </div>
        </q-item-section>

        <q-expansion-item
          icon="description"
          label="Requisiciones"
          header-class="bg-blue-1"
        >
          <q-item
            v-if="hasPermitRequisitionCreation"
            clickable
            @click.prevent="onNewRequisitionClicked"
            :inset-level="1"
          >
            <q-item-section avatar>
              <q-icon name="add" />
            </q-item-section>
            <q-item-section>
              <q-item-label>Nueva Requisición</q-item-label>
              <q-item-label caption>Requisición para puesto</q-item-label>
            </q-item-section>
          </q-item>

          <q-item clickable to="/home/historial-requisiciones" :inset-level="1">
            <q-item-section avatar>
              <q-icon name="search" />
            </q-item-section>
            <q-item-section>
              <q-item-label>Ver Requisiciones</q-item-label>
              <q-item-label caption>Historial de requisiciones</q-item-label>
            </q-item-section>
          </q-item>
        </q-expansion-item>
        <!-- TODO: Remover cuando se verifique que no se ocupa -->
        <!-- <q-expansion-item
        v-if="isRh"
          icon="description"
          label="Solicitudes de usuarios"
          header-class="bg-blue-1"
        >
          <div class="content" ref="contentRef">
            <q-item clickable to="/home" :inset-level="1" class="custom-item">
              <q-item-section avatar class="items-seleccion-elements">
                <q-icon name="fas fa-user" class="icon-user" />
              </q-item-section>
              <q-item-section>
                <q-item-label>Selección de candidato</q-item-label>
                <q-item-label caption>Selecciona un candidato</q-item-label>
              </q-item-section>
            </q-item>
          </div>
        </q-expansion-item> -->

        <q-expansion-item
          v-if="isRh"
          icon="description"
          label="Catálogos"
          header-class="bg-blue-1"
        >
          <div class="content" ref="contentRef">
            <q-item
              clickable
              to="/home/catalogo-puestos"
              :inset-level="1"
              class="custom-item"
            >
              <q-item-section avatar class="items-seleccion-elements">
                <q-icon name="mdi-pencil" class="icon-user" />
              </q-item-section>
              <q-item-section>
                <q-item-label>Control de puestos</q-item-label>
                <q-item-label caption
                  >Modifica los puestos existentes</q-item-label
                >
              </q-item-section>
            </q-item>

            <q-item
              clickable
              to="/home/catalogo-maquinaria"
              :inset-level="1"
              class="custom-item"
            >
              <q-item-section avatar class="items-seleccion-elements">
                <q-icon name="handyman" class="icon-user" />
              </q-item-section>
              <q-item-section>
                <q-item-label>Maquinaría y herramientas</q-item-label>
                <q-item-label caption
                  >Modifica el catalogo de maquinaría y herramientas</q-item-label
                >
              </q-item-section>
            </q-item>
          </div>
        </q-expansion-item>

        <q-item v-if="isRh" clickable to="/agenda" class="bg-blue-1">
          <q-item-section avatar>
            <q-icon name="calendar_month" />
          </q-item-section>
          <q-item-section class="text-left q-pt-md q-pb-md">
            <q-item-label>Agenda</q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
      
      
      <q-btn class="logout-button" @click="logout" flat>
        <q-icon name="logout" class="logout-icon" />
        <label>Cerrar Sesión</label>
      </q-btn>
    </q-drawer>
    <q-page-container
      class="q-mt-xl q-mr-xl q-ml-xl"
      style="background-color: #1e3d58"
    >
      <router-view :key="componentKey" />
    </q-page-container>
  </q-layout>
</template>

<!-- -------------------------------------------------- SCRIPT ---------------------------------------------------------->

<script setup>
import { useRouter } from "vue-router";
import { useQuasar } from "quasar";
import { ref, computed, watch, onMounted } from "vue";
import { getS3FileUrl } from "src/services/profiles.js";
import { useAuthStore } from "src/stores/auth";
import { useLocalStorageStore } from "src/stores/localStorage";
import { useRequisitionDetailsStore } from "src/stores/requisitionDetails";
import { storeToRefs } from "pinia";
import { getAdminImagesPath, getAssetsPath } from "src/utils/folderPaths";
import { useRequisitionStore } from "src/stores/requisition";
import axios from "axios";

const $q = useQuasar();
const router = useRouter();
const useRequisition = useRequisitionStore();
const useRequisitionDetails = useRequisitionDetailsStore();
const useAuth = useAuthStore();
const useLocalStorage = useLocalStorageStore();
const drawer = ref(false);
const componentKey = ref(0);
const userName = ref("");
const { showingDetails, updatingRequisition } = storeToRefs(useRequisitionDetails);
const { user, logged, isRh, hasPermitRequisitionCreation } =
  storeToRefs(useAuth);

onMounted(() => {
  loadLocalStorage();
});

const selectedImage = ref();

const photoUUID = ref("default.png");

const getUserImage = computed(() =>
  getS3FileUrl(getAdminImagesPath, photoUUID.value)
);
const getLogoImage = computed(() =>
  getS3FileUrl(getAssetsPath, "logo-turbomaquinas.png")
);

const loadLocalStorage = () => {
  const userStored = useLocalStorage.load("user");
  const loggedStored = useLocalStorage.load("logged");

  if (userStored) {
    user.value = userStored;
    userName.value = user.value.userName;
    photoUUID.value =
      user.value.photoUUID === null ? photoUUID.value : user.value.photoUUID;
  }

  console.log(user.value);

  if (loggedStored) logged.value = loggedStored;
};

const onNewRequisitionClicked = () => {
  router.push("/home/nueva-requisicion-1");
  showingDetails.value = false;
  updatingRequisition.value = false;

};

const uploadImage = async () => {
  const formData = new FormData();

  formData.append("file", selectedImage.value);
  formData.append("folderPath", getAdminImagesPath);

  try {
    $q.loading.show();
    let request;
    if (user.value.photoUUID) {
      console.log("updated file");
      request = await axios.put(
        `/updateFile/${user.value.photoUUID}`,
        formData,
        {
          headers: {
            file: "multipart/form-data",
          },
        }
      );
      if (request.status === 200) {
        selectedImage.value = "";
      }
    } else {
      console.log("updated file");
      request = await axios.post("/upload", formData, {
        headers: {
          file: "multipart/form-data",
        },
      });
    }
    if (request.status === 200) {
      updateUserImage(request.data);
    }
  } catch (error) {
    console.log(error);
  }
};

const updateUserImage = async (imageUUID) => {
  try {
    const request = await axios.put(
      `/auth/update/image/${imageUUID}/user/${user.value.id}`
    );

    if (request.status === 200) {
      user.value.photoUUID = imageUUID;
      useLocalStorage.save("user", user.value);
      photoUUID.value = imageUUID;
    }
  } catch (error) {
  } finally {
    $q.loading.hide();
  }
};

watch(
  showingDetails, // Watch the desired store value
  (newValue) => {
    if (!newValue) {
      componentKey.value += 1;
    }
  }
);

watch(
  updatingRequisition, // Watch the desired store value
  (newValue) => {
    if (!newValue) {
      componentKey.value += 1;
    }
  }
);

const logout = () => {
  useLocalStorage.remove("user");
  useLocalStorage.remove("logged");
  useRequisition.clearStore();
  router.replace("/login");
};
</script>

<!-- -------------------------------------------------- STYLE ---------------------------------------------------------->

<style scoped>
.q-toolbar {
  background-color: #227c9a;
}

.avatar {
  width: 47px;
  /* Tamaño del avatar */
  height: 47px;
  border-radius: 50%;
  /* Forma circular */
  overflow: hidden;
  /* Ocultar el contenido que exceda del círculo */
  position: relative;
  right: 14px;
}

.logout-button {
  background-color: rgba(255, 255, 255, 0);
  color: #484747;
  font-size: 14px;
  font-family: "Trebuchet MS" sans-serif;
  position: absolute;
  top: 95%;
  height: 16px;
}

.logout-icon {
  margin-right: 8px;
  /* Margen derecho del ícono */
}

.username-position {
  position: relative;
  text-align: center;
  right: 48px;
}

.rounded-borders {
  position: relative;
  bottom: 0;
}

.profile-section {
  margin: 10px 20px 20px 20px;
}

.userData-name {
  font-size: 17px;
}

.icon-user {
  font-size: 20px;
}

.drawer-container {
  background-color: #ffff;
  border-top-right-radius: 25px;
  border-bottom-right-radius: 25px;
}
</style>
