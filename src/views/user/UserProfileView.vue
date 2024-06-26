<template>
  <q-layout class="main-layout overflow-hidden-y">
    <q-page-container>
      <q-page style="position: relative; right: 0px; margin-left: 300px">
        <div class="personaldata-background">
          <div
            class="justify-between row"
            style="
              margin-top: 20px;
              margin-bottom: 30px;
              position: relative;
              display: inline-block;
            "
          >
            <q-img
              :src="getUserImage"
              style="width: 300px; height: 300px; border-radius: 160px"
            >
            </q-img>

            <q-btn
              @click="fixed = !fixed"
              borderless
              rounded
              clearable
              standout
              outlined
              bg-color="white"
              icon="add_a_photo"
              style="
                background-color: rgb(255, 255, 255);
                height: 50px;
                width: 55px;
                position: absolute;
                top: 90%;
                left: 75%;
                transform: translate(-50%, -50%);
                justify-content: center;
              "
            >
            </q-btn>

            <q-dialog v-model="fixed" class="z-max">
              <q-card class="q-ml-xl text-center">
                <q-card-section>
                  <div class="text-h5">Selección de imagen de perfil</div>
                </q-card-section>

                <q-separator />
                <div class="text text-center">
                  La imagen seleccionada debe ser formal y seria
                </div>

                <q-card-section style="max-height: 50vh">
                  <q-img
                    :src="selectedImage ? selectedImageURL : getUserImage"
                    style="width: 300px; height: 300px; border-radius: 160px"
                  ></q-img>
                </q-card-section>

                <q-separator />

                <q-card-actions align="right">
                  <q-file
                    class="q-mr-xl"
                    max-file-size="5242880"
                    accept=".jpg, image/*"
                    v-model="selectedImage"
                    clearable
                    borderless
                    label="Selecciona tu imagen"
                    bg-color="white"
                    flat
                    @update:model-value="updateSelectedImageURL()"
                  >
                    <q-tooltip
                      class="bg-dark text-white text-body2 z-max"
                      anchor="bottom middle"
                      self="center middle"
                      transition-show="slide-up"
                      transition-hide="fade"
                      :delay="300"
                      transition-duration="300"
                      :offset="[10, 25]"
                    >
                      Maximo tamaño de imagen 5 MB
                    </q-tooltip>

                    <template v-slot:prepend>
                      <q-icon name="attach_file" />
                    </template>
                  </q-file>
                  <q-btn
                    color="primary"
                    label="Subir imagen"
                    @click.prevent="uploadImage"
                    :disable="!selectedImage || !canUpload"
                    :loading="isUploading"
                  >
                    <q-tooltip
                      class="bg-dark text-white text-body2 z-max"
                      anchor="bottom middle"
                      self="center middle"
                      transition-show="slide-up"
                      transition-hide="fade"
                      :delay="300"
                      transition-duration="300"
                      :offset="[10, 25]"
                    >
                      Da click para subir tu imagen
                    </q-tooltip>
                  </q-btn>
                </q-card-actions>
              </q-card>
            </q-dialog>
          </div>

          <q-card-section class="q-mt-xl q-ml-xl">
            <p class="text-h4 text-weight-bold">
              {{
                fullName === "undefined undefined undefined"
                  ? "Nombre completo "
                  : fullName
              }}
            </p>
            <p class="text-h5 text-weight-regular">{{ userName }}</p>
            <p v-if="specialization !== ''" class="text-h6">
              Especialidad: {{ specialization }}
            </p>
            <p v-if="age !== '' && age !== 0" class="text-h6">
              Edad: {{ age }}
            </p>
          </q-card-section>
        </div>

        <div class="row" style="margin-left: 30px; margin-top: 10px">
          <p
            v-if="
              photoUUID === null || photoUUID === undefined || photoUUID === ''
            "
            class="text-h4 q-ml-xl text-grey-8 text-weight-bold"
          >
            Sube tu foto para poder crear tu solicitud de trabajo.
          </p>
          <ApplicationsCard v-if="userApplicationId != 0" />
        </div>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script setup>
