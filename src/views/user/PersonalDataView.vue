<template>
  <q-layout
    style="background-color: rgb(30, 61, 88)"
    v-on:vnode-unmounted="saveLocalStore()"
  >
    <q-card>
      <q-card-section class="title">
        Datos Personales y Aspiraciones
      </q-card-section>
      <q-card-section>
        <pagination-application
          :page="2"
          :required-fields="requiredFieldsOnThisPage"
          @on-field-validation="validateRequiredFields"
        ></pagination-application>
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
                Todos los campos de esta pantalla son requeridos excepto los que
                tienen la etiqueta "Opcional"
              </p>
            </q-card-section>
          </q-card>

          <q-form class="q-gutter-md">
            <div style="display: flex; flex-grow: 1" class="q-ml-md">
              <q-input
                ref="homeAddressRef"
                dark
                outlined
                color="cyan-1"
                v-model="homeAddress"
                type="text"
                label="Domicilio *"
                label-color="white"
                lazy-rules
                :rules="[ruleFieldRequired]"
                :readonly="viewingApplication"
                class="full-width"
                @update:model-value="updateStore()"
              >
              </q-input>
              <q-input
                ref="colonyRef"
                dark
                outlined
                color="cyan-1"
                v-model="colony"
                type="text"
                label="Colonia *"
                label-color="white"
                lazy-rules
                :rules="[ruleFieldRequired]"
                :readonly="viewingApplication"
                class="full-width q-pl-md"
                @update:model-value="updateStore()"
              >
              </q-input>
              <q-input
                ref="zipcodeRef"
                dark
                outlined
                color="cyan-1"
                v-model="zipcode"
                type="text"
                label="Código Postal *"
                label-color="white"
                mask="#####"
                lazy-rules
                :rules="[ruleFieldRequired]"
                :readonly="viewingApplication"
                class="col-1 q-pl-md"
                @update:model-value="updateStore()"
              >
              </q-input>
            </div>

            <div style="display: flex; flex-grow: 1" class="q-ml-md">
              <q-select
                ref="stateRef"
                dark
                outlined
                v-model="state"
                :options="states"
                label="Estado *"
                color="white"
                class="full-width"
                :rules="[ruleFieldRequired]"
                :readonly="viewingApplication"
                @update:model-value="updateStore()"
              />

              <q-select
                ref="cityRef"
                dark
                outlined
                v-model="city"
                :options="cities[state]"
                label="Ciudad *"
                color="white"
                class="full-width q-pl-md"
                :rules="[ruleFieldRequired]"
                :readonly="!state || viewingApplication"
                @update:model-value="updateStore()"
              />

              <q-input
                ref="birthPlaceRef"
                dark
                outlined
                color="cyan-1"
                v-model="birthPlace"
                label="Lugar de nacimiento *"
                label-color="white"
                lazy-rules
                :rules="[ruleFieldRequired]"
                :readonly="viewingApplication"
                class="full-width q-pl-md"
                @update:model-value="updateStore()"
              >
              </q-input>

              <q-input
                ref="birthDateRef"
                class="full-width q-pl-md"
                mask="####-##-##"
                hint="AAAA-MM-DD"
                hide-hint
                label="Fecha de nacimiento *"
                v-model="birthDate"
                dark
                outlined
                color="cyan-1"
                :rules="[ruleFieldRequired]"
                :readonly="viewingApplication"
                @update:model-value="updateStore()"
              >
                <template v-slot:append>
                  <q-icon name="event" class="cursor-pointer">
                    <q-popup-proxy
                      v-if="!viewingApplication"
                      cover
                      transition-show="scale"
                      transition-hide="scale"
                    >
                      <q-date
                        locale="es"
                        :readonly="viewingApplication"
                        color="cyan"
                        v-model="birthDate"
                        @update:model-value="updateStore()"
                        mask="YYYY-MM-DD"
                      >
                        <div class="row items-center justify-end">
                          <q-btn
                            v-close-popup
                            label="Cerrar"
                            color="primary"
                            flat
                          />
                        </div>
                      </q-date>
                    </q-popup-proxy>
                  </q-icon>
                </template>
              </q-input>
            </div>

            <div style="display: flex; flex-grow: 1" class="q-ml-md">
              <q-input
                ref="phoneRef"
                dark
                outlined
                color="cyan-1"
                v-model="phone"
                label="Telefono *"
                label-color="white"
                lazy-rules
                mask="##########"
                :rules="[ruleFieldRequired]"
                :readonly="viewingApplication"
                class="full-width"
                @update:model-value="updateStore()"
              >
              </q-input>

              <q-input
                ref="heightRef"
                dark
                outlined
                color="cyan-1"
                v-model="height"
                label="Estatura(m) *"
                label-color="white"
                lazy-rules
                :rules="[ruleFieldRequired]"
                :readonly="viewingApplication"
                class="full-width q-pl-md"
                @update:model-value="updateStore()"
              >
              </q-input>

              <q-input
                ref="weightRef"
                dark
                outlined
                color="cyan-1"
                v-model="weight"
                label="Peso(kg) *"
                label-color="white"
                lazy-rules
                :rules="[ruleFieldRequired]"
                class="full-width q-pl-md"
                :readonly="viewingApplication"
                @update:model-value="updateStore()"
              >
              </q-input>

              <q-input
                ref="bloodTypeRef"
                dark
                outlined
                color="cyan-1"
                v-model="bloodType"
                label="Tipo de sangre *"
                label-color="white"
                mask=""
                len
                lazy-rules
                :rules="[ruleFieldRequired]"
                :readonly="viewingApplication"
                class="full-width q-pl-md"
                @update:model-value="updateStore()"
              >
              </q-input>
            </div>

            <div style="display: flex; flex-grow: 1" class="q-ml-md">
              <q-select
                ref="currentCivilStatusRef"
                :readonly="viewingApplication"
                v-model="currentCivilStatus"
                :options="civilStatus"
                label="Estado civil *"
                outlined
                color="cyan-1"
                label-color="white"
                dark
                :rules="[ruleFieldRequired]"
                class="full-width"
                @update:model-value="updateStore()"
              />

              <q-input
                ref="roomieRef"
                dark
                outlined
                color="cyan-1"
                v-model="roomie"
                label="¿Con quién vive? *"
                label-color="white"
                lazy-rules
                :rules="[ruleFieldRequired]"
                :readonly="viewingApplication"
                class="full-width q-pl-md"
                @update:model-value="updateStore()"
              >
              </q-input>

              <q-input
                dark
                outlined
                color="cyan-1"
                v-model="dependents"
                label="No. Dependientes"
                hint="Cuantas personas dependen de usted"
                hide-hint
                label-color="white"
                mask="##"
                :readonly="viewingApplication"
                class="full-width q-pl-md"
                @update:model-value="updateStore()"
              >
                <BadgeOptional class="self-center" />
              </q-input>

              <q-input
                v-if="dependents && dependents > 0"
                hint="Parentesco de las personas de dependen de usted. Ej: Hijos, Padres, etc."
                hide-hint
                dark
                outlined
                color="cyan-1"
                v-model="kinship"
                label="Parentesco"
                label-color="white"
                lazy-rules
                :rules="[ruleFieldRequired]"
                :readonly="viewingApplication"
                class="full-width q-pl-md"
                @update:model-value="updateStore()"
              >
              </q-input>
            </div>

            <div style="display: flex; flex-grow: 1" class="q-ml-md">
              <q-select
                ref="currentHomeStatusRef"
                :readonly="viewingApplication"
                v-model="currentHomeStatus"
                :options="homeStatus"
                label="La casa que habita es: *"
                outlined
                color="cyan-1"
                label-color="white"
                dark
                :rules="[ruleFieldRequired]"
                style="width: 37%"
                :style="
                  currentHomeStatus === 'Paga renta'
                    ? 'width: 37%'
                    : 'width: 32%'
                "
                @update:model-value="updateStore()"
              />

              <q-input
                v-if="currentHomeStatus === 'Paga renta'"
                dark
                outlined
                color="cyan-1"
                v-model="amount"
                label="Monto  *"
                label-color="white"
                lazy-rules
                mask="######"
                prefix="$ MXN"
                :rules="[ruleFieldRequired]"
                :readonly="viewingApplication"
                class="q-pl-md"
                style="width: 15%"
                @update:model-value="updateStore()"
              >
              </q-input>

              <q-input
                dark
                outlined
                color="cyan-1"
                v-model="clubs"
                label="Clubes sociales, deportivos, culturales o políticos a los que pertenece"
                label-color="white"
                class="full-width q-pl-md"
                :readonly="viewingApplication"
                @update:model-value="updateStore()"
              >
                <BadgeOptional class="self-center" />
              </q-input>
            </div>

            <q-input
              ref="goalInLifeRef"
              dark
              outlined
              color="cyan-1"
              v-model="goalInLife"
              label="Meta en la vida *"
              label-color="white"
              lazy-rules
              :rules="[ruleFieldRequired]"
              :readonly="viewingApplication"
              class="q-pb-md"
              @update:model-value="updateStore()"
            >
            </q-input>
          </q-form>
        </div>
        <br />
        <div class="column q-mt-xl">
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
        </div>
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
import PaginationApplication from "src/components/PaginationApplication.vue";
import ButtonApplicationStatus from "src/components/ButtonApplicationStatus.vue";
import BadgeOptional from "src/components/BadgeOptional.vue";
import { useRequestUser } from "src/stores/requestUser";
import { storeToRefs } from "pinia";
import { useLocalStorageStore } from "src/stores/localStorage";
import { useQuasar } from "quasar";
import { notifyPositive } from "src/utils/notifies";
import { states, cities } from "src/utils/citiesStates.js";
import { ruleFieldRequired } from "src/utils/fieldRules";

