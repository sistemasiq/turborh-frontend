<template>
  <q-layout
    style="background-color: rgb(30, 61, 88)"
    v-on:vnode-unmounted="saveLocalStore()"
  >
    <q-card class="card-education">
      <q-card-section class="title"> Información Escolar</q-card-section>
      <q-card-section>
        <PaginationApplication :page="7" :required-fields="requiredFieldsOnThisPage"></PaginationApplication>
      </q-card-section>
      <q-card-section style="display: flex; margin-top: 3%">
        <div class="name">Nombre de la Institución</div>
        <div class="city">¿Qué estudió?</div>
        <div class="date">Fecha de inicio a fin</div>
        <div class="certificate">Certificado</div>
      </q-card-section>
      <q-form>
        <div style="display: flex; flex-grow: 1; margin-left: 1%">
          <q-input
            dark
            outlined
            color="cyan-1"
            v-model="secondary"
            label="Secundaria *"
            label-color="white"
            class="input-brand"
            style="width: 16%; margin-left: 1%"
            :readonly="viewingApplication"
            @update:model-value="updateStore()"
          >
          </q-input>

          <q-input
            dark
            outlined
            color="cyan-1"
            v-model="secondarySpeciality"
            label="Especificar *"
            label-color="white"
            class="input-brand"
            style="width: 16%; margin-left: 1%"
            :readonly="viewingApplication"
            @update:model-value="updateStore()"
          >
          </q-input>

          <q-input
            filled
            v-model="dateStartSecondary"
            mask="####/##/##"
            lazy-rules
            :rules="[dateRule]"
            label="AAAA/MM/DD *"
            dark
            outlined
            color="cyan-1"
            style="width: 14%; margin-left: 2%"
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
                    v-model="dateStartSecondary"
                    :readonly="viewingApplication"
                    @update:model-value="updateStore()"
                  >
                    <div class="row items-center justify-end">
                      <q-btn v-close-popup label="Close" color="primary" flat />
                    </div>
                  </q-date>
                </q-popup-proxy>
              </q-icon>
            </template>
          </q-input>

          <q-input
            filled
            v-model="dateEndSecondary"
            mask="####/##/##"
            lazy-rules
            :rules="[dateRule]"
            label="AAAA/MM/DD *"
            dark
            outlined
            color="cyan-1"
            style="width: 14%; margin-left: 2%"
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
                    v-model="dateEndSecondary"
                    :readonly="viewingApplication"
                    @update:model-value="updateStore()"
                  >
                    <div class="row items-center justify-end">
                      <q-btn v-close-popup label="Close" color="primary" flat />
                    </div>
                  </q-date>
                </q-popup-proxy>
              </q-icon>
            </template>
          </q-input>

          <div class="secoundary-content" style="display: flex">
            <q-checkbox
              color="cyan"
              unchecked-icon="radio_button_unchecked"
              checked-icon="radio_button_checked"
              size="lg"
              class="checkbox"
              v-model="certifiedSecondary"
              @update:modelValue="handleSecondaryCheckboxChange('yes')"
              label="Sí"
              style="color: rgb(255, 255, 255); margin-left: 10%"
              :disable="viewingApplication"
            />
            <q-checkbox
              color="cyan"
              unchecked-icon="radio_button_unchecked"
              checked-icon="radio_button_checked"
              size="lg"
              class="checkbox"
              v-model="notCertifiedSecondary"
              @update:modelValue="handleSecondaryCheckboxChange('no')"
              label="No"
              style="color: rgb(255, 255, 255); margin-right: 10%"
              :disable="viewingApplication"
            />
          </div>

          <div class="public-content rounded-borders" style="display: flex">
            <q-checkbox
              v-model="isPublicSecondary"
              color="cyan"
              unchecked-icon="radio_button_unchecked"
              checked-icon="radio_button_checked"
              size="lg"
              class="checkbox"
              label="Esta institución fue publica"
              style="color: black"
              :disable="viewingApplication"
              @update:model-value="updateStore()"
            ></q-checkbox>
          </div>
        </div>

        <div style="display: flex; flex-grow: 1; margin-left: 1%">
          <q-input
            dark
            outlined
            color="cyan-1"
            v-model="highSchool"
            label="Bachillerato"
            label-color="white"
            class="input-brand"
            style="width: 16%; margin-left: 1%"
            :readonly="viewingApplication"
            @update:model-value="updateStore()"
          >
          </q-input>

          <q-input
            dark
            outlined
            color="cyan-1"
            v-model="highSchoolSpeciality"
            label="Especificar"
            label-color="white"
            class="input-brand"
            style="width: 16%; margin-left: 1%"
            :readonly="viewingApplication"
            @update:model-value="updateStore()"
          >
          </q-input>

          <q-input
            filled
            v-model="dateStartHighSchool"
            mask="####/##/##"
            lazy-rules
            :rules="[dateRule]"
            label="AAAA/MM/DD"
            dark
            outlined
            color="cyan-1"
            style="width: 14%; margin-left: 2%"
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
                    v-model="dateStartHighSchool"
                    :readonly="viewingApplication"
                    @update:model-value="updateStore()"
                  >
                    <div class="row items-center justify-end">
                      <q-btn v-close-popup label="Close" color="primary" flat />
                    </div>
                  </q-date>
                </q-popup-proxy>
              </q-icon>
            </template>
          </q-input>

          <q-input
            filled
            v-model="dateEndHighSchool"
            mask="####/##/##"
            lazy-rules
            :rules="[dateRule]"
            label="AAAA/MM/DD"
            dark
            outlined
            color="cyan-1"
            style="width: 14%; margin-left: 2%"
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
                    v-model="dateEndHighSchool"
                    :readonly="viewingApplication"
                    @update:model-value="updateStore()"
                  >
                    <div class="row items-center justify-end">
                      <q-btn v-close-popup label="Close" color="primary" flat />
                    </div>
                  </q-date>
                </q-popup-proxy>
              </q-icon>
            </template>
          </q-input>

          <div class="highschool-content" style="display: flex">
            <q-checkbox
              color="cyan"
              unchecked-icon="radio_button_unchecked"
              checked-icon="radio_button_checked"
              size="lg"
              class="checkbox"
              v-model="certifiedHighSchool"
              @update:modelValue="handleHighSchoolCheckboxChange('yes')"
              label="Sí"
              style="color: rgb(255, 255, 255); margin-left: 10%"
              :disable="viewingApplication"
            />
            <q-checkbox
              color="cyan"
              unchecked-icon="radio_button_unchecked"
              checked-icon="radio_button_checked"
              size="lg"
              class="checkbox"
              v-model="notCertifiedHighSchool"
              @update:modelValue="handleHighSchoolCheckboxChange('no')"
              label="No"
              style="color: rgb(255, 255, 255); margin-right: 10%"
              :disable="viewingApplication"
            />
          </div>

          <div class="public-content rounded-borders" style="display: flex">
            <q-checkbox
              v-model="isPublicHighSchool"
              color="cyan"
              unchecked-icon="radio_button_unchecked"
              checked-icon="radio_button_checked"
              size="lg"
              class="checkbox"
              label="Esta institución fue publica"
              style="color: black"
              :disable="viewingApplication"
              @update:model-value="updateStore()"
            ></q-checkbox>
          </div>
        </div>

        <div style="display: flex; flex-grow: 1; margin-left: 1%">
          <q-input
            dark
            outlined
            color="cyan-1"
            v-model="professional"
            label="Profesional"
            label-color="white"
            class="input-brand"
            style="width: 16%; margin-left: 1%"
            :readonly="viewingApplication"
            @update:model-value="updateStore()"
          >
          </q-input>

          <q-select
            dark
            outlined
            v-model="selectedProfesional"
            :options="careers"
            label="Selecciona tu carrera"
            color="white"
            class="selectprofessional"
            :readonly="viewingApplication"
            @update:model-value="updateStore()"
          />

          <q-input
            filled
            v-model="dateStartProfessional"
            mask="####/##/##"
            lazy-rules
            :rules="[dateRule]"
            label="AAAA/MM/DD"
            dark
            outlined
            color="cyan-1"
            style="width: 14%; margin-left: 2%"
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
                    v-model="dateStartProfessional"
                    :readonly="viewingApplication"
                    @update:model-value="updateStore()"
                  >
                    <div class="row items-center justify-end">
                      <q-btn v-close-popup label="Close" color="primary" flat />
                    </div>
                  </q-date>
                </q-popup-proxy>
              </q-icon>
            </template>
          </q-input>

          <q-input
            filled
            v-model="dateEndProfessional"
            mask="####/##/##"
            lazy-rules
            :rules="[dateRule]"
            label="AAAA/MM/DD"
            dark
            outlined
            color="cyan-1"
            style="width: 14%; margin-left: 2%"
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
                    v-model="dateEndProfessional"
                    :readonly="viewingApplication"
                    @update:model-value="updateStore()"
                  >
                    <div class="row items-center justify-end">
                      <q-btn v-close-popup label="Close" color="primary" flat />
                    </div>
                  </q-date>
                </q-popup-proxy>
              </q-icon>
            </template>
          </q-input>

          <div class="profesional-content" style="display: flex">
            <q-checkbox
              color="cyan"
              unchecked-icon="radio_button_unchecked"
              checked-icon="radio_button_checked"
              size="lg"
              class="checkbox"
              v-model="certifiedProfessional"
              @update:modelValue="handleProfesionalCheckboxChange('yes')"
              label="Sí"
              style="color: rgb(255, 255, 255); margin-left: 10%"
              :disable="viewingApplication"
            />
            <q-checkbox
              color="cyan"
              unchecked-icon="radio_button_unchecked"
              checked-icon="radio_button_checked"
              size="lg"
              class="checkbox"
              v-model="notCertifiedProfessional"
              @update:modelValue="handleProfesionalCheckboxChange('no')"
              label="No"
              style="color: rgb(255, 255, 255); margin-right: 10%"
              :disable="viewingApplication"
            />
          </div>

          <div class="public-content rounded-borders" style="display: flex">
            <q-checkbox
              v-model="isPublicProfessional"
              color="cyan"
              unchecked-icon="radio_button_unchecked"
              checked-icon="radio_button_checked"
              size="lg"
              class="checkbox"
              label="Esta institución fue publica"
              style="color: black"
              :disable="viewingApplication"
              @update:model-value="updateStore()"
            ></q-checkbox>
          </div>
        </div>

        <div style="display: flex; flex-grow: 1; margin-left: 1%">
          <q-input
            dark
            outlined
            color="cyan-1"
            v-model="master"
            label="Maestría"
            label-color="white"
            class="input-brand"
            style="width: 16%; margin-left: 1%"
            :readonly="viewingApplication"
            @update:model-value="updateStore()"
          >
          </q-input>

          <q-input
            dark
            outlined
            color="cyan-1"
            v-model="masterSpeciality"
            label="Especificar"
            label-color="white"
            class="input-brand"
            style="width: 16%; margin-left: 1%"
            :readonly="viewingApplication"
            @update:model-value="updateStore()"
          >
          </q-input>

          <q-input
            filled
            v-model="dateStartMaster"
            mask="####/##/##"
            lazy-rules
            :rules="[dateRule]"
            label="AAAA/MM/DD"
            dark
            outlined
            color="cyan-1"
            style="width: 14%; margin-left: 2%"
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
                    v-model="dateStartMaster"
                    :readonly="viewingApplication"
                    @update:model-value="updateStore()"
                  >
                    <div class="row items-center justify-end">
                      <q-btn v-close-popup label="Close" color="primary" flat />
                    </div>
                  </q-date>
                </q-popup-proxy>
              </q-icon>
            </template>
          </q-input>

          <q-input
            filled
            v-model="dateEndMaster"
            mask="####/##/##"
            lazy-rules
            :rules="[dateRule]"
            label="AAAA/MM/DD"
            dark
            outlined
            color="cyan-1"
            style="width: 14%; margin-left: 2%"
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
                    v-model="dateEndMaster"
                    :readonly="viewingApplication"
                    @update:model-value="updateStore()"
                  >
                    <div class="row items-center justify-end">
                      <q-btn v-close-popup label="Close" color="primary" flat />
                    </div>
                  </q-date>
                </q-popup-proxy>
              </q-icon>
            </template>
          </q-input>

          <div class="maestry-content" style="display: flex">
            <q-checkbox
              color="cyan"
              unchecked-icon="radio_button_unchecked"
              checked-icon="radio_button_checked"
              size="lg"
              class="checkbox"
              v-model="certifiedMaster"
              @update:modelValue="handleMasterCheckboxChange('yes')"
              label="Sí"
              style="color: rgb(255, 255, 255); margin-left: 10%"
              :disable="viewingApplication"
            />
            <q-checkbox
              color="cyan"
              unchecked-icon="radio_button_unchecked"
              checked-icon="radio_button_checked"
              size="lg"
              class="checkbox"
              v-model="notCertifiedMaster"
              @update:modelValue="handleMasterCheckboxChange('no')"
              label="No"
              style="color: rgb(255, 255, 255); margin-right: 10%"
              :disable="viewingApplication"
            />
          </div>

          <div class="public-content rounded-borders" style="display: flex">
            <q-checkbox
              v-model="isPublicMaster"
              color="cyan"
              unchecked-icon="radio_button_unchecked"
              checked-icon="radio_button_checked"
              size="lg"
              class="checkbox"
              label="Esta institución fue publica"
              style="color: black"
              :disable="viewingApplication"
              @update:model-value="updateStore()"
            ></q-checkbox>
          </div>
        </div>

        <div style="display: flex; flex-grow: 1; margin-left: 1%">
          <q-input
            dark
            outlined
            color="cyan-1"
            v-model="other"
            label="Otro"
            label-color="white"
            class="input-brand"
            style="width: 16%; margin-left: 1%"
            :readonly="viewingApplication"
            @update:model-value="updateStore()"
          >
          </q-input>

          <q-input
            dark
            outlined
            color="cyan-1"
            v-model="otherSpeciality"
            label="Especificar"
            label-color="white"
            class="input-brand"
            style="width: 16%; margin-left: 1%"
            :readonly="viewingApplication"
            @update:model-value="updateStore()"
          >
          </q-input>

          <q-input
            filled
            v-model="dateStartOther"
            mask="####/##/##"
            lazy-rules
            :rules="[dateRule]"
            label="AAAA/MM/DD"
            dark
            outlined
            color="cyan-1"
            style="width: 14%; margin-left: 2%"
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
                    v-model="dateStartOther"
                    :readonly="viewingApplication"
                    @update:model-value="updateStore()"
                  >
                    <div class="row items-center justify-end">
                      <q-btn v-close-popup label="Close" color="primary" flat />
                    </div>
                  </q-date>
                </q-popup-proxy>
              </q-icon>
            </template>
          </q-input>

          <q-input
            filled
            v-model="dateEndOther"
            mask="####/##/##"
            lazy-rules
            :rules="[dateRule]"
            label="AAAA/MM/DD"
            dark
            outlined
            color="cyan-1"
            style="width: 14%; margin-left: 2%"
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
                    v-model="dateEndOther"
                    :readonly="viewingApplication"
                    @update:model-value="updateStore()"
                  >
                    <div class="row items-center justify-end">
                      <q-btn v-close-popup label="Close" color="primary" flat />
                    </div>
                  </q-date>
                </q-popup-proxy>
              </q-icon>
            </template>
          </q-input>

          <div class="other-content" style="display: flex">
            <q-checkbox
              color="cyan"
              unchecked-icon="radio_button_unchecked"
              checked-icon="radio_button_checked"
              size="lg"
              class="checkbox"
              v-model="certifiedOther"
              @update:modelValue="handleOtherCheckboxChange('yes')"
              label="Sí"
              style="color: rgb(255, 255, 255); margin-left: 10%"
              :disable="viewingApplication"
            />
            <q-checkbox
              color="cyan"
              unchecked-icon="radio_button_unchecked"
              checked-icon="radio_button_checked"
              size="lg"
              class="checkbox"
              v-model="notCertifiedOther"
              @update:modelValue="handleOtherCheckboxChange('no')"
              label="No"
              style="color: rgb(255, 255, 255); margin-right: 10%"
              :disable="viewingApplication"
            />
          </div>

          <div class="public-content rounded-borders" style="display: flex">
            <q-checkbox
              v-model="isPublicOther"
              color="cyan"
              unchecked-icon="radio_button_unchecked"
              checked-icon="radio_button_checked"
              size="lg"
              class="checkbox"
              label="Esta institución fue publica"
              style="color: black"
              :disable="viewingApplication"
              @update:model-value="updateStore()"
            ></q-checkbox>
          </div>
        </div>

        <div style="display: flex; flex-grow: 1; margin-left: 1%">
          <q-input
            dark
            outlined
            color="cyan-1"
            mask="##########"
            v-model="professionalLicence"
            label="No. de cedula profesional"
            label-color="white"
            class="input-brand"
            style="width: 32%; margin-left: 1%"
            :readonly="viewingApplication"
            @update:model-value="updateStore()"
          >
          </q-input>

          <q-input
            dark
            outlined
            color="cyan-1"
            v-model="speciality"
            label="Especialidad"
            label-color="white"
            class="input-brand"
            style="width: 29%; margin-left: 2%"
            :readonly="viewingApplication"
            @update:model-value="updateStore()"
          >
          </q-input>

          <q-input
            dark
            outlined
            color="cyan-1"
            v-model="languages"
            label="Idiomas que domina"
            label-color="white"
            class="input-brand"
            style="width: 32%; margin-left: 2%; margin-bottom: 2%"
            :readonly="viewingApplication"
            @update:model-value="updateStore()"
          >
          </q-input>
        </div>

        <div
          style="
            display: flex;
            flex-grow: 1;
            margin-left: 1%;
            margin-bottom: 2%;
          "
        >
          <div
            class="study-content rounded-borders q-ml-sm"
            style="display: flex"
          >
            <p class="studytittle q-mt-md q-ml-sm">Estudia actualmente</p>
            <q-checkbox
              color="cyan"
              unchecked-icon="radio_button_unchecked"
              checked-icon="radio_button_checked"
              size="lg"
              class="checkbox"
              v-model="currentlyStudying"
              @update:modelValue="handlestudyCheckboxChange('yes')"
              label="Si"
              :disable="viewingApplication"
            />
            <q-checkbox
              color="cyan"
              unchecked-icon="radio_button_unchecked"
              checked-icon="radio_button_checked"
              size="lg"
              class="checkbox q-mr-md"
              v-model="currentlyNotStudying"
              @update:modelValue="handlestudyCheckboxChange('no')"
              label="No"
              :disable="viewingApplication"
            />
          </div>

          <q-input
            v-if="currentlyStudying"
            dark
            outlined
            color="cyan-1"
            v-model="currentInstitution"
            label="En qué institución"
            label-color="white"
            class="input-brand"
            style="width: 20%; margin-left: 1%; margin-right: 1%"
            :readonly="viewingApplication"
            @update:model-value="updateStore()"
          >
          </q-input>

          <q-input
            v-if="currentlyStudying"
            dark
            outlined
            color="cyan-1"
            v-model="currentSpeciality"
            label="¿Qué estudia?"
            label-color="white"
            class="input-brand"
            style="width: 20%; margin-left: 1%; margin-right: 1%"
            :readonly="viewingApplication"
            @update:model-value="updateStore()"
          >
          </q-input>

          <q-input
            v-if="currentlyStudying"
            dark
            outlined
            color="cyan-1"
            v-model="schedules"
            label="Horarios"
            label-color="white"
            class="input-brand"
            style="width: 20%; margin-left: 1%; margin-right: 1%"
            :readonly="viewingApplication"
            @update:model-value="updateStore()"
          >
          </q-input>

          <div
            v-if="currentlyStudying"
            class="ipublic-content rounded-borders"
            style="display: flex"
          >
            <q-checkbox
              v-model="isPublicCurrent"
              color="cyan"
              unchecked-icon="radio_button_unchecked"
              checked-icon="radio_button_checked"
              size="lg"
              class="checkbox"
              label="Esta institución es publica"
              style="color: black"
              :disable="viewingApplication"
              @update:model-value="updateStore()"
            ></q-checkbox>
          </div>
        </div>

        <div class="column">
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
      </q-form>
    </q-card>
    <ButtonApplicationStatus v-if="updatingApplication" />
  </q-layout>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import PaginationApplication from "src/components/PaginationApplication.vue";
