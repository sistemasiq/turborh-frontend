<template>
  <q-layout view="hHr LpR lFf">
    <q-header elevated style="background: rgb(87, 108, 128)">
      <q-toolbar class="q-toolbar">
        <q-btn
          flat
          @click.prevent="goToJobsCatalog"
          round
          dense
          icon="arrow_back"
        />
        <div style="padding-left: 45%">
          <q-img
            :src="getS3FileUrl('Assets', 'logo-turbomaquinas.png')"
            style="width: 45px; height: 45px"
          />
        </div>
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
      <q-img
        :src="selectedImage"
        v-if="selectedImage"
        style="
          margin-left: 5%;
          top: 30px;
          border-radius: 10px;
          height: 30%;
          width: 90%;
        "
      />

      <q-img
        :src="getJobImage"
        style="width: 270px; height: 250px"
        class="q-ma-md"
      >
      </q-img>
      <br />
      <q-uploader
        v-if="!readOnly"
        accept="image/*"
        max-file-size="100000000"
        max-files="1"
        label="Selecciona la foto del puesto"
        color="blue-grey-6"
        style="height: 270px; width: 270px; margin-left: 12px"
        hide-upload-btn
        @added="handleSelectedImage"
        :url="getS3UploadUrl()"
        field-name="file"
      />
    </q-drawer>

    <div class="justify-between row">
      <q-input
        dark
        outlined
        color="cyan-1"
        v-model="name"
        label="Nombre del puesto"
        label-color="white"
        lazy-rules
        :rules="[(value) => !!value || 'Este campo no puede estar vacío.']"
        class="q-ml-lg q-mt-xs"
        style="width: 25%"
        :readonly="readOnly"
      />
      <q-input
        dark
        outlined
        color="cyan-1"
        v-model="key"
        label="Clave del puesto"
        label-color="white"
        lazy-rules
        :rules="[(value) => !!value || 'Este campo no puede estar vacío.']"
        class="q-ml-lg q-mt-xs"
        style="width: 25%"
        :readonly="readOnly"
      />

      <q-select
        dark
        filled
        label-color="white"
        v-model="selectedDepartmentsId"
        multiple
        use-chips
        emit-value
        map-options
        :options="departments"
        label="Departamentos relacionados"
        :loading="!departmentsFetched"
        class="q-mt-xs q-ml-lg"
        style="width: 25%"
        :readonly="readOnly"
      />
    </div>

    <q-input
      dark
      outlined
      color="cyan-1"
      v-model="mainFunction"
      label="Funcion principal del puesto"
      label-color="white"
      lazy-rules
      autogrow
      :rules="[(value) => !!value || 'Este campo no puede estar vacío.']"
      class="q-ml-lg q-mt-lg"
      :readonly="readOnly"
    />

    <!-- <q-input
      dark
      outlined
      color="cyan-1"
      v-model="description"
      label="Descripción del puesto"
      label-color="white"
      lazy-rules
      autogrow
      :rules="[(value) => !!value || 'Este campo no puede estar vacío.']"
      class="q-ml-lg q-mt-lg"
      :readonly="readOnly"
    />
 -->
    <div class="justify-between row q-mt-xl q-pa-sm">
      <q-card
        flat
        bordered
        class="q-mb-sm q-ml-md"
        style="height: 30%; width: 45%; border-radius: 20px"
      >
        <q-card-section style="background: rgb(21, 21, 21)">
          <p class="text-h6 text-center text-white">Funciones del puesto</p>
        </q-card-section>
        <q-card-section>
          <q-input
            v-model="functions"
            ligth
            outlined
            color="white"
            class="text-body2 text-justify"
            label-color="black"
            type="textarea"
            :rows="10"
            :readonly="readOnly"
          />
        </q-card-section>
      </q-card>
      <q-card
        flat
        bordered
        class="q-mb-sm q-ml-xl"
        style="height: 30%; width: 45%; border-radius: 20px"
      >
        <q-card-section style="background: rgb(21, 21, 21)">
          <p class="text-h6 text-center text-white">
            Habilidades y/o conocimientos
          </p>
        </q-card-section>
        <q-card-section>
          <q-input
            v-model="skills"
            ligth
            outlined
            color="white"
            class="text-body2 text-justify"
            label-color="black"
            type="textarea"
            :rows="10"
            :readonly="readOnly"
          />
        </q-card-section>
      </q-card>
    </div>

    <div class="row q-mt-lg">
      <div class="col-3">
        <q-input
          v-model="age"
          dark
          outlined
          color="cyan-1"
          label="Edad"
          label-color="white"
          type="number"
          min="18"
          max="65"
          step="1"
          :readonly="readOnly"
          class="q-ml-md"
        />
      </div>
      <div class="col-3">
        <q-input
          v-model="englishLevel"
          dark
          outlined
          color="cyan-1"
          label="Inglés"
          label-color="white"
          :readonly="readOnly"
          class="q-ml-md"
        />
      </div>

      <div class="col-3">
        <q-select
          v-model="gender"
          :options="genderOptions"
          dark
          outlined
          color="cyan-1"
          label="Seleccione el sexo"
          label-color="white"
          :disable="readOnly"
          emit-value
          map-options
          class="q-ml-md"
        />
      </div>

      <div class="col-3">
        <q-select
          v-model="civilStatus"
          :options="civilStatusOptions"
          dark
          outlined
          color="cyan-1"
          label="Seleccione el estado civil"
          label-color="white"
          :disable="readOnly"
          emit-value
          map-options
          class="q-ml-md"
        />
      </div>
    </div>

    <div class="row q-mt-lg">
      <div class="col-7">
        <p class="title">Escolaridad:</p>
        <div class="schooling-content rounded-borders q-ml-lg bg-white">
          <q-radio
            color="cyan"
            unchecked-icon="radio_button_unchecked"
            checked-icon="radio_button_checked"
            size="lg"
            class="checkbox"
            val="S"
            v-model="education"
            label="Secundaria"
            :disable="readOnly"
          />
          <q-radio
            color="cyan"
            unchecked-icon="radio_button_unchecked"
            checked-icon="radio_button_checked"
            size="lg"
            class="checkbox"
            val="B"
            v-model="education"
            label="Bachillerato"
            :disable="readOnly"
          />
          <q-radio
            color="cyan"
            unchecked-icon="radio_button_unchecked"
            checked-icon="radio_button_checked"
            size="lg"
            class="checkbox"
            val="P"
            v-model="education"
            label="Profesional"
            :disable="readOnly"
          />
          <q-radio
            color="cyan"
            unchecked-icon="radio_button_unchecked"
            checked-icon="radio_button_checked"
            size="lg"
            class="checkbox"
            val="M"
            v-model="education"
            label="Maestria"
            :disable="readOnly"
          />
        </div>
      </div>
      <div class="col-5 q-mt-md">
        <div class="rounded-borders q-mt-lg q-ml-lg bg-white">
          <q-checkbox
            light
            v-model="extraHours"
            label="Derecho a tiempo extra"
            color="blue"
            :disable="readOnly"
          />
          <q-checkbox
            light
            v-model="travelAvailability"
            label="Disponibilidad para viajar"
            color="blue"
            :disable="readOnly"
          />
        </div>
      </div>
    </div>
    <q-input
      v-model="experience"
      dark
      outlined
      color="cyan-1"
      label="Experiencia"
      label-color="white"
      type="textarea"
      class="q-ml-lg q-mt-xl text-body2"
      :readonly="readOnly"
    >
    </q-input>
    <q-input
      v-model="observations"
      dark
      outlined
      color="cyan-1"
      label="Observaciones sobre el puesto"
      label-color="white"
      type="textarea"
      class="q-ml-lg q-mt-xl text-body2"
      :readonly="readOnly"
    >
    </q-input>

    <q-input
      v-model="conditions"
      dark
      outlined
      color="cyan-1"
      label="Especificar condiciones"
      label-color="white"
      type="textarea"
      class="q-ml-lg text-body2 q-mt-xl"
      :readonly="readOnly"
    />

    <q-btn
      rounded
      style="width: 12%; height: 6%; margin-left: 88%"
      text-color="dark"
      class="q-mb-sm q-mt-md text-body2 text-bold"
      :label="getDesign().buttonText"
      @click.prevent="openDialog = true"
      :icon="getDesign().icon"
      :color="disableJobStateButton() ? 'grey' : 'cyan-2'"
      :disable="disableJobStateButton()"
      v-if="!readOnly"
    />
    <q-dialog v-model="openDialog" persistent>
      <q-card>
        <q-card-section class="row items-center">
          <span class="q-ml-sm text-body2">{{ getDesign().dialogText }}</span>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="Cancelar" color="primary" v-close-popup />
          <q-btn
            rounded
            :style="{ width: getDesign().buttonWidth }"
            :label="getDesign().buttonText"
            text-color="dark"
            color="cyan-2"
            v-close-popup
            @click.prevent="uploadUserFiles"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-layout>