const $q = useQuasar();

const useLocalStorage = useLocalStorageStore();
const useRequest = useRequestUser();

const civilStatus = ref(["Soltero", "Casado", "Viudo", "Union libre"]);
const currentCivilStatus = ref("");

const homeStatus = ref(["Propia", "De su familia", "Paga renta"]);
const currentHomeStatus = ref("");

const homeAddress = ref("");
const state = ref("");
const city = ref("");
const birthPlace = ref("");
const birthDate = ref("");
const phone = ref("");
const height = ref(0);
const weight = ref(0);
const bloodType = ref("");
const roomie = ref("");
const dependents = ref(0);
const kinship = ref("");
const amount = ref(0);
const clubs = ref("");
const goalInLife = ref("");
const colony = ref("");
const zipcode = ref("");

const homeAddressRef = ref(null);
const colonyRef = ref(null);
const zipcodeRef = ref(null);
const stateRef = ref(null);
const cityRef = ref(null);
const birthPlaceRef = ref(null);
const birthDateRef = ref(null);
const phoneRef = ref(null);
const heightRef = ref(null);
const weightRef = ref(null);
const bloodTypeRef = ref(null);
const currentCivilStatusRef = ref(null);
const roomieRef = ref(null);
const currentHomeStatusRef = ref(null);
const goalInLifeRef = ref(null);