import ButtonApplicationStatus from "src/components/ButtonApplicationStatus.vue";
import { useRequestUser } from "src/stores/requestUser";
import { useLocalStorageStore } from "src/stores/localStorage";
import { storeToRefs } from "pinia";
import { notifyPositive } from "src/utils/notifies";
import { useQuasar } from "quasar";

const $q = useQuasar();
const useRequest = useRequestUser();
const useLocalStorage = useLocalStorageStore();



const {
  educationData,
  savedApplication,
  viewingApplication,
  updatingApplication,
} = storeToRefs(useRequest);

const secondary = ref("");
const highSchool = ref("");
const master = ref("");
const other = ref("");
const professional = ref("");
const speciality = ref("");
const languages = ref("");
const schedules = ref("");
const secondarySpeciality = ref("");
const highSchoolSpeciality = ref("");
const masterSpeciality = ref("");
const otherSpeciality = ref("");
const currentInstitution = ref("");
const currentSpeciality = ref("");

const dateStartSecondary = ref("");
const dateEndSecondary = ref("");
const dateStartHighSchool = ref("");
const dateEndHighSchool = ref("");
const dateStartProfessional = ref("");
const dateEndProfessional = ref("");
const dateStartMaster = ref("");
const dateEndMaster = ref("");
const dateStartOther = ref("");
const dateEndOther = ref("");

