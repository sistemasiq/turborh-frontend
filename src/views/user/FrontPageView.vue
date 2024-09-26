<template>
  <q-layout
    v-on:vnode-unmounted="saveLocalStore()"
    style="background-color: rgb(30, 61, 88)"
  >
    <q-card flat bordered class="rounded-borders">
      <q-card-section class="title"> {{ pageTitle }} </q-card-section>

      <q-card-section class="content" style="max-width: 100%">
        <pagination-application
          :page="1"
          :required-fields="requiredFieldsOnThisPage"
          @on-field-validation="validateRequiredFields"
        />

        <div style="margin-top: 6%">
          <q-card
            flat
            bordered
            text-color="white"
            class="q-mb-lg"
            style="
              margin-left: 0%;
              border-color: rgb(255, 248, 43);
              background-color: transparent;
              color: white;
              width: 100%;
              height: 80px;
            "
            v-if="!viewingApplication"
          >
            <q-card-section>
              <div class="text-body1 text-weight-medium row">
                <q-icon name="warning" class="q-mr-md q-mt-xs" />
                Nota
              </div>
              <p class="text-body2">
                Todos los campos de esta pantalla son requeridos para avanzar a
                la siguiente
              </p>
            </q-card-section>
          </q-card>
        </div>

        <div class="inputs q-mt-sm" align="center" style="width: 100%">
          <div class="row">
            <q-form class="q-mt-xl q-mr-lg" style="width: 40%; height: 100%">
              <q-input
                ref="nameRef"
                dark
                outlined
                color="cyan-1"
                v-model="name"
                type="text"
                label="Nombre(s) *"
                label-color="white"
                :rules="[ruleFieldRequired]"
                :readonly="viewingApplication"
                @update:modelValue="updateStore()"
                class="input-brand"
              >
              
              </q-input>

              <q-input
              ref="firstLastNameRef"
                dark
                outlined
                color="cyan-1"
                v-model="firstLastName"
                type="text"
                label="Apellido paterno *"
                label-color="white"
                :rules="[ruleFieldRequired]"
                @update:modelValue="updateStore()"
                :readonly="viewingApplication"
                class="input-brand"
              >
              </q-input>

              <q-input
              ref="secondLastNameRef"
                dark
                outlined
                color="cyan-1"
                v-model="secondLastName"
                type="text"
                label="Apellido materno *"
                label-color="white"
                :rules="[ruleFieldRequired]"
                :readonly="viewingApplication"
                @update:modelValue="updateStore()"
                class="input-brand"
              >
              </q-input>
              <q-input
                ref="wantedSalaryRef"
                prefix="$ MXN"
                dark
                outlined
                color="cyan-1"
                v-model="wantedSalary"
                mask="######"
                min="0"
                label="Sueldo mensual deseado *"
                label-color="white"
                lazy-rules
                :rules="[ruleFieldRequired]"
                @update:modelValue="updateStore()"
                :readonly="viewingApplication"
                class="input-brand"
              >
              </q-input>
              <div style="margin-left: 20%" class="row q-ml-lg q-mt-sm">
                <p style="color: white" class="q-mt-md q-mr-lg q-ml-lg">
                  Sexo *
                </p>
                <q-radio
                  color="cyan"
                  unchecked-icon="radio_button_unchecked"
                  checked-icon="radio_button_checked"
                  size="lg"
                  class="checkbox"
                  v-model="genderChoosed"
                  val="M"
                  label="Masculino"
                  style="color: white"
                  :disable="viewingApplication"
                  @update:modelValue="updateStore()"
                />
                <q-radio
                  color="cyan"
                  unchecked-icon="radio_button_unchecked"
                  checked-icon="radio_button_checked"
                  size="lg"
                  class="checkbox"
                  v-model="genderChoosed"
                  val="F"
                  label="Femenino"
                  style="color: white"
                  :disable="viewingApplication"
                  @update:modelValue="updateStore()"
                />
                <q-radio
                  color="cyan"
                  unchecked-icon="radio_button_unchecked"
                  checked-icon="radio_button_checked"
                  size="lg"
                  class="checkbox"
                  v-model="genderChoosed"
                  val="O"
                  label="Otro"
                  style="color: white"
                  :disable="viewingApplication"
                  @update:modelValue="updateStore()"
                />
              </div>
            </q-form>
            <div
              style="width: 50%; max-width: 50%; height: 75%; max-height: 75%"
            >
              <q-img
                class="q-mt-xl"
                style="width: 360px; height: 360px; border-radius: 15px"
                :src="getUserImage"
              />
            </div>
          </div>
        </div>

        <q-btn
          v-if="!viewingApplication && !updatingApplication"
          class="btn-clean q-mt-xl"
          rounded
          text-color="white"
          color="red-5"
          label="Limpiar"
          icon="cleaning_services"
          @click.prevent="clean"
        />
      </q-card-section>
    </q-card>
    <ButtonApplicationStatus
      v-if="updatingApplication"
      :required-fields="requiredFieldsOnThisPage"
    />
  </q-layout>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import { ruleFieldRequired } from "src/utils/fieldRules";