import ApplicationsCard from "src/components/ApplicationsCards.vue";
import { getS3FileUrl } from "src/services/profiles.js";
import { useAuthStore } from "src/stores/auth";
import { storeToRefs } from "pinia";
import { useRequestUser } from "src/stores/requestUser";
import { ref, onMounted, computed, watch, onUnmounted } from "vue";
import { useLocalStorageStore } from "src/stores/localStorage";
import { getUserImagesPath } from "src/utils/folderPaths";
import { getAge } from "src/utils/operations";
import { updateUserImage } from "src/services/user";
import { uploadFile, updateFile } from "src/services/files";
import { useQuasar } from "quasar";

const $q = useQuasar();
const useLocalStorage = useLocalStorageStore();
const useRequest = useRequestUser();
const useAuth = useAuthStore();
const selectedImage = ref();
const newImage = ref();

const { user, getUserPhotoUUID } = storeToRefs(useAuth);
const { savedApplication } = storeToRefs(useRequest);

const fixed = ref(false);
const userName = ref("");
const userApplicationId = ref(0);
const fullName = ref("Nombre completo");
const specialization = ref("");
const age = ref(0);

const isUploading = ref(false);

const photoUUID = ref("");

const selectedImageURL = ref("");

onMounted(() => {
  setUserInfo();
});

const updateSelectedImageURL = () => {
  if (!selectedImage.value) {
    selectedImageURL.value = "";
    return;
  }

  selectedImageURL.value = URL.createObjectURL(selectedImage.value);
};

const canUpload = computed(() => selectedImage.value);

const getUserImage = computed(() => {
  if (
    photoUUID.value === null ||
    photoUUID.value === undefined ||
    photoUUID.value === ""
  ) {
    return getS3FileUrl(getUserImagesPath, "default.png");
  } else {
    return getS3FileUrl(getUserImagesPath, getUserPhotoUUID.value);
  }
});

watch(newImage, (newValue) => {
  selectedImage.value = newValue;
});

const stopWatch = watch(newImage, (newValue) => {
  selectedImage.value = newValue;
});

// Al finalizar la instancia del componente, detén el watcher
onUnmounted(() => {
  stopWatch();
});

const setUserInfo = () => {
  let userStored = useLocalStorage.load("user");
  let applicationStored = useLocalStorage.load("savedApplication");

  if (userStored) {
    user.value = userStored;
  }

  if (applicationStored) {
    savedApplication.value = applicationStored;
  }

  userName.value = user.value.userName;
  photoUUID.value = user.value.photoUUID;
  userApplicationId.value = user.value.applicationId;

  applicationStored = applicationStored
    ? applicationStored
    : savedApplication.value;
  if (applicationStored) {
    fullName.value =
      applicationStored.nombre +
      " " +
      applicationStored.apellido_paterno +
      " " +
      applicationStored.apellido_materno;
    specialization.value = applicationStored.especialidad;
    age.value = getAge(applicationStored.fecha_nacimiento);
    if (age.value === NaN) {
      age.value = 0;
    }
  }
};

const uploadImage = async () => {
  try {
    isUploading.value = true;

    let newFileName;
    $q.loading.show();
    if (user.value.photoUUID) {
      newFileName = await updateFile(
        user.value.photoUUID,
        selectedImage.value,
        getUserImagesPath
      );
      if (newFileName) {
        selectedImage.value = "";
      }
    } else {
      newFileName = await uploadFile(selectedImage.value, getUserImagesPath);
    }
    if (newFileName) {
      selectedImageURL.value = "";
      fixed.value = false;
      await updateUserImageInDatabase(newFileName);
    }
  } catch (error) {
    console.log(error);
  } finally {
    $q.loading.hide();
    isUploading.value = false;
  }
};

const updateUserImageInDatabase = async (imageUUID) => {
  const updatedImageCorrectly = await updateUserImage(user.value.id, imageUUID);

  if (updatedImageCorrectly) {
    user.value.photoUUID = imageUUID;
    useLocalStorage.save("user", user.value);
    photoUUID.value = imageUUID;
  }
};
</script>

<style scoped>
.main-layout {
  background: rgb(255, 255, 255);
}

.personaldata-background {
  position: relative;
  display: flex;
  width: 100%;
  height: 100%;
  left: 50px;
  margin-bottom: 20px;
  margin-top: 20px;
}
</style>