const isPublicSecondary = ref(false);
const isPublicHighSchool = ref(false);
const isPublicProfessional = ref(false);
const isPublicMaster = ref(false);
const isPublicOther = ref(false);
const isPublicCurrent = ref(false);

const certifiedSecondary = ref(false);
const notCertifiedSecondary = ref(false);

const certifiedHighSchool = ref(false);
const notCertifiedHighSchool = ref(false);

const certifiedProfessional = ref(false);
const notCertifiedProfessional = ref(false);

const certifiedMaster = ref(false);
const notCertifiedMaster = ref(false);

const certifiedOther = ref(false);
const notCertifiedOther = ref(false);

const currentlyStudying = ref(false);
const currentlyNotStudying = ref(true);

const selectedProfesional = ref("");

const professionalLicence = ref(0);

const careers = [
  "Administración de Empresas",
  "Contabilidad",
  "Derecho",
  "Ingeniería Industrial",
  "Ingeniería Civil",
  "Medicina",
  "Psicología",
  "Ingeniería en Sistemas Computacionales",
  "Arquitectura",
  "Ciencias de la Comunicación",
  "Ingeniería en Electrónica",
  "Ingeniería Mecánica",
  "Ingeniería en Telecomunicaciones",
  "Enfermería",
  "Odontología",
  "Diseño Gráfico",
  "Ciencias Ambientales",
  "Ingeniería Química",
  "Mercadotecnia",
  "Relaciones Internacionales",
  "Carreras afines u otras"
];