import ButtonApplicationStatus from "src/components/ButtonApplicationStatus.vue";
import PaginationApplication from "src/components/PaginationApplication.vue";
import { useRequestUser } from "src/stores/requestUser";
import { storeToRefs } from "pinia";
import { getS3FileUrl } from "src/services/profiles.js";
import { useLocalStorageStore } from "src/stores/localStorage";
import { notifyNegativeField, notifyPositive } from "src/utils/notifies";
import { useQuasar } from "quasar";
import { getUserImagesPath } from "src/utils/folderPaths";
import { useAuthStore } from "src/stores/auth";


const $q = useQuasar();
const useAuth = useAuthStore();
const useRequest = useRequestUser();
const useLocalStorage = useLocalStorageStore();

const name = ref("");
const nameRef = ref(null);
const firstLastName = ref("");
const firstLastNameRef = ref(null);
const secondLastName = ref("");
const secondLastNameRef = ref(null)
const wantedSalary = ref(0);
const wantedSalaryRef = ref(null)
const genderChoosed = ref();
const photoUUID = ref("");

const { isRh, isAdmin, isBoss, getUserPhotoUUID } = storeToRefs(useAuth);

const pageTitle = "Presentación Personal y Salario Deseado"


const getUserImage = computed(() => {

  if(!isRh.value && !isAdmin.value && !isBoss.value){
    photoUUID.value = getUserPhotoUUID.value;
  }

  if (photoUUID.value === null || photoUUID.value === undefined) {
    return getS3FileUrl(getUserImagesPath, "default_user_icon.png");
  } else {
    return getS3FileUrl(getUserImagesPath, photoUUID.value);
  }
});



const {
  frontPageData,
  personalData,
  documentsData,
  recruitingMeansData,
  familyReferencesData,
  commercialReferencesData,
  familyFathersData,
  familySonsData,
  educationData,
  machineryData,
  toolsData,
  measuringInstrumentsData,
  otherToolsData,
  officesData,
  laboralExperienceData,
  savedApplication,
  viewingApplication,
  updatingApplication,
  drivingLicenceData
} = storeToRefs(useRequest);

const requiredFieldsOnThisPage = computed(() => [name.value, firstLastName.value, secondLastName.value, wantedSalary.value, genderChoosed.value])

onMounted(() => {
  if (viewingApplication.value || updatingApplication.value) {
    setSavedStoredValues();
    if (updatingApplication.value) {
      setAllStoredValues();
    }
  } else {
    loadLocalStore();
    setStoredValues();
  }
});

const validateRequiredFields = () => {
  nameRef.value.validate()
  firstLastNameRef.value.validate()
  secondLastNameRef.value.validate()
  wantedSalaryRef.value.validate()

  if(!genderChoosed.value){
    $q.notify(notifyNegativeField("Selecciona tu sexo por favor"))
  }

};

