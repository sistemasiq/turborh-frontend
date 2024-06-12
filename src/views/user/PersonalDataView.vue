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
        ></pagination-application>
        <div style="margin-top: 6%">
        <q-card flat bordered text-color="white"
  class="q-mb-lg"
  style="margin-left: 0%; border-color: rgb(255, 248, 43);
  background-color: transparent; color: white; width: 100%; height: 80px;"
  v-if="!viewingApplication"
>
  <q-card-section>
    <div class="text-body1 text-weight-medium row">
      <q-icon name="warning" class="q-mr-md q-mt-xs" />
      Nota
    </div>
    <p class="text-body2">
     Todos los campos de esta pantalla son requeridos excepto los que tienen la etiqueta "Opcional"
    </p>
  </q-card-section>
</q-card>

          <q-form class="q-gutter-md">
            <div style="display: flex; flex-grow: 1" class="q-ml-md">
              <q-input
              dark
              outlined
              color="cyan-1"
              v-model="homeAddress"
              type="text"
              label="Domicilio *"
              label-color="white"
              lazy-rules
              :rules="[
                (value) => !!value || 'Este campo no puede estar vacío.',
              ]"
              :readonly="viewingApplication"
              class="full-width"
              @update:model-value="updateStore()"
            >
            </q-input>
            <q-input
              dark
              outlined
              color="cyan-1"
              v-model="cologne"
              type="text"
              label="Colonia *"
              label-color="white"
              lazy-rules
              :rules="[
                (value) => !!value || 'Este campo no puede estar vacío.',
              ]"
              :readonly="viewingApplication"
              class="full-width q-pl-md"
              @update:model-value="updateStore()"
            >
            </q-input>
            <q-input
              dark
              outlined
              color="cyan-1"
              v-model="postcode"
              type="text"
              label="Código Postal *"
              label-color="white"
              mask="#####"
              lazy-rules
              :rules="[
                (value) => !!value || 'Este campo no puede estar vacío.',
              ]"
              :readonly="viewingApplication"
              class="col-1 q-pl-md"
              @update:model-value="updateStore()"
            >
            </q-input>
            </div>

            <div style="display: flex; flex-grow: 1" class="q-ml-md">
              <q-select
                dark
                outlined
                v-model="state"
                :options="states"
                label="Estado *"
                color="white"
                class="full-width"
                :readonly="viewingApplication"
                @update:model-value="updateStore()"
              />

              <q-select
                dark
                outlined
                v-model="city"
                :options="cities[state]"
                label="Ciudad *"
                color="white"
                class="full-width q-pl-md"
                :readonly="!state || viewingApplication"
                @update:model-value="updateStore()"
              />

              <q-input
                dark
                outlined
                color="cyan-1"
                v-model="birthPlace"
                label="Lugar de nacimiento *"
                label-color="white"
                lazy-rules
                :rules="[
                  (value) => !!value || 'Este campo no puede estar vacío.',
                ]"
                :readonly="viewingApplication"
                class="full-width q-pl-md"
                @update:model-value="updateStore()"
              >
              </q-input>

              <q-input
                class="full-width q-pl-md"
                hint="AAAA/MM/DD"
                hide-hint
                label="Fecha de nacimiento *"
                v-model="birthDate"
                mask="####/##/##"
                dark
                outlined
                color="cyan-1"
                :readonly="viewingApplication"
                @update:model-value="updateStore()"
              >
                <template v-slot:append>
                  <q-icon name="event" class="cursor-pointer">
                    <q-popup-proxy
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
                dark
                outlined
                color="cyan-1"
                v-model="phone"
                label="Telefono *"
                label-color="white"
                lazy-rules
                mask="##########"
                :rules="[
                  (value) => !!value || 'Este campo no puede estar vacío.',
                ]"
                :readonly="viewingApplication"
                class="full-width"
                @update:model-value="updateStore()"
              >
              </q-input>

              <q-input
                dark
                outlined
                color="cyan-1"
                v-model="height"
                label="Estatura(m) *"
                label-color="white"
                mask="#.##"
                fill-mask="0"
                lazy-rules
                :rules="[
                  (value) => !!value || 'Este campo no puede estar vacío.',
                ]"
                :readonly="viewingApplication"
                class="full-width q-pl-md"
                @update:model-value="updateStore()"
              >
              </q-input>

              <q-input
                dark
                outlined
                color="cyan-1"
                v-model="weight"
                label="Peso(kg) *"
                label-color="white"
                mask="###.#"
                reverse-fill-mask
                fill-mask="0"
                lazy-rules
                :rules="[
                  (value) => !!value || 'Este campo no puede estar vacío.',
                ]"
                class="full-width q-pl-md"
                :readonly="viewingApplication"
                @update:model-value="updateStore()"
              >
              </q-input>

              <q-input
                dark
                outlined
                color="cyan-1"
                v-model="bloodType"
                label="Tipo de sangre *"
                label-color="white"
                mask=""
                len
                lazy-rules
                :rules="[
                  (value) => !!value || 'Este campo no puede estar vacío.',
                ]"
                :readonly="viewingApplication"
                class="full-width q-pl-md"
                @update:model-value="updateStore()"
              >
              </q-input>
            </div>

            <div style="display: flex; flex-grow: 1" class="q-ml-md">
              <q-select
                :readonly="viewingApplication"
                v-model="currentCivilStatus"
                :options="civilStatus"
                label="Estado civil *"
                outlined
                color="cyan-1"
                label-color="white"
                dark
                class="full-width"
                @update:model-value="updateStore()"
              />

              <q-input
                dark
                outlined
                color="cyan-1"
                v-model="roomie"
                label="¿Con quién vive? *"
                label-color="white"
                lazy-rules
                :rules="[
                  (value) => !!value || 'Este campo no puede estar vacío.',
                ]"
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
              <BadgeOptional></BadgeOptional>
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
                :rules="[
                  (value) => !!value || 'Este campo no puede estar vacío.',
                ]"
                :readonly="viewingApplication"
                class="full-width q-pl-md"
                @update:model-value="updateStore()"
              >
              </q-input>
            </div>

            <div style="display: flex; flex-grow: 1" class="q-ml-md">
              <q-select
                :readonly="viewingApplication"
                v-model="currentHomeStatus"
                :options="homeStatus"
                label="La casa que habita es: *"
                outlined
                color="cyan-1"
                label-color="white"
                dark
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
                :rules="[
                  (value) => !!value || 'Este campo no puede estar vacío.',
                ]"
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
              <BadgeOptional></BadgeOptional>
              </q-input>
            </div>

            <q-input
              dark
              outlined
              color="cyan-1"
              v-model="goalInLife"
              label="Meta en la vida *"
              label-color="white"
              lazy-rules
              :rules="[
                (value) => !!value || 'Este campo no puede estar vacío.',
              ]"
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
    <ButtonApplicationStatus v-if="updatingApplication" :required-fields="requiredFieldsOnThisPage"/>
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
const cologne = ref("");
const postcode = ref("");