const requiredFieldsOnThisPage = computed(() => [secondary.value, secondarySpeciality.value, dateStartSecondary.value, dateEndSecondary.value])

onMounted(() => {
  loadLocalStore();

  if (viewingApplication.value || updatingApplication.value) {
    setSavedStoredValues();
  } else {
    setStoredValues();
  }
});

const setSavedStoredValues = () => {
  secondary.value = savedApplication.value.secundaria;
  highSchool.value = savedApplication.value.bachillerato;
  professional.value = savedApplication.value.profesional;
  master.value = savedApplication.value.maestria;
  other.value = savedApplication.value.otro;
  speciality.value = savedApplication.value.especialidad;
  languages.value = savedApplication.value.idiomas_dominados;
  schedules.value = savedApplication.value.horarios_actual;
  secondarySpeciality.value = savedApplication.value.secundaria_especialidad;
  highSchoolSpeciality.value = savedApplication.value.bachillerato_especialidad;
  selectedProfesional.value = savedApplication.value.profesional_especialidad;
  masterSpeciality.value = savedApplication.value.maestria_especialidad;
  otherSpeciality.value = savedApplication.value.otro_especialidad;
  currentInstitution.value = savedApplication.value.institucion_actual;
  currentSpeciality.value = savedApplication.value.especialidad_actual;
  dateStartSecondary.value = savedApplication.value.secundaria_fecha_inicio;
  dateEndSecondary.value = savedApplication.value.secundaria_fecha_fin;
  dateStartHighSchool.value = savedApplication.value.bachillerato_fecha_inicio;
  dateEndHighSchool.value = savedApplication.value.bachillerato_fecha_fin;
  dateStartProfessional.value = savedApplication.value.profesional_fecha_inicio;
  dateEndProfessional.value = savedApplication.value.profesional_fecha_fin;
  dateStartMaster.value = savedApplication.value.maestria_fecha_inicio;
  dateEndMaster.value = savedApplication.value.maestria_fecha_fin;
  dateStartOther.value = savedApplication.value.otro_fecha_inicio;
  dateEndOther.value = savedApplication.value.otro_fecha_fin;
  isPublicSecondary.value =
    savedApplication.value.secundaria_publica === 1 ? true : false;
  isPublicHighSchool.value =
    savedApplication.value.bachillerato_publico === 1 ? true : false;
  isPublicProfessional.value =
    savedApplication.value.profesional_publico === 1 ? true : false;
  isPublicMaster.value =
    savedApplication.value.maestria_publica === 1 ? true : false;
  isPublicOther.value =
    savedApplication.value.otro_publico === 1 ? true : false;
  isPublicCurrent.value =
    savedApplication.value.publica_actual === 1 ? true : false;
  certifiedSecondary.value =
    savedApplication.value.secundaria_certificado === 1 ? true : false;
  notCertifiedSecondary.value = certifiedSecondary.value ? false : true;
  certifiedHighSchool.value =
    savedApplication.value.bachillerato_certificado === 1 ? true : false;
  notCertifiedHighSchool.value = certifiedHighSchool.value ? false : true;
  certifiedProfessional.value =
    savedApplication.value.profesional_certificado === 1 ? true : false;
  notCertifiedProfessional.value = certifiedProfessional.value ? false : true;
  certifiedMaster.value =
    savedApplication.value.maestria_certificado === 1 ? true : false;
  notCertifiedMaster.value = certifiedMaster.value ? false : true;
  certifiedOther.value =
    savedApplication.value.otro_certificado === 1 ? true : false;
  notCertifiedOther.value = certifiedOther.value ? false : true;
  currentlyStudying.value =
    savedApplication.value.estudia_actualmente === 1 ? true : false;
  currentlyNotStudying.value = currentlyStudying.value ? false : true;
  selectedProfesional.value = savedApplication.value.profesional_especialidad;
  professionalLicence.value = savedApplication.value.no_cedula_profesional;
  currentInstitution.value = savedApplication.value.institucion_actual;
};

