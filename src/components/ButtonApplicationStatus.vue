<template>
  <q-page-sticky position="bottom-right" :offset="[18, 18]">
    <q-btn
      v-if="!viewingApplication"
      @mouseover="hoverCreateApplication = true"
      @mouseleave="hoverCreateApplication = false"
      @click.prevent="openConfirmation = true"
      unelevated
      size="lg"
      :icon="updatingApplication ? 'update' : 'done_all'"
      class="bg-green-6 text-white btn-brand text-capitalize text-h6 q-mr-xl q-mb-xs q-mt-xl"
      :class="{
        'text-white': hoverCreateApplication,
        'text-weight-bold': hoverCreateApplication,
      }"
      :disable="disableButton"
    >
      {{ updatingApplication ? "Actualizar solicitud" : "Crear solicitud" }}
    </q-btn>
  </q-page-sticky>

  <q-dialog v-model="openConfirmation" persistent>
    <q-card style="border-radius: 30px" class="bg-white full-width">
      <q-card-section class="row items-center">
        <span class="absolute-center q-mt-lg" style="font-size: large">
          {{
            updatingApplication
              ? "¿Deseas actualizar tu solicitud?"
              : "¿Deseas crear tu solicitud?"
          }}</span
        >
      </q-card-section>

      <q-card-actions align="center" class="q-mt-xl">
        <q-btn
          flat
          class="bg-green-6 text-white"
          :label="updatingApplication ? 'Actualizar' : 'Crear'"
          v-close-popup
          @click.prevent="createApplication"
          style="border-radius: 30px; width: 150px"
        />
        <q-btn
          flat
          text-color="black"
          label="Cancelar"
          color="primary"
          v-close-popup
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { computed, watch } from "vue"
import { useRequestUser } from "src/stores/requestUser";
import { useAuthStore } from "src/stores/auth";
import { useRouter } from "vue-router";
import { storeToRefs } from "pinia";
import { useQuasar } from "quasar";
import { ref, onMounted } from "vue";
import { notifyNegative, notifyPositive } from "src/utils/notifies";
import { getUserDocumentsPath } from "src/utils/folderPaths";
import { useLocalStorageStore } from "src/stores/localStorage";
import { createUserApplication, updateUserApplication } from "src/services/userApplication";
import { updateFile, uploadFile } from "src/services/files";



const useLocalStorage = useLocalStorageStore();
const router = useRouter();
const useAuth = useAuthStore();
const useApplication = useRequestUser();
const $q = useQuasar();


const props = defineProps(["disable", "requiredFields"])

const openConfirmation = ref(false);
const currentRequiredFields = ref([])

const {
  familyReferencesData,
  commercialReferencesData,
  familyFathersData,
  familySonsData,
  machinery,
  officesData,
  laboralExperienceData,
  frontPageData,
  personalData,
  documentsData,
  drivingLicenceData,
  educationData,
  recruitingMeansData,
  viewingApplication,
  updatingApplication,
  savedApplication,
  curriculumStored,
} = storeToRefs(useApplication);

const { user } = storeToRefs(useAuth);

const hoverCreateApplication = ref(false);

onMounted(() => {
  if (
    (!curriculumStored.value || curriculumStored.value === null) &&
    !updatingApplication.value && !viewingApplication.value
  ) {
    $q.notify(
      notifyNegative("Adjunta tu curriculum en la página 'Documentos'")
    );
  }

  setProps();

});

const setProps = () => {
  if(props.requiredFields){
    currentRequiredFields.value = props.requiredFields;
  }
};

const computedCurrentRequiredFields = computed(() => {
  if(currentRequiredFields.value){
    console.log("required fields "+currentRequiredFields.value)
    return currentRequiredFields.value
  }
})

watch(props, (newProps) => {
  currentRequiredFields.value = newProps.requiredFields;
});

const disableButton = computed(() => {

if(currentRequiredFields.value.length === 0 || viewingApplication.value){
  return false;
}
return computedCurrentRequiredFields.value.some(field => !field);
});