</template>

<script setup>
import { ref, onMounted, computed, onBeforeMount, onBeforeUnmount } from "vue";
import {
  getSessionStorageItem,
  setSessionStorageItem,
  removeSessionStorageItem,
} from "src/stores/sessionStorage";
import { getS3FileUrl } from "src/services/profiles.js";
import { useQuasar } from "quasar";
import { useJobCatalogStore } from "src/stores/jobCatalog";
import { storeToRefs } from "pinia";
import { useRouter } from "vue-router";
import { getS3UploadUrl } from "src/services/profiles.js";
import { getJobImagesPath } from "src/utils/folderPaths";
import {
  getAllDepartments,
  createJob,
  updateJob,
  getJobById,
} from "src/services/jobs";
import { notifyNegative, notifyPositive } from "src/utils/notifies";
import { updateFile, uploadFile } from "src/services/files";
import { useAuthStore } from "src/stores/auth";
import { useRoute } from "vue-router";

const route = useRoute();
const router = useRouter();
const useAuth = useAuthStore();
const $q = useQuasar();
const drawer = ref(false);

const name = ref();
const key = ref();
const mainFunction = ref("");
/* const description = ref(""); */
const age = ref();
const skills = ref("");
const functions = ref("");

const extraHours = ref(false);
const travelAvailability = ref(false);