const {
  personalData,
  savedApplication,
  viewingApplication,
  updatingApplication,
} = storeToRefs(useRequest);

const requiredFieldsOnThisPage = computed(() => [
  homeAddress.value,
  colony.value,
  zipcode.value,
  state.value,
  city.value,
  birthPlace.value,
  birthDate.value,
  phone.value,
  height.value,
  weight.value,
  bloodType.value,
  currentCivilStatus.value,
  roomie.value,
  currentHomeStatus.value,
  goalInLife.value,
]);

const validateRequiredFields = () => {
  homeAddressRef.value.validate();
  colonyRef.value.validate();
  zipcodeRef.value.validate();
  stateRef.value.validate();
  cityRef.value.validate();
  birthPlaceRef.value.validate();
  birthDateRef.value.validate();
  phoneRef.value.validate();
  heightRef.value.validate();
  weightRef.value.validate();
  bloodTypeRef.value.validate();
  currentCivilStatusRef.value.validate();
  roomieRef.value.validate();
  currentHomeStatusRef.value.validate();
  goalInLifeRef.value.validate();
};

onMounted(() => {
  loadLocalStore();
  if (viewingApplication.value || updatingApplication.value) {
    setSavedStoredValues();
  } else {
    setStoredValues();
  }
});

//This method set the values saved in the local storage into the variables
const setSavedStoredValues = () => {
  civilStatus.value.forEach((element) => {
    if (element.charAt(0) === savedApplication.value.estado_civil) {
      currentCivilStatus.value = element;
    }
  });

  currentHomeStatus.value = savedApplication.value.tipo_vivienda;

  homeAddress.value = savedApplication.value.domicilio;
  colony.value = savedApplication.value.colonia;
  zipcode.value = savedApplication.value.codigo_postal;
  state.value = savedApplication.value.estado;
  city.value = savedApplication.value.ciudad;
  birthPlace.value = savedApplication.value.lugar_nacimiento;
  birthDate.value = savedApplication.value.fecha_nacimiento;
  phone.value = savedApplication.value.telefono;
  height.value = savedApplication.value.estatura;
  //NOTA: Multiplico el valor por diez por que al registrar un valor como 120.0 la mask lo deja como 012.0
  //Asi me aseguro que parsee de forma correcta el valor
  weight.value = checkWeightValidValue(savedApplication.value.peso);
  bloodType.value = savedApplication.value.tipo_sangre;
  roomie.value = savedApplication.value.vive_con;
  dependents.value = savedApplication.value.numero_dependientes;
  kinship.value = savedApplication.value.dependientes_parentesco;
  amount.value = savedApplication.value.monto_renta;
  clubs.value = savedApplication.value.club_perteneciente;
  goalInLife.value = savedApplication.value.meta_vida;
};