const createApplication = () => {
  if (
    !familyReferencesData.value ||
    !commercialReferencesData.value ||
    !machinery.value ||
    !officesData.value ||
    !laboralExperienceData.value
  ) {
    $q.notify(notifyNegative("Hubo un error al crear la solicitud!"));
    return;
  }

  const completeApplication = {
    activo: 1,
    creado_por: user.value.id,

    solicitud_id: savedApplication.value
      ? savedApplication.value.solicitud_id
      : 0,

    referencias_familiares: familyReferencesData.value,
    referencias_comerciales: commercialReferencesData.value,
    datos_familiares: familyFathersData.value.concat(familySonsData.value),
    manejo_maquinas_herramientas: machinery.value,
    conocimientos_oficios: officesData.value,
    experiencia_laboral: laboralExperienceData.value,

    //Portada
    nombre: frontPageData.value.name,
    apellido_paterno: frontPageData.value.firstLastName,
    apellido_materno: frontPageData.value.secondLastName,
    sueldo_deseado: frontPageData.value.wantedSalary,
    sexo: frontPageData.value.gender,

    //Datos Personales
    domicilio: personalData.value.homeAddress,
    estado: personalData.value.state,
    ciudad: personalData.value.city,
    lugar_nacimiento: personalData.value.birthPlace,
    fecha_nacimiento: personalData.value.birthDate,
    telefono: personalData.value.phone,
    email: personalData.value.email,
    estatura: personalData.value.height,
    peso: personalData.value.weight,
    tipo_sangre: personalData.value.bloodType,
    estado_civil: personalData.value.civilStatus,
    vive_con: personalData.value.roomie,
    numero_dependientes: personalData.value.dependents,
    dependientes_parentesco: personalData.value.kinship,
    tipo_vivienda: personalData.value.homeProperty,
    monto_renta: personalData.value.amount,
    club_perteneciente: personalData.value.clubs,
    meta_vida: personalData.value.goalInLife,
    padecimiento: personalData.value.diseases,
    alergia_medicamento: personalData.value.allergies,
    automovil_marca_modelo: personalData.value.brand,
    otro_ingreso: personalData.value.incomesConcept,

    //Documentos
    rfc: documentsData.value.rfc,
    numero_imss: documentsData.value.imss,
    numero_afore: documentsData.value.afore,
    licencias_manejo: drivingLicenceData.value,
    extranjero_numero_fm2: documentsData.value.fm2,
    nombre_cv: curriculumStored.value,

    //Medios de reclutamiento
    medio_reclutamiento: recruitingMeansData.value.medium,
    familiar_en_turbomaquinas: recruitingMeansData.value.relative,
    familiar_departamento: recruitingMeansData.value.department,
    sindicato: recruitingMeansData.value.sindicate,

    //Escolaridad
    secundaria: educationData.value.secondary,
    bachillerato: educationData.value.highSchool,
    profesional: educationData.value.professional,
    maestria: educationData.value.master,
    otro: educationData.value.other,
    secundaria_fecha_inicio: educationData.value.dateStartSecondary,
    secundaria_fecha_fin: educationData.value.dateEndSecondary,
    bachillerato_fecha_inicio: educationData.value.dateStartHighSchool
      ? educationData.value.dateStartHighSchool
      : "0000/00/00",
    bachillerato_fecha_fin: educationData.value.dateEndHighSchool
      ? educationData.value.dateEndHighSchool
      : "0000/00/00",
    profesional_fecha_inicio: educationData.value.dateStartProfessional
      ? educationData.value.dateStartProfessional
      : "0000/00/00",
    profesional_fecha_fin: educationData.value.dateEndProfessional
      ? educationData.value.dateEndProfessional
      : "0000/00/00",
    maestria_fecha_inicio: educationData.value.dateStartMaster
      ? educationData.value.dateStartMaster
      : "0000/00/00",
    maestria_fecha_fin: educationData.value.dateEndMaster
      ? educationData.value.dateEndMaster
      : "0000/00/00",
    otro_fecha_inicio: educationData.value.dateStartOther
      ? educationData.value.dateStartOther
      : "0000/00/00",
    otro_fecha_fin: educationData.value.dateEndOther
      ? educationData.value.dateEndOther
      : "0000/00/00",
    secundaria_especialidad: educationData.value.secondarySpeciality,
    bachillerato_especialidad: educationData.value.highSchoolSpeciality,
    profesional_especialidad: educationData.value.selectedProfesional,
    maestria_especialidad: educationData.value.masterSpeciality,
    otro_especialidad: educationData.value.otherSpeciality,
    secundaria_certificado: educationData.value.certifiedSecondary ? 1 : 0,
    bachillerato_certificado: educationData.value.certifiedHighSchool ? 1 : 0,
    profesional_certificado: educationData.value.certifiedProfessional ? 1 : 0,
    maestria_certificado: educationData.value.certifiedMaster ? 1 : 0,
    otro_certificado: educationData.value.certifiedOther ? 1 : 0,
    secundaria_publica: educationData.value.isPublicSecondary ? 1 : 0,
    bachillerato_publico: educationData.value.isPublicHighSchool ? 1 : 0,
    profesional_publico: educationData.value.isPublicProfessional ? 1 : 0,
    maestria_publica: educationData.value.isPublicMaster ? 1 : 0,
    otro_publico: educationData.value.isPublicOther ? 1 : 0,
    no_cedula_profesional: educationData.value.professionalLicence,
    especialidad: educationData.value.speciality,
    idiomas_dominados: educationData.value.languages,
    estudia_actualmente: educationData.value.currentlyStudying ? 1 : 0,
    institucion_actual: educationData.value.currentInstitution,
    especialidad_actual: educationData.value.currentSpeciality,
    horarios_actual: educationData.value.schedules,
    publica_actual: educationData.value.isPublicCurrent ? 1 : 0,
  };

  if (!updatingApplication.value) {
    uploadCurriculum(completeApplication);
    return;
  }

  if (curriculumStored.value) {
    updateCurriculum(completeApplication);
  } else {
    completeApplication.nombre_cv = savedApplication.value.nombre_cv;
    update(completeApplication);
  }
};