//JAJAJA SPANGLISH
//He llegado a un punto que no quiero ni refactorizar el JSON del stored procedure
//Por si falla algo mejor asi lo dejamos
const setSavedStoredValues = () => {
  if (!savedApplication.value) {
    console.log("Theres no saved application");
    return;
  }

  name.value = savedApplication.value.nombre;
  firstLastName.value = savedApplication.value.apellido_paterno;
  secondLastName.value = savedApplication.value.apellido_materno;
  wantedSalary.value = savedApplication.value.sueldo_deseado;
  genderChoosed.value = savedApplication.value.sexo;
  photoUUID.value = savedApplication.value.foto_uuid;
};

const setAllStoredValues = () => {
  frontPageData.value.name = savedApplication.value.nombre;
  frontPageData.value.firstLastName = savedApplication.value.apellido_paterno;
  frontPageData.value.secondLastName = savedApplication.value.apellido_materno;
  frontPageData.value.wantedSalary = savedApplication.value.sueldo_deseado;
  frontPageData.value.gender = savedApplication.value.sexo;

  setPersonalDataSavedValues();
  setDocumentsSavedValues();
  setRecruitingMeansSavedValues();
  setEducationSavedValues();
  setFilesJsonSavedValues();
};

const setPersonalDataSavedValues = () => {
  //Datos personales 1
  personalData.value.civilStatus = savedApplication.value.estado_civil;
  personalData.value.homeProperty = savedApplication.value.tipo_vivienda;
  personalData.value.homeAddress = savedApplication.value.domicilio;
  personalData.value.state = savedApplication.value.estado;
  personalData.value.city = savedApplication.value.ciudad;
  personalData.value.birthPlace = savedApplication.value.lugar_nacimiento;
  personalData.value.birthDate = savedApplication.value.fecha_nacimiento;
  personalData.value.phone = savedApplication.value.telefono;
  personalData.value.email = savedApplication.value.email;
  personalData.value.height = savedApplication.value.estatura;
  personalData.value.weight = savedApplication.value.peso;
  personalData.value.bloodType = savedApplication.value.tipo_sangre;
  personalData.value.roomie = savedApplication.value.vive_con;
  personalData.value.dependents = savedApplication.value.numero_dependientes;
  personalData.value.kinship = savedApplication.value.dependientes_parentesco;
  personalData.value.amount = savedApplication.value.monto_renta;
  personalData.value.clubs = savedApplication.value.club_perteneciente;
  personalData.value.goalInLife = savedApplication.value.meta_vida;
  personalData.value.zipcode = savedApplication.value.codigo_postal;
  personalData.value.colony = savedApplication.value.colonia;

  //Datos personales 2
  personalData.value.diseases = savedApplication.value.padecimiento;
  personalData.value.allergies = savedApplication.value.alergia_medicamento;
  personalData.value.brand = savedApplication.value.automovil_marca_modelo;
  personalData.value.incomesConcept = savedApplication.value.otro_ingreso;
};

const setDocumentsSavedValues = () => {
  documentsData.value.rfc = savedApplication.value.rfc;
  documentsData.value.imss = savedApplication.value.numero_imss;
  documentsData.value.afore = savedApplication.value.numero_afore;
  documentsData.value.fm2 = savedApplication.value.extranjero_numero_fm2;
};

const setRecruitingMeansSavedValues = () => {
  recruitingMeansData.value.medium = savedApplication.value.medio_reclutamiento;
  recruitingMeansData.value.relative =
    savedApplication.value.familiar_en_turbomaquinas;
  recruitingMeansData.value.department =
    savedApplication.value.familiar_departamento;
  recruitingMeansData.value.sindicate = savedApplication.value.sindicato;
};