const setStoredValues = () => {
  secondary.value = educationData.value.secondary;
  highSchool.value = educationData.value.highSchool;
  master.value = educationData.value.master;
  other.value = educationData.value.other;
  professional.value = educationData.value.professional;
  speciality.value = educationData.value.speciality;
  languages.value = educationData.value.languages;
  schedules.value = educationData.value.schedules;
  secondarySpeciality.value = educationData.value.secondarySpeciality;
  highSchoolSpeciality.value = educationData.value.highSchoolSpeciality;
  selectedProfesional.value = educationData.value.specifyProfessional;
  masterSpeciality.value = educationData.value.masterSpeciality;
  otherSpeciality.value = educationData.value.otherSpeciality;
  currentInstitution.value = educationData.value.institution;
  currentSpeciality.value = educationData.value.currentSpeciality;
  dateStartSecondary.value = educationData.value.dateStartSecondary;
  dateEndSecondary.value = educationData.value.dateEndSecondary;
  dateStartHighSchool.value = educationData.value.dateStartHighSchool;
  dateEndHighSchool.value = educationData.value.dateEndHighSchool;
  dateStartProfessional.value = educationData.value.dateStartProfessional;
  dateEndProfessional.value = educationData.value.dateEndProfessional;
  dateStartMaster.value = educationData.value.dateStartMaster;
  dateEndMaster.value = educationData.value.dateEndMaster;
  dateStartOther.value = educationData.value.dateStartOther;
  dateEndOther.value = educationData.value.dateEndOther;
  isPublicSecondary.value = educationData.value.isPublicSecondary;
  isPublicHighSchool.value = educationData.value.isPublicHighSchool;
  isPublicProfessional.value = educationData.value.isPublicProfessional;
  isPublicMaster.value = educationData.value.isPublicMaster;
  isPublicOther.value = educationData.value.isPublicOther;
  isPublicCurrent.value = educationData.value.isPublicCurrent;
  certifiedSecondary.value = educationData.value.certifiedSecondary;
  notCertifiedSecondary.value = educationData.value.notCertifiedSecondary;
  certifiedHighSchool.value = educationData.value.certifiedHighSchool;
  notCertifiedHighSchool.value = educationData.value.notCertifiedHighSchool;
  certifiedProfessional.value = educationData.value.certifiedProfessional;
  notCertifiedProfessional.value = educationData.value.notCertifiedProfessional;
  certifiedMaster.value = educationData.value.certifiedMaster;
  notCertifiedMaster.value = educationData.value.notCertifiedMaster;
  certifiedOther.value = educationData.value.certifiedOther;
  notCertifiedOther.value = educationData.value.notCertifiedOther;
  currentlyStudying.value = educationData.value.currentlyStudying;
  currentlyNotStudying.value = educationData.value.currentlyNotStudying;
  selectedProfesional.value = educationData.value.selectedProfesional;
  professionalLicence.value = educationData.value.professionalLicence;
  currentInstitution.value = educationData.value.currentInstitution;
};