const englishLevel = ref("");

const experience = ref("");
const observations = ref("");
const conditions = ref("");

const departmentsFetched = ref(false);

const openDialog = ref(false);

const useJobCatalog = useJobCatalogStore();

const jobImg = ref();

const defaultUUID = "default.png";

const jobUUID = ref(defaultUUID);

const { jobId, readOnly, updatingJob } = storeToRefs(useJobCatalog);

const { user } = storeToRefs(useAuth);

onBeforeMount(() => {
  isJobSelected();
});

onBeforeUnmount(() => {
  if (route.path !== "/home/edicion-puesto") {
    removeSessionStorageItem("jobData");
    removeSessionStorageItem("jobInformation");
    useJobCatalog.$reset();
  }
});

const isJobSelected = () => {
  if (getSessionStorageItem("jobData")) {
    const jobData = JSON.parse(getSessionStorageItem("jobData"));
    jobId.value = jobData.jobId;
    updatingJob.value = jobData.updatingJob;
    readOnly.value = jobData.readOnly;
  }
  if (getSessionStorageItem("jobInformation")) {
    const jobInformation = JSON.parse(getSessionStorageItem("jobInformation"));

    //See if the job does not have any data, then insert the departments id in the selectedDepartmentsId array
    if (!selectedDepartmentsId.value) {
      jobInformation.departmentsId.forEach((element) => {
        if (element != null) {
          selectedDepartmentsId.value.push(element);
        }
      });
    } else {
      console.log("job without departments");
      return selectedDepartmentsId.value;
    }
    console.log("selectedDepartmentsId", selectedDepartmentsId.value);
    name.value = jobInformation.name;
    key.value = jobInformation.key;
    mainFunction.value = jobInformation.mainFunction;
    englishLevel.value = jobInformation.englishLevel;
    description.value = jobInformation.functions;
    experience.value = jobInformation.experience;
    functions.value = jobInformation.functions;
    skills.value = jobInformation.skills;
    age.value = jobInformation.age;
    conditions.value =
      jobInformation.conditions === "null" ? "" : jobInformation.conditions;
    observations.value =
      jobInformation.observations === "null" ? "" : jobInformation.observations;
    extraHours.value = jobInformation.extraHours === 1 ? true : false;
    travelAvailability.value =
      jobInformation.travelAvailability === 1 ? true : false;
    gender.value = jobInformation.gender;
    civilStatus.value = jobInformation.civilStatus;
    education.value = jobInformation.education;
    jobUUID.value =
      jobInformation.photo_uuid === null ||
      jobInformation.photo_uuid === "" ||
      jobInformation.photo_uuid === "no_image"
        ? defaultUUID
        : jobInformation.photo_uuid;
  }
};
onMounted(() => {
  fetchDepartments();

  if (readOnly.value || updatingJob.value) {
    getJobData(jobId.value);
  }
});