const setEducationSavedValues = () => {
  educationData.value.secondary = savedApplication.value.secundaria;
  educationData.value.highSchool = savedApplication.value.bachillerato;
  educationData.value.professional = savedApplication.value.profesional;

  educationData.value.master = savedApplication.value.maestria;
  educationData.value.other = savedApplication.value.otro;
  educationData.value.speciality = savedApplication.value.especialidad;
  educationData.value.languages = savedApplication.value.idiomas_dominados;
  educationData.value.schedules = savedApplication.value.horarios_actual;
  educationData.value.secondarySpeciality =
    savedApplication.value.secundaria_especialidad === "null"
      ? ""
      : savedApplication.value.secundaria_especialidad;
  educationData.value.highSchoolSpeciality =
    savedApplication.value.bachillerato_especialidad;
  educationData.value.professionalSpeciality =
    savedApplication.value.profesional_especialidad;
  educationData.value.masterSpeciality =
    savedApplication.value.maestria_especialidad;
  educationData.value.otherSpeciality =
    savedApplication.value.otro_especialidad;
  educationData.value.currentInstitution =
    savedApplication.value.institucion_actual;
  educationData.value.currentSpeciality =
    savedApplication.value.especialidad_actual;
  educationData.value.dateStartSecondary =
    savedApplication.value.secundaria_fecha_inicio;
  educationData.value.dateEndSecondary =
    savedApplication.value.secundaria_fecha_fin;
  educationData.value.dateStartHighSchool =
    savedApplication.value.bachillerato_fecha_inicio;
  educationData.value.dateEndHighSchool =
    savedApplication.value.bachillerato_fecha_fin;
  educationData.value.dateStartProfessional =
    savedApplication.value.profesional_fecha_inicio;
  educationData.value.dateEndProfessional =
    savedApplication.value.profesional_fecha_fin;
  educationData.value.dateStartMaster =
    savedApplication.value.maestria_fecha_inicio;
  educationData.value.dateEndMaster = savedApplication.value.maestria_fecha_fin;
  educationData.value.dateStartOther = savedApplication.value.otro_fecha_inicio;
  educationData.value.dateEndOther = savedApplication.value.otro_fecha_fin;
  educationData.value.isPublicSecondary =
    savedApplication.value.secundaria_publica === 1 ? true : false;
  educationData.value.isPublicHighSchool =
    savedApplication.value.bachillerato_publico === 1 ? true : false;
  educationData.value.isPublicProfessional =
    savedApplication.value.profesional_publico === 1 ? true : false;
  educationData.value.isPublicMaster =
    savedApplication.value.maestria_publica === 1 ? true : false;
  educationData.value.isPublicOther =
    savedApplication.value.otro_publico === 1 ? true : false;
  educationData.value.isPublicCurrent =
    savedApplication.value.publica_actual === 1 ? true : false;
  educationData.value.certifiedSecondary =
    savedApplication.value.secundaria_certificado === 1 ? true : false;
  educationData.value.notCertifiedSecondary = educationData.value
    .certifiedSecondary
    ? false
    : true;
  educationData.value.certifiedHighSchool =
    savedApplication.value.bachillerato_certificado === 1 ? true : false;
  educationData.value.notCertifiedHighSchool = educationData.value
    .certifiedHighSchool
    ? false
    : true;
  educationData.value.certifiedProfessional =
    savedApplication.value.profesional_certificado === 1 ? true : false;
  educationData.value.notCertifiedProfessional = educationData.value
    .certifiedProfessional
    ? false
    : true;
  educationData.value.certifiedMaster =
    savedApplication.value.maestria_certificado === 1 ? true : false;
  educationData.value.notCertifiedMaster = educationData.value.certifiedMaster
    ? false
    : true;
  educationData.value.certifiedOther =
    savedApplication.value.otro_certificado === 1 ? true : false;
  educationData.value.notCertifiedOther = educationData.value.certifiedOther
    ? false
    : true;
  educationData.value.currentlyStudying =
    savedApplication.value.estudia_actualmente === 1 ? true : false;
  educationData.value.currentlyNotStudying = educationData.value
    .currentlyStudying
    ? false
    : true;
  educationData.value.selectedProfesional =
    savedApplication.value.profesional_especialidad;
  educationData.value.professionalLicence = savedApplication.value.no_cedula_profesional;
};