const updateStore = () => {
  if (viewingApplication.value) return;

  educationData.value.secondary = secondary.value;
  educationData.value.highSchool = highSchool.value;
  educationData.value.professional = professional.value;
  educationData.value.master = master.value;
  educationData.value.other = other.value;
  educationData.value.speciality = speciality.value;
  educationData.value.languages = languages.value;
  educationData.value.schedules = schedules.value;
  educationData.value.secondarySpeciality = secondarySpeciality.value;
  educationData.value.highSchoolSpeciality = highSchoolSpeciality.value;
  educationData.value.professionalSpeciality = selectedProfesional.value;
  educationData.value.masterSpeciality = masterSpeciality.value;
  educationData.value.otherSpeciality = otherSpeciality.value;
  educationData.value.currentInstitution = currentInstitution.value;
  educationData.value.currentSpeciality = currentSpeciality.value;
  educationData.value.dateStartSecondary = dateStartSecondary.value;
  educationData.value.dateEndSecondary = dateEndSecondary.value;
  educationData.value.dateStartHighSchool = dateStartHighSchool.value;
  educationData.value.dateEndHighSchool = dateEndHighSchool.value;
  educationData.value.dateStartProfessional = dateStartProfessional.value;
  educationData.value.dateEndProfessional = dateEndProfessional.value;
  educationData.value.dateStartMaster = dateStartMaster.value;
  educationData.value.dateEndMaster = dateEndMaster.value;
  educationData.value.dateStartOther = dateStartOther.value;
  educationData.value.dateEndOther = dateEndOther.value;
  educationData.value.isPublicSecondary = isPublicSecondary.value;
  educationData.value.isPublicHighSchool = isPublicHighSchool.value;
  educationData.value.isPublicProfessional = isPublicProfessional.value;
  educationData.value.isPublicMaster = isPublicMaster.value;
  educationData.value.isPublicOther = isPublicOther.value;
  educationData.value.isPublicCurrent = isPublicCurrent.value;
  educationData.value.certifiedSecondary = certifiedSecondary.value;
  educationData.value.notCertifiedSecondary = notCertifiedSecondary.value;
  educationData.value.certifiedHighSchool = certifiedHighSchool.value;
  educationData.value.notCertifiedHighSchool = notCertifiedHighSchool.value;
  educationData.value.certifiedProfessional = certifiedProfessional.value;
  educationData.value.notCertifiedProfessional = notCertifiedProfessional.value;
  educationData.value.certifiedMaster = certifiedMaster.value;
  educationData.value.notCertifiedMaster = notCertifiedMaster.value;
  educationData.value.certifiedOther = certifiedOther.value;
  educationData.value.notCertifiedOther = notCertifiedOther.value;
  educationData.value.currentInstitution = currentInstitution.value;
  educationData.value.currentlyStudying = currentlyStudying.value;
  educationData.value.currentlyNotStudying = currentlyNotStudying.value;
  educationData.value.selectedProfesional = selectedProfesional.value;
  educationData.value.professionalLicence = professionalLicence.value;
};