const getJobImage = computed(() =>
  getS3FileUrl(getJobImagesPath, jobUUID.value)
);

const handleSelectedImage = (files) => {
  jobImg.value = files[0];
};

const uploadUserFiles = async () => {
  const updateWithoutImage = jobUUID.value === defaultUUID && !jobImg.value;

  if (updateWithoutImage) {
    changeJobState("");
    return;
  }

  const updateJobWithSameImage = jobUUID.value !== defaultUUID && !jobImg.value;

  if (updateJobWithSameImage) {
    changeJobState(jobUUID.value);
    return;
  }

  try {
    $q.loading.show();
    let file;

    if (jobUUID.value === defaultUUID) {
      file = await uploadFile(jobImg.value, getJobImagesPath);
    } else {
      file = await updateFile(jobUUID.value, jobImg.value, getJobImagesPath);
    }

    if (file) {
      jobUUID.value = file.data;
      changeJobState(file);
    }
  } catch (error) {
    console.log(error);
  }
};

const disableJobStateButton = () => {
  if (updatingJob.value) return false;
  
  return (
    !name.value ||
    !key.value ||
    !mainFunction.value ||
    !selectedDepartmentsId.value ||
    !functions.value ||
    !skills.value ||
    !education.value ||
    !englishLevel.value ||
    !age.value ||
    !gender.value ||
    !civilStatus.value
  );
};

const getDesign = () => {
  return {
    dialogText: updatingJob.value
      ? "¿Deseas actualizar este puesto?"
      : "¿Deseas crear un nuevo puesto?",
    buttonText: updatingJob.value ? "Actualizar" : "Crear",
    buttonWidth: updatingJob.value ? "40%" : "30%",
    icon: updatingJob.value ? "edit" : "add",
  };
};

const goToJobsCatalog = () => {
  readOnly.value = false;
  updatingJob.value = false;
  router.push("/home/catalogo-puestos");
};

const getJobData = async (id) => {
  try {
    $q.loading.show();
    const jobData = await getJobById(id);
    if (jobData) {
      setSessionStorageItem("jobInformation", jobData);
      jobData.departmentsId.forEach((element) => {
        if (element != null) {
          selectedDepartmentsId.value.push(element);
        }
      });

      name.value = jobData.name;
      key.value = jobData.key;
      mainFunction.value = jobData.mainFunction;
      englishLevel.value = jobData.englishLevel;
      experience.value = jobData.experience;
      functions.value = jobData.functions;
      skills.value = jobData.skills;
      age.value = jobData.age;
      conditions.value =
        jobData.conditions === "null" ? "" : jobData.conditions;
      observations.value =
        jobData.observations === "null" ? "" : jobData.observations;
      extraHours.value = jobData.extraHours === 1 ? true : false;
      travelAvailability.value =
        jobData.travelAvailability === 1 ? true : false;
      gender.value = jobData.gender;
      civilStatus.value = jobData.civilStatus;
      education.value = jobData.education;
      jobUUID.value =
        jobData.photo_uuid === null ||
        jobData.photo_uuid === "" ||
        jobData.photo_uuid === "no_image"
          ? defaultUUID
          : jobData.photo_uuid;
    }
  } catch (error) {
    console.log(error);
  } finally {
    $q.loading.hide();
  }
};

const education = ref();