const setFilesJsonSavedValues = () => {
  familyReferencesData.value = savedApplication.value.referencias_familiares;
  commercialReferencesData.value =
    savedApplication.value.referencias_comerciales;

    familyFathersData.value = [];
    savedApplication.value.datos_familiares.forEach((element) => {
      if (element.job != null) {
        familyFathersData.value.push(element);
      }
    });



  if (familySonsData.value.length === 0) {
    savedApplication.value.datos_familiares.forEach((element) => {
      if (element.son != null) {
        familySonsData.value.push(element);
      }
    });
  }

  if (machineryData.value.length === 0) {
    savedApplication.value.manejo_maquinas_herramientas.forEach((element) => {
      if (element.name != null) {
        machineryData.value.push(element);
      }
    });
  }

  if (toolsData.value.length === 0) {
    savedApplication.value.manejo_maquinas_herramientas.forEach((element) => {
      if (element.toolName != null) {
        toolsData.value.push(element);
      }
    });
  }

  if (measuringInstrumentsData.value.length === 0) {
    savedApplication.value.manejo_maquinas_herramientas.forEach((element) => {
      if (element.measuringInstrumentName != null) {
        measuringInstrumentsData.value.push(element);
      }
    });
  }

  if (otherToolsData.value.length === 0) {
    savedApplication.value.manejo_maquinas_herramientas.forEach((element) => {
      if (element.otherToolName != null) {
        otherToolsData.value.push(element);
      }
    });
  }

  drivingLicenceData.value = savedApplication.value.licencias_manejo;
  officesData.value = savedApplication.value.conocimientos_oficios;
  laboralExperienceData.value = savedApplication.value.experiencia_laboral;
};

const setStoredValues = () => {
  name.value = frontPageData.value.name;
  firstLastName.value = frontPageData.value.firstLastName;
  secondLastName.value = frontPageData.value.secondLastName;
  wantedSalary.value = frontPageData.value.wantedSalary;
  genderChoosed.value = frontPageData.value.gender;
  //TODO: Añadir foto
};

const updateStore = () => {
  if (viewingApplication.value) return;

  frontPageData.value.name = name.value;
  frontPageData.value.firstLastName = firstLastName.value;
  frontPageData.value.secondLastName = secondLastName.value;
  frontPageData.value.wantedSalary = wantedSalary.value;
  frontPageData.value.gender = genderChoosed.value;

};


const clean = () => {
  name.value = "";
  firstLastName.value = "";
  secondLastName.value = "";
  wantedSalary.value = "";
};



const saveLocalStore = () => {
  if(!viewingApplication.value && !updatingApplication.value){
    useLocalStorage.save("frontpage", frontPageData.value);
    $q.notify(notifyPositive("Se ha guardado su progreso.",1000));
  }
};

const loadLocalStore = () => {
  const localStoreData = useLocalStorage.load("frontpage");

  if (localStoreData) frontPageData.value = localStoreData;
};
</script>

<style scoped>
.input-brand {
  width: 70%;
  margin-left: 20%;
}

.content {
  height: 100%;
  background-color: rgb(40, 55, 68);
  padding-top: 2%;
}
.file-picker {
  width: 80%;
  margin-left: 1%;
  flex: 1;
  text-align: center;
}

.rounded-borders {
  border-radius: 15px;
  background-color: #ffffff;
}

.motive-content {
  background-color: #ffffff;
  height: 500%;
  width: 80%;
  margin-left: 4%;
}

.priority-title {
  color: rgb(0, 0, 0);
  font-size: larger;
}

.gender-content {
  margin-left: 10%;
}

.gender-title {
  color: rgb(255, 255, 255);
}

.checkbox {
  margin-left: 3%;
  color: black;
}

.title-check {
  margin: 0%;
  font-size: 15px;
  color: aliceblue;
  padding-left: 5%;
}

.title {
  font-size: large;
  color: rgb(40, 55, 68);
}

.q-card {
  border-radius: 10px;
  vertical-align: top;
  background: rgba(49, 49, 49, 0.473) 51%;
  position: relative;
  height: 75%;
  width: 75%;
  margin-left: 23.5%;
  margin-top: 2%;
}

.card-frontpage {
  display: relative;
  justify-content: center;
  align-items: center;
}

.btn-clean {
  text-align: center;
  width: 13%;
  margin-left: 85%;
}
</style>