const checkWeightValidValue = (currentWeight) => {
  if (currentWeight < 10.0) {
    currentWeight *= 10;

    if (currentWeight < 10.0) {
      currentWeight *= 10;
      return currentWeight;
    }

    return currentWeight;
  } else {
    return currentWeight;
  }
};

//Set the stored values in the store (pinia) in the local variables
const setStoredValues = () => {
  civilStatus.value.forEach((element) => {
    if (element.charAt(0) === personalData.value.civilStatus) {
      currentCivilStatus.value = element;
    }
  });

  currentHomeStatus.value = personalData.value.homeProperty;

  homeAddress.value = personalData.value.homeAddress;
  colony.value = personalData.value.colony;
  zipcode.value = personalData.value.zipcode;
  state.value = personalData.value.state;
  city.value = personalData.value.city;
  birthPlace.value = personalData.value.birthPlace;
  birthDate.value = personalData.value.birthDate;
  phone.value = personalData.value.phone;
  height.value = personalData.value.height;
  weight.value = personalData.value.weight;
  bloodType.value = personalData.value.bloodType;
  roomie.value = personalData.value.roomie;
  dependents.value = personalData.value.dependents;
  kinship.value = personalData.value.kinship;
  amount.value = personalData.value.amount;
  clubs.value = personalData.value.clubs;
  goalInLife.value = personalData.value.goalInLife;
};

//Updates the store (pinia) values with the new ones
const updateStore = () => {
  if (viewingApplication.value) return;

  console.log("UPDATE STORE CALLED");

  personalData.value.civilStatus = currentCivilStatus.value.charAt(0);

  personalData.value.homeProperty = currentHomeStatus.value;

  personalData.value.homeAddress = homeAddress.value;
  personalData.value.colony = colony.value;
  personalData.value.zipcode = zipcode.value;
  personalData.value.state = state.value;
  personalData.value.city = city.value;
  personalData.value.birthPlace = birthPlace.value;
  personalData.value.birthDate = birthDate.value;
  personalData.value.phone = phone.value;
  personalData.value.height = parseFloat(height.value);
  personalData.value.weight = parseFloat(weight.value);
  personalData.value.bloodType = bloodType.value;
  personalData.value.roomie = roomie.value;
  personalData.value.dependents = dependents.value;
  personalData.value.kinship = kinship.value;
  personalData.value.amount = amount.value;
  personalData.value.clubs = clubs.value;
  personalData.value.goalInLife = goalInLife.value;
};

//Clean the local variables
const clean = () => {
  homeAddress.value = "";
  colony.value = "";
  zipcode.value = "";
  state.value = "";
  city.value = "";
  birthPlace.value = "";
  birthDate.value = "";
  phone.value = "";
  email.value = "";
  height.value = "";
  weight.value = "";
  bloodType.value = "";
  roomie.value = "";
  dependents.value = "";
  kinship.value = "";
  amount.value = "";
  clubs.value = "";
  goalInLife.value = "";
  currentCivilStatus.value = "";
  currentHomeStatus.value = "";
};

//saves in the local storage store called "personalData" the whole object with the data of the user retrieved here
const saveLocalStore = () => {
  if (!viewingApplication.value && !updatingApplication.value) {
    useLocalStorage.save("personalData", personalData.value);
    $q.notify(notifyPositive("Se ha guardado su progreso.", 1000));
  }
};

//Loads the data in the local storage store "personalData"
const loadLocalStore = () => {
  const localStoreData = useLocalStorage.load("personalData");

  if (localStoreData) personalData.value = localStoreData;
};
</script>

<style scoped>
.btn-clean {
  text-align: center;
  margin-top: 0%;
  width: 10%;
  margin-left: 90%;
}

element.style {
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
}

.rounded-borders {
  border-radius: 15px;
  background-color: #ffffff;
}

.civilstatus-content {
  background-color: #ffffff;
  height: 10%;
  width: 30%;
}

:root {
  background: rgb(30, 61, 88);
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

.title {
  font-size: large;
  color: rgb(40, 55, 68);
}
</style>