const create = async (completeApplication) => {
  try {
    const newUserApplicationId = await createUserApplication(completeApplication);

    if (newUserApplicationId) {
      $q.notify(notifyPositive("Tu solicitud ha sido creada correctamente"));
      clearApplicationStoredValues();
      completeApplication.solicitud_id = newUserApplicationId;
      savedApplication.value = completeApplication;
      useLocalStorage.save("savedApplication", completeApplication);
      router.replace("/userHome/perfil");
    } else {
      $q.notify(notifyNegative("Tienes datos incorrectos!"));
    }
  } catch (error) {
    $q.notify(notifyNegative("Hubo un error al crear la solicitud!"));
    console.log(error);
  } finally {
    $q.loading.hide();
  }
};

const update = async (completeApplication) => {
  try {
    $q.loading.show();

    const updatedUserApplication = await updateUserApplication(completeApplication);

    if (updatedUserApplication) {
      useLocalStorage.save("savedApplication", completeApplication);
      savedApplication.value = completeApplication;
      $q.notify(
        notifyPositive("Tu solicitud ha sido actualizada correctamente")
      );
      router.replace("/userhome/perfil");
    } else {
      $q.notify(notifyNegative("Tienes datos incorrectos!"));
    }
  } catch (error) {
    $q.notify(notifyNegative("Hubo un error al actualizar la solicitud!"));
  } finally {
    $q.loading.hide();
  }
};

const uploadCurriculum = async (completeApplication) => {

  try {
    $q.loading.show();
    const uploadedCurriculum = await uploadFile(completeApplication.nombre_cv, getUserDocumentsPath);

    if (uploadedCurriculum) {
      completeApplication.nombre_cv = uploadedCurriculum;
      await create(completeApplication);
    }
  } catch (error) {
    $q.notify(notifyNegative("Hubo un error al subir sus archivos"));
    $q.loading.hide();
    console.log(error);
  }
};

const clearApplicationStoredValues = () => {
  useLocalStorage.remove("frontpage");
  useLocalStorage.remove("personalData");
  useLocalStorage.remove("commercialReferencesData");
  useLocalStorage.remove("documentsData");
  useLocalStorage.remove("drivingLicenceData");
  useLocalStorage.remove("educationData");
  useLocalStorage.remove("familyFathersData");
  useLocalStorage.remove("familyReferencesData");
  useLocalStorage.remove("familySonsData");
  useLocalStorage.remove("laboralExperienceData");
  useLocalStorage.remove("machineryData");
  useLocalStorage.remove("measuringInstrumentsData");
  useLocalStorage.remove("officesData");
  useLocalStorage.remove("otherToolsData");
  useLocalStorage.remove("personalData");
  useLocalStorage.remove("recruitingMeansData");
  useLocalStorage.remove("toolsData");
};

const updateCurriculum = async (completeApplication) => {


  try {
    $q.loading.show();
    const updatedCurriculum = await updateFile(savedApplication.value.nombre_cv, completeApplication.nombre_cv, getUserDocumentsPath)

    if (updatedCurriculum) {
      completeApplication.nombre_cv = updatedCurriculum;
      await update(completeApplication);
    }
  } catch (error) {
    $q.notify(notifyNegative("Hubo un error al subir sus archivos"));
    $q.loading.hide();
  }
};
</script>