const gender = ref("");

const civilStatus = ref("");

const selectedDepartmentsId = ref([]);

const departments = ref([]);

const fetchDepartments = async () => {
  try {
    departmentsFetched.value = false;
    const totalDepartments = await getAllDepartments();

    if (totalDepartments) {
      totalDepartments.forEach((element) => {
        const newDepartment = {
          value: element.id,
          name: element.name,
          label: element.key,
        };
        departments.value.push(newDepartment);
      });
    }
  } catch (error) {
    console.log(error);
  } finally {
    departmentsFetched.value = true;
  }
};

const changeJobState = (photoName) => {
  if (updatingJob.value) {
    updateJobData(photoName);
    return;
  }

  createNewJob(photoName);
};

const updateJobData = async (photoName) => {
  const updatedJobData = {
    createdBy: user.value.id,
    id: jobId.value,
    name: name.value,
    mainFunction: mainFunction.value,
    functions: functions.value,
    skills: skills.value,
    extraHours: extraHours.value === true ? 1 : 0,
    travelAvailability: travelAvailability.value === true ? 1 : 0,
    education: education.value,
    experience: experience.value,
    englishLevel: englishLevel.value,
    age: age.value,
    civilStatus: civilStatus.value,
    gender: gender.value,
    observations: observations.value,
    conditions: conditions.value,
    departmentsId: selectedDepartmentsId.value,
    key: key.value,
    photo_uuid: photoName,
  };

  try {
    $q.loading.show();
    const updatedJob = await updateJob(updatedJobData);
    if (updatedJob) {
      $q.notify(notifyPositive("El puesto ha sido actualizado correctamente"));
      goToJobsCatalog();
    }
  } catch (error) {
    $q.notify(
      notifyNegative("Hubo un error al actualizar el puesto, intenta de nuevo")
    );
    console.log(error);
    goToJobsCatalog();
  } finally {
    $q.loading.hide();
  }
};

const createNewJob = async (photoName) => {
  const newJobData = {
    createdBy: user.value.id,
    name: name.value,
    mainFunction: mainFunction.value,
    functions: functions.value,
    skills: skills.value,
    extraHours: extraHours.value === true ? 1 : 0,
    travelAvailability: travelAvailability.value === true ? 1 : 0,
    education: education.value,
    experience: experience.value,
    englishLevel: englishLevel.value,
    age: age.value,
    civilStatus: civilStatus.value,
    gender: gender.value,
    observations: observations.value,
    conditions: conditions.value,
    departmentsId: selectedDepartmentsId.value,
    key: key.value,
    photo_uuid: photoName,
  };

  try {
    $q.loading.show();
    const jobCreated = await createJob(newJobData);

    if (jobCreated) {
      $q.notify(notifyPositive("El puesto ha sido creado correctamente"));
      goToJobsCatalog();
    }
  } catch (error) {
    $q.notify(
      notifyNegative("Hubo un error al crear el puesto, intenta de nuevo")
    );
  } finally {
    $q.loading.hide();
  }
};

const selectedImage = ref();

const genderOptions = [
  { label: "Masculino", value: "M" },
  { label: "Femenino", value: "F" },
  { label: "Indistinto", value: "I" },
];

const civilStatusOptions = [
  { label: "Casado", value: "C" },
  { label: "Soltero", value: "S" },
  { label: "Indistinto", value: "I" },
];

const educationOptions = [
  { label: "Secundaria", value: "S" },
  { label: "Bachillerato", value: "B" },
  { label: "Profesional", value: "P" },
  { label: "Maestría", value: "M" },
];
</script>

<style scoped>
.defaultimage {
  border-bottom: 20px;
}

.uploaded-image {
  max-height: 200px;
  max-width: 200px;
}
.rounded-borders {
  border-radius: 15px;
  background-color: #ffffff;
}

.gender-title {
  font-weight: bold;
  font-size: 16px;
  color: aliceblue;
  padding-left: 10%;
}

.gender-content {
  background-color: transparent;
  margin-left: 3%;
}

.checkbox {
  margin-left: 3%;
}

.title {
  color: aliceblue;
  padding-left: 3%;
}
</style>