//TODO: Refactorizar esta barbaridad a radio en vez de checkbox
const handleSecondaryCheckboxChange = (selectedCheckbox) => {
  const secoundary = {
    yes: certifiedSecondary,
    no: notCertifiedSecondary,
  };

  Object.keys(secoundary).forEach((key) => {
    if (key === selectedCheckbox) {
      secoundary[key].value = true;
    } else {
      secoundary[key].value = false;
    }
  });
  updateStore();
};
//TODO: Refactorizar esta barbaridad a radio en vez de checkbox
const handleHighSchoolCheckboxChange = (selectedCheckbox) => {
  const highschool = {
    yes: certifiedHighSchool,
    no: notCertifiedHighSchool,
  };

  Object.keys(highschool).forEach((key) => {
    if (key === selectedCheckbox) {
      highschool[key].value = true;
    } else {
      highschool[key].value = false;
    }
  });
  updateStore();
};
//TODO: Refactorizar esta barbaridad a radio en vez de checkbox
const handleProfesionalCheckboxChange = (selectedCheckbox) => {
  const profesional = {
    yes: certifiedProfessional,
    no: notCertifiedProfessional,
  };

  Object.keys(profesional).forEach((key) => {
    if (key === selectedCheckbox) {
      profesional[key].value = true;
    } else {
      profesional[key].value = false;
    }
  });
  updateStore();
};
//TODO: Refactorizar esta barbaridad a radio en vez de checkbox
const handleMasterCheckboxChange = (selectedCheckbox) => {
  const maestry = {
    yes: certifiedMaster,
    no: notCertifiedMaster,
  };

  Object.keys(maestry).forEach((key) => {
    if (key === selectedCheckbox) {
      maestry[key].value = true;
    } else {
      maestry[key].value = false;
    }
  });
  updateStore();
};
//TODO: Refactorizar esta barbaridad a radio en vez de checkbox
const handleOtherCheckboxChange = (selectedCheckbox) => {
  const other = {
    yes: certifiedOther,
    no: notCertifiedOther,
  };

  Object.keys(other).forEach((key) => {
    if (key === selectedCheckbox) {
      other[key].value = true;
    } else {
      other[key].value = false;
    }
  });
  updateStore();
};
//TODO: Refactorizar esta barbaridad a radio en vez de checkbox
const handlestudyCheckboxChange = (selectedCheckbox) => {
  const study = {
    yes: currentlyStudying,
    no: currentlyNotStudying,
  };

  Object.keys(study).forEach((key) => {
    if (key === selectedCheckbox) {
      study[key].value = true;
    } else {
      study[key].value = false;
    }
  });

  updateStore();
};