const {
  personalData,
  savedApplication,
  viewingApplication,
  updatingApplication,
} = storeToRefs(useRequest);

const requiredFieldsOnThisPage = computed(() => [
  homeAddress.value,
  cologne.value,
  postcode.value,
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
  cologne.value = savedApplication.value.colonia;
  postcode.value = savedApplication.value.codigo_postal;
  state.value = savedApplication.value.estado;
  city.value = savedApplication.value.ciudad;
  birthPlace.value = savedApplication.value.lugar_nacimiento;
  birthDate.value = savedApplication.value.fecha_nacimiento;
  phone.value = savedApplication.value.telefono;
  height.value = savedApplication.value.estatura;
  //NOTA: Multiplico el valor por diez por que al registrar un valor como 120.0 la mask lo deja como 012.0
  //Asi me aseguro que parsee de forma correcta el valor
  weight.value = savedApplication.value.peso * 10;
  bloodType.value = savedApplication.value.tipo_sangre;
  roomie.value = savedApplication.value.vive_con;
  dependents.value = savedApplication.value.numero_dependientes;
  kinship.value = savedApplication.value.dependientes_parentesco;
  amount.value = savedApplication.value.monto_renta;
  clubs.value = savedApplication.value.club_perteneciente;
  goalInLife.value = savedApplication.value.meta_vida;
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
  cologne.value = personalData.value.cologne;
  postcode.value = personalData.value.postcode;
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

  personalData.value.civilStatus = currentCivilStatus.value.charAt(0);

  personalData.value.homeProperty = currentHomeStatus.value;

  personalData.value.homeAddress = homeAddress.value;
  personalData.value.cologne = cologne.value;
  personalData.value.postcode = postcode.value;
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
  cologne.value = "";
  postcode.value = "";
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
  useLocalStorage.save("personalData", personalData.value);

  if (!viewingApplication.value && !updatingApplication.value) {
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