const clean = () => {
  secondary.value = "";
  highSchool.value = "";
  master.value = "";
  other.value = "";
  professional.value = "";
  speciality.value = "";
  languages.value = "";
  schedules.value = "";
  secondarySpeciality.value = "";
  highSchoolSpeciality.value = "";
  professionalSpeciality.value = "";
  masterSpeciality.value = "";
  otherSpeciality.value = "";
  currentInstitution.value = "";
  currentSpeciality.value = "";

  dateStartSecondary.value = "";
  dateEndSecondary.value = "";
  dateStartHighSchool.value = "";
  dateEndHighSchool.value = "";
  dateStartProfessional.value = "";
  dateEndProfessional.value = "";
  dateStartMaster.value = "";
  dateEndMaster.value = "";
  dateStartOther.value = "";
  dateEndOther.value = "";

  isPublicSecondary.value = false;
  isPublicHighSchool.value = false;
  isPublicProfessional.value = false;
  isPublicMaster.value = false;
  isPublicOther.value = false;
  isPublicCurrent.value = false;

  certifiedSecondary.value = false;
  notCertifiedSecondary.value = false;

  certifiedHighSchool.value = false;
  notCertifiedHighSchool.value = false;

  certifiedProfessional.value = false;
  notCertifiedProfessional.value = false;

  certifiedMaster.value = false;
  notCertifiedMaster.value = false;

  certifiedOther.value = false;
  notCertifiedOther.value = false;

  currentlyStudying.value = false;
  currentlyNotStudying.value = false;

  selectedProfesional.value = "";
  professionalLicence.value = null;
};

const saveLocalStore = () => {
  useLocalStorage.save("educationData", educationData.value);
  if (!viewingApplication.value && !updatingApplication.value) {
    $q.notify(notifyPositive("Se ha guardado su progreso.",1000));
  }
};

const loadLocalStore = () => {
  const localStoreData = useLocalStorage.load("educationData");

  if(localStoreData)
  educationData.value = localStoreData;
};

const dateRule = (value) => {
  const dateValid = /^\d{4}\/\d{2}\/\d{2}$/.test(value);
  const requiredValid = !!value;

  if (!dateValid) {
    return "Ingresa una fecha válida";
  } else if (!requiredValid) {
    return "Este campo es requerido";
  }

  return true; // La validación pasa
};


</script>

<style scoped>
.selectprofessional {
  width: 16%;
  margin-left: 1%;
}

.ipublic-content {
  background-color: #ffffff;
  height: 1%;
  width: 19%;
  margin-right: 2%;
}

.public-content {
  background-color: #ffffff;
  height: 1%;
  width: 20%;
  margin-left: 3%;
  margin-right: 2%;
}

.rounded-borders {
  border-radius: 15px;
  background-color: #ffffff;
}

.study-content {
  background-color: #ffffff;
  height: 1%;
  width: 24%;
}

.certificate {
  margin-left: 14%;
  color: rgb(255, 255, 255);
}

.date {
  margin-left: 14%;
  color: rgb(255, 255, 255);
}

.city {
  margin-left: 3%;
  color: rgb(255, 255, 255);
}

.btn-clean {
  text-align: center;
  margin-bottom: 2%;
  width: 10%;
  margin-left: 88%;
}

.name {
  margin-left: 1%;
  color: rgb(255, 255, 255);
}

.title {
  font-size: large;
  color: rgb(40, 55, 68);
}

.card-education {
  border-radius: 10px;
  vertical-align: top;
  background: rgba(49, 49, 49, 0.473) 51%;
  position: relative;
  height: 75%;
  width: 75%;
  margin-left: 23.5%;
  margin-top: 2%;
}
</style>
