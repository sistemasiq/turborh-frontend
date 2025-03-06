<template>
  <q-layout style="background-color: rgb(30, 61, 88)" v-on:vnode-unmounted="saveLocalStore()">
    <q-card class="card-education">
      <q-card-section class="title"> Información Escolar</q-card-section>
      <q-card-section>
        <PaginationApplication :page="7" :required-fields="requiredFieldsOnThisPage"
          @on-field-validation="validateRequiredFields"></PaginationApplication>
      </q-card-section>

      <div style="margin-top: 6%">
        <div style="display: flex; flex-grow: 1; margin-left: 2%; margin-right: 2%">
          <q-card flat bordered rounded text-color="white" class="q-mb-lg" style="
              margin-left: 0%;
              border-color: rgb(255, 248, 43);
              background-color: transparent;
              color: white;
              width: 100%;
              height: 80px;
            " v-if="!viewingApplication">
            <q-card-section>
              <div class="text-body1 text-weight-medium row">
                <q-icon name="warning" class="q-mr-md q-mt-xs" />
                Nota
              </div>
              <p class="text-body2">
                Es requerido que tenga al menos la secundaria terminada y con
                certificado
              </p>
            </q-card-section>
          </q-card>
        </div>
      </div>

      <q-form>
        <q-card rounded class="bg-white text-black q-mb-lg rounded-borders">
          <div style="display: flex; flex-grow: 1; margin-left: 1%">
            <q-card-section vertical style="width: 20%">
              <div class="q-mb-md text-body1 text-weight-medium">
                Secundaria
              </div>
              <q-input autogrow ref="secondaryRef" ligth outlined color="cyan-1" v-model="secondary" label="Nombre *"
                label-color="grey-8" class="input-brand" style="width: 100%" :readonly="viewingApplication"
                :rules="[ruleFieldRequired]" @update:model-value="updateStore()">
              </q-input>
            </q-card-section>

            <q-card-section vertical style="width: 20%">
              <div class="q-mb-md text-body1 text-weight-medium">
                ¿Qué estudió?
              </div>
              <q-input autogrow ref="secondarySpecialityRef" ligth outlined color="cyan-1" v-model="secondarySpeciality"
                label="Especificar" label-color="grey-8" class="input-brand" style="width: 100%"
                :rules="[ruleFieldRequired]" :readonly="viewingApplication" @update:model-value="updateStore()">
              </q-input>
            </q-card-section>

            <q-card-section vertical style="width: 30%">
              <div class="q-mb-md text-body1 flex flex-center text-weight-medium">
                Año de inicio a fin
              </div>
              <q-card-section horizontal style="width: 100%" class="row justify-between">
                <!-- Año de inicio -->
                <q-select
                  ref="dateStartSecondaryRef"
                  filled
                  v-model="dateStartSecondary"
                  :options="yearOptions"
                  label="Año de inicio *"
                  outlined
                  :rules="[ruleFieldRequired]"
                  color="grey-7"
                  style="width: 45%"
                  :readonly="viewingApplication"
                  @update:model-value="updateStore()"
                />

                <!-- Año de fin -->
                <q-select
                  ref="dateEndSecondaryRef"
                  filled
                  v-model="dateEndSecondary"
                  :options="yearOptions"
                  label="Año de fin *"
                  outlined
                  color="grey-7"
                  :rules="[
                    ruleFieldRequired,
                    (val) => dateStartSecondary <= val || 'El año de fin debe ser posterior o igual al año de inicio'
                  ]"
                  reactive-rules
                  lazy-rules
                  style="width: 45%"
                  :readonly="viewingApplication"
                  @update:model-value="updateStore()"
                />
              </q-card-section>
            </q-card-section>

            <q-card-section vertical style="width: 20%">
              <div class="q-mb-md text-body1 flex flex-center text-weight-medium">
                ¿Tiene certificado?
              </div>
              <div class="row justify-around">
                <q-checkbox color="cyan" unchecked-icon="radio_button_unchecked" checked-icon="radio_button_checked"
                  size="lg" class="checkbox" v-model="certifiedSecondary"
                  @update:modelValue="handleSecondaryCheckboxChange('yes')" label="Sí" :disable="viewingApplication" />
                <q-checkbox color="cyan" unchecked-icon="radio_button_unchecked" checked-icon="radio_button_checked"
                  size="lg" class="checkbox" v-model="notCertifiedSecondary"
                  @update:modelValue="handleSecondaryCheckboxChange('no')" label="No" :disable="viewingApplication" />
              </div>
            </q-card-section>

            <q-card-section vertical style="width: 20%">
              <div class="q-mb-md text-body1 flex flex-center text-weight-medium">
                Tipo de institución
              </div>
              <q-checkbox v-model="isPublicSecondary" color="cyan" unchecked-icon="radio_button_unchecked"
                checked-icon="radio_button_checked" size="lg" class="checkbox" label="Esta institución es publica"
                :disable="viewingApplication" @update:model-value="updateStore()" />
            </q-card-section>
          </div>
        </q-card>

        <!-- HIGH SCHOOL CARD -->

        <q-card rounded class="bg-white text-black q-mb-lg rounded-borders">
          <div style="display: flex; flex-grow: 1; margin-left: 1%">
            <q-card-section vertical style="width: 20%">
              <div class="q-mb-md text-body1 text-weight-medium">
                Bachillerato
              </div>
              <q-input ref="highSchoolyRef" autogrow ligth outlined color="cyan-1" v-model="highSchool" label="Nombre" label-color="grey-8"
              :rules="[ruleFieldRequired]" class="input-brand" style="width: 100%" :readonly="viewingApplication"
                @update:model-value="updateStore()">
              </q-input>
            </q-card-section>

            <q-card-section vertical style="width: 20%">
              <div class="q-mb-md text-body1 text-weight-medium">
                ¿Qué estudió?
              </div>
              <q-input ref="highSchoolSpecialityRef" autogrow ligth outlined color="cyan-1" v-model="highSchoolSpeciality" label="Especificar"
                :rules="[ruleFieldRequired]" label-color="grey-8" class="input-brand" style="width: 100%" :readonly="viewingApplication"
                @update:model-value="updateStore()" />
            </q-card-section>

            <q-card-section vertical style="width: 30%">
              <div class="q-mb-md text-body1 flex flex-center text-weight-medium">
                Fecha de inicio a fin
              </div>
              <q-card-section horizontal style="width: 100%" class="row justify-between">
                <!-- Año de inicio -->
                <q-select
                  ref="dateStartHighSchoolRef"
                  filled
                  v-model="dateStartHighSchool"
                  :options="yearOptions"
                  label="Año de inicio *"
                  outlined
                  :rules="[ruleFieldRequired]"
                  color="grey-7"
                  style="width: 45%"
                  :readonly="viewingApplication"
                  @update:model-value="updateStore()"
                />

                <!-- Año de fin -->
                <q-select
                  ref="dateEndHighSchoolRef"
                  filled
                  v-model="dateEndHighSchool"
                  :options="yearOptions"
                  label="Año de fin *"
                  outlined
                  color="grey-7"
                  :rules="[
                    ruleFieldRequired,
                    (val) => dateStartHighSchool <= val || 'El año de fin debe ser posterior o igual al año de inicio'
                  ]"
                  reactive-rules
                  lazy-rules
                  style="width: 45%"
                  :readonly="viewingApplication"
                  @update:model-value="updateStore()"
                />

                
              </q-card-section>
            </q-card-section>

            <q-card-section vertical style="width: 20%">
              <div class="q-mb-md text-body1 flex flex-center text-weight-medium">
                ¿Tiene certificado?
              </div>
              <div class="row justify-around">
                <q-checkbox color="cyan" unchecked-icon="radio_button_unchecked" checked-icon="radio_button_checked"
                  size="lg" class="checkbox" v-model="certifiedHighSchool"
                  @update:modelValue="handleHighSchoolCheckboxChange('yes')" label="Sí" :disable="viewingApplication" />
                <q-checkbox color="cyan" unchecked-icon="radio_button_unchecked" checked-icon="radio_button_checked"
                  size="lg" class="checkbox" v-model="notCertifiedHighSchool"
                  @update:modelValue="handleHighSchoolCheckboxChange('no')" label="No" :disable="viewingApplication" />
              </div>
            </q-card-section>

            <q-card-section vertical style="width: 20%">
              <div class="q-mb-md text-body1 flex flex-center text-weight-medium">
                Tipo de institución
              </div>
              <q-checkbox v-model="isPublicHighSchool" color="cyan" unchecked-icon="radio_button_unchecked"
                checked-icon="radio_button_checked" size="lg" class="checkbox" label="Esta institución es publica"
                style="color: black" :disable="viewingApplication" @update:model-value="updateStore()" />
            </q-card-section>
          </div>
        </q-card>

        <q-card rounded class="bg-white text-black q-mb-lg rounded-borders">
          <div style="display: flex; flex-grow: 1; margin-left: 1%">
            <q-card-section vertical style="width: 20%">
              <div class="q-mb-md text-body1 text-weight-medium">
                Profesional
              </div>
              <q-input autogrow ligth outlined color="cyan-1" v-model="professional" label="Nombre" label-color="grey-8"
                class="input-brand" style="width: 100%" :readonly="viewingApplication"
                @update:model-value="updateStore()" />
            </q-card-section>

            <q-card-section vertical style="width: 20%">
              <div class="q-mb-md text-body1 text-weight-medium">
                ¿Qué estudió?
              </div>

              <q-select ligth outlined v-model="selectedProfesional" :options="careers" label="Selecciona tu carrera"
                color="black" :readonly="viewingApplication" @update:model-value="updateStore()" />
            </q-card-section>

            <q-card-section vertical style="width: 30%">
              <div class="q-mb-md text-body1 flex flex-center text-weight-medium">
                Fecha de inicio a fin
              </div>
              <q-card-section horizontal style="width: 100%" class="row justify-between">
                <q-input filled v-model="dateStartProfessional" label="AAAA/MM/DD" ligth outlined color="grey-7"
                  style="width: 45%" :readonly="viewingApplication" @update:model-value="updateStore()">
                  <template v-slot:append>
                    <q-icon name="event" class="cursor-pointer">
                      <q-popup-proxy v-if="!viewingApplication" cover transition-show="scale" transition-hide="scale">
                        <q-date locale="es" mask="YYYY-MM-DD" v-model="dateStartProfessional"
                          :readonly="viewingApplication" @update:model-value="updateStore()">
                          <div class="row items-center justify-end">
                            <q-btn v-close-popup label="Cerrar" color="primary" flat />
                          </div>
                        </q-date>
                      </q-popup-proxy>
                    </q-icon>
                  </template>
                </q-input>

                <q-input filled v-model="dateEndProfessional" label="AAAA/MM/DD" ligth outlined color="grey-7"
                  style="width: 45%" :readonly="viewingApplication" @update:model-value="updateStore()"
                  :rules="[(val) => dateStartProfessional < val || 'La fecha de fin debe ser posterior a la fecha de inicio']"
                  reactive-rules lazy-rules>
                  <template v-slot:append>
                    <q-icon name="event" class="cursor-pointer">
                      <q-popup-proxy v-if="!viewingApplication" cover transition-show="scale" transition-hide="scale">
                        <q-date locale="es" mask="YYYY-MM-DD" v-model="dateEndProfessional"
                          :readonly="viewingApplication" @update:model-value="updateStore()">
                          <div class="row items-center justify-end">
                            <q-btn v-close-popup label="Cerrar" color="primary" flat />
                          </div>
                        </q-date>
                      </q-popup-proxy>
                    </q-icon>
                  </template>
                </q-input>
              </q-card-section>
            </q-card-section>

            <q-card-section vertical style="width: 20%">
              <div class="q-mb-md text-body1 flex flex-center text-weight-medium">
                ¿Tiene certificado?
              </div>
              <div class="row justify-around">
                <q-checkbox color="cyan" unchecked-icon="radio_button_unchecked" checked-icon="radio_button_checked"
                  size="lg" class="checkbox" v-model="certifiedProfessional"
                  @update:modelValue="handleProfesionalCheckboxChange('yes')" label="Sí"
                  :disable="viewingApplication" />
                <q-checkbox color="cyan" unchecked-icon="radio_button_unchecked" checked-icon="radio_button_checked"
                  size="lg" class="checkbox" v-model="notCertifiedProfessional"
                  @update:modelValue="handleProfesionalCheckboxChange('no')" label="No" :disable="viewingApplication" />
              </div>
            </q-card-section>

            <q-card-section vertical style="width: 20%">
              <div class="q-mb-md text-body1 flex flex-center text-weight-medium">
                Tipo de institución
              </div>
              <q-checkbox v-model="isPublicProfessional" color="cyan" unchecked-icon="radio_button_unchecked"
                checked-icon="radio_button_checked" size="lg" class="checkbox" label="Esta institución es publica"
                style="color: black" :disable="viewingApplication" @update:model-value="updateStore()" />
            </q-card-section>
          </div>
        </q-card>

        <q-card rounded class="bg-white text-black q-mb-lg rounded-borders">
          <div style="display: flex; flex-grow: 1; margin-left: 1%">
            <q-card-section vertical style="width: 20%">
              <div class="q-mb-md text-body1 text-weight-medium">Maestría</div>

              <q-input autogrow ligth outlined color="cyan-1" v-model="master" label="Institución" label-color="grey-8"
                class="input-brand" style="width: 100%" :readonly="viewingApplication"
                @update:model-value="updateStore()" />
            </q-card-section>

            <q-card-section vertical style="width: 20%">
              <div class="q-mb-md text-body1 text-weight-medium">
                ¿Qué estudió?
              </div>

              <q-input autogrow ligth outlined color="cyan-1" v-model="masterSpeciality" label="Especificar"
                label-color="grey-8" class="input-brand" style="width: 100" :readonly="viewingApplication"
                @update:model-value="updateStore()" />
            </q-card-section>

            <q-card-section vertical style="width: 30%">
              <div class="q-mb-md text-body1 flex flex-center text-weight-medium">
                Fecha de inicio a fin
              </div>
              <q-card-section horizontal style="width: 100%" class="row justify-between">
                <q-input filled v-model="dateStartMaster" label="AAAA/MM/DD" ligth outlined color="grey-7"
                  style="width: 45%" :readonly="viewingApplication" @update:model-value="updateStore()">
                  <template v-slot:append>
                    <q-icon name="event" class="cursor-pointer">
                      <q-popup-proxy v-if="!viewingApplication" cover transition-show="scale" transition-hide="scale">
                        <q-date locale="es" mask="YYYY-MM-DD" v-model="dateStartMaster" :readonly="viewingApplication"
                          @update:model-value="updateStore()">
                          <div class="row items-center justify-end">
                            <q-btn v-close-popup label="Cerrar" color="primary" flat />
                          </div>
                        </q-date>
                      </q-popup-proxy>
                    </q-icon>
                  </template>
                </q-input>

                <q-input filled v-model="dateEndMaster" label="AAAA/MM/DD" ligth outlined color="grey-7"
                  style="width: 45%" :readonly="viewingApplication" @update:model-value="updateStore()"
                  :rules="[(val) => dateStartMaster < val || 'La fecha de fin debe ser posterior a la fecha de inicio']"
                  reactive-rules lazy-rules>
                  <template v-slot:append>
                    <q-icon name="event" class="cursor-pointer">
                      <q-popup-proxy v-if="!viewingApplication" cover transition-show="scale" transition-hide="scale">
                        <q-date locale="es" mask="YYYY-MM-DD" v-model="dateEndMaster" :readonly="viewingApplication"
                          @update:model-value="updateStore()">
                          <div class="row items-center justify-end">
                            <q-btn v-close-popup label="Cerrar" color="primary" flat />
                          </div>
                        </q-date>
                      </q-popup-proxy>
                    </q-icon>
                  </template>
                </q-input>
              </q-card-section>
            </q-card-section>

            <q-card-section vertical style="width: 20%">
              <div class="q-mb-md text-body1 flex flex-center text-weight-medium">
                ¿Tiene certificado?
              </div>
              <div class="row justify-around">
                <q-checkbox color="cyan" unchecked-icon="radio_button_unchecked" checked-icon="radio_button_checked"
                  size="lg" class="checkbox" v-model="certifiedMaster"
                  @update:modelValue="handleMasterCheckboxChange('yes')" label="Sí" :disable="viewingApplication" />
                <q-checkbox color="cyan" unchecked-icon="radio_button_unchecked" checked-icon="radio_button_checked"
                  size="lg" class="checkbox" v-model="notCertifiedMaster"
                  @update:modelValue="handleMasterCheckboxChange('no')" label="No" :disable="viewingApplication" />
              </div>
            </q-card-section>

            <q-card-section vertical style="width: 20%">
              <div class="q-mb-md text-body1 flex flex-center text-weight-medium">
                Tipo de institución
              </div>
              <q-checkbox v-model="isPublicMaster" color="cyan" unchecked-icon="radio_button_unchecked"
                checked-icon="radio_button_checked" size="lg" class="checkbox" label="Esta institución es publica"
                style="color: black" :disable="viewingApplication" @update:model-value="updateStore()" />
            </q-card-section>
          </div>
        </q-card>

        <q-card rounded class="bg-white text-black q-mb-xl rounded-borders">
          <div style="display: flex; flex-grow: 1; margin-left: 1%">
            <q-card-section vertical style="width: 20%">
              <div class="q-mb-md text-body1 text-weight-medium">Otro</div>

              <q-input autogrow light outlined color="cyan-1" v-model="other" label="Institución" label-color="grey-8"
                class="input-brand" style="width: 100%" :readonly="viewingApplication"
                @update:model-value="updateStore()" />
            </q-card-section>

            <q-card-section vertical style="width: 20%">
              <div class="q-mb-md text-body1 text-weight-medium">
                ¿Qué estudió?
              </div>

              <q-input autogrow light outlined color="cyan-1" v-model="otherSpeciality" label="Especificar"
                label-color="grey-8" class="input-brand" style="width: 100%" :readonly="viewingApplication"
                @update:model-value="updateStore()" />
            </q-card-section>

            <q-card-section vertical style="width: 30%">
              <div class="q-mb-md text-body1 flex flex-center text-weight-medium">
                Fecha de inicio a fin
              </div>
              <q-card-section horizontal style="width: 100%" class="row justify-between">
                <q-input filled v-model="dateStartOther" label="AAAA/MM/DD" ligth outlined color="grey-7"
                  style="width: 45%" :readonly="viewingApplication" @update:model-value="updateStore()">
                  <template v-slot:append>
                    <q-icon name="event" class="cursor-pointer">
                      <q-popup-proxy v-if="!viewingApplication" cover transition-show="scale" transition-hide="scale">
                        <q-date locale="es" mask="YYYY-MM-DD" v-model="dateStartOther" :readonly="viewingApplication"
                          @update:model-value="updateStore()">
                          <div class="row items-center justify-end">
                            <q-btn v-close-popup label="Cerrar" color="primary" flat />
                          </div>
                        </q-date>
                      </q-popup-proxy>
                    </q-icon>
                  </template>
                </q-input>

                <q-input filled v-model="dateEndOther" label="AAAA/MM/DD" ligth outlined color="grey-7"
                  style="width: 45%" :readonly="viewingApplication" @update:model-value="updateStore()"
                  :rules="[(val) => dateStartOther < val || 'La fecha de fin debe ser posterior a la fecha de inicio']"
                  reactive-rules lazy-rules>
                  <template v-slot:append>
                    <q-icon name="event" class="cursor-pointer">
                      <q-popup-proxy v-if="!viewingApplication" cover transition-show="scale" transition-hide="scale">
                        <q-date locale="es" mask="YYYY-MM-DD" v-model="dateEndOther" :readonly="viewingApplication"
                          @update:model-value="updateStore()">
                          <div class="row items-center justify-end">
                            <q-btn v-close-popup label="Cerrar" color="primary" flat />
                          </div>
                        </q-date>
                      </q-popup-proxy>
                    </q-icon>
                  </template>
                </q-input>
              </q-card-section>
            </q-card-section>

            <q-card-section vertical style="width: 20%">
              <div class="q-mb-md text-body1 flex flex-center text-weight-medium">
                ¿Tiene certificado?
              </div>
              <div class="row justify-around">
                <q-checkbox color="cyan" unchecked-icon="radio_button_unchecked" checked-icon="radio_button_checked"
                  size="lg" class="checkbox" v-model="certifiedOther"
                  @update:modelValue="handleOtherCheckboxChange('yes')" label="Sí" :disable="viewingApplication" />
                <q-checkbox color="cyan" unchecked-icon="radio_button_unchecked" checked-icon="radio_button_checked"
                  size="lg" class="checkbox" v-model="notCertifiedOther"
                  @update:modelValue="handleOtherCheckboxChange('no')" label="No" :disable="viewingApplication" />
              </div>
            </q-card-section>

            <q-card-section vertical style="width: 20%">
              <div class="q-mb-md text-body1 flex flex-center text-weight-medium">
                Tipo de institución
              </div>
              <q-checkbox v-model="isPublicOther" color="cyan" unchecked-icon="radio_button_unchecked"
                checked-icon="radio_button_checked" size="lg" class="checkbox" label="Esta institución es publica"
                style="color: black" :disable="viewingApplication" @update:model-value="updateStore()" />
            </q-card-section>
          </div>
        </q-card>

        <!--PROFESIONAL DATA -->
        <q-card class="bg-white text-black rounded-borders q-pb-xl">
          <q-card-section class="q-ml-sm text-h6 text-weight-medium flex flex-center">
            Información profesional
          </q-card-section>
          <div style="display: flex; flex-grow: 1; margin-left: 1%">
            <q-card-section vertical style="width: 20%">
              <div class="q-mb-md text-body1 text-weight-medium">
                No. Cédula Professional
              </div>
              <q-input ligth outlined color="cyan-1" mask="##########" v-model="professionalLicence" label="Cédula"
                label-color="grey-8" class="input-brand" style="width: 100%" :readonly="viewingApplication"
                @update:model-value="updateStore()" />
            </q-card-section>

            <q-card-section vertical style="width: 30%">
              <div class="q-mb-md text-body1 text-weight-medium">
                Especialidad
              </div>
              <q-input autogrow ligth outlined color="cyan-1" v-model="speciality" label="Su especialidad"
                label-color="grey-8" class="input-brand" style="width: 100%" :readonly="viewingApplication"
                @update:model-value="updateStore()" />
            </q-card-section>

            <q-card-section vertical style="width: 30%">
              <div class="q-mb-md text-body1 text-weight-medium">
                Idiomas que domina
              </div>

              <q-input ligth outlined color="cyan-1" v-model="languages" label="Idiomas dominados" label-color="grey-8"
                class="input-brand" style="width: 100%" :readonly="viewingApplication"
                @update:model-value="updateStore()" />
            </q-card-section>
            <q-card-section vertical style="width: 20%">
              <div class="q-mb-md text-body1 flex flex-center text-weight-medium">
                ¿Estudia actualmente?
              </div>
              <q-card-section horizontal style="width: 100%" class="row justify-around">
                <q-checkbox color="cyan" unchecked-icon="radio_button_unchecked" checked-icon="radio_button_checked"
                  size="lg" class="checkbox" v-model="currentlyStudying"
                  @update:modelValue="handlestudyCheckboxChange('yes')" label="Si" :disable="viewingApplication" />
                <q-checkbox color="cyan" unchecked-icon="radio_button_unchecked" checked-icon="radio_button_checked"
                  size="lg" class="checkbox q-mr-md" v-model="currentlyNotStudying"
                  @update:modelValue="handlestudyCheckboxChange('no')" label="No" :disable="viewingApplication" />
              </q-card-section>
            </q-card-section>
          </div>

          <!-- STUDING NOW DAYS -->
          <div style="display: flex; flex-grow: 1; margin-left: 1%">
            <q-card-section vertical style="width: 20%" v-if="currentlyStudying">
              <div class="q-mb-md text-body1 text-weight-medium">
                ¿En qué institución?
              </div>
              <q-input outlined color="cyan-1" v-model="currentInstitution" label="Institución" label-color="grey-8"
                class="input-brand" style="width: 100%" :readonly="viewingApplication"
                @update:model-value="updateStore()" />
            </q-card-section>

            <q-card-section vertical style="width: 30%" v-if="currentlyStudying">
              <div class="q-mb-md text-body1 text-weight-medium">
                ¿Qué estudia?
              </div>
              <q-input outlined color="cyan-1" v-model="currentSpeciality" label="Nombre de la carrera, oficio u otro"
                label-color="grey-8" class="input-brand" style="width: 100%" :readonly="viewingApplication"
                @update:model-value="updateStore()" />
            </q-card-section>

            <q-card-section vertical style="width: 30%" v-if="currentlyStudying">
              <div class="q-mb-md text-body1 text-weight-medium">
                Horario de asistencia
              </div>
              <q-input outlined color="cyan-1" v-model="schedules" label="Horarios" label-color="grey-8"
                class="input-brand" style="width: 100%" :readonly="viewingApplication"
                @update:model-value="updateStore()" />
            </q-card-section>

            <q-card-section vertical style="width: 20%" v-if="currentlyStudying">
              <div class="q-mb-md text-body1 flex flex-center text-weight-medium">
                Tipo de institución
              </div>
              <q-card-section horizontal style="width: 100%" class="row justify-around">
                <q-checkbox v-model="isPublicCurrent" color="cyan" unchecked-icon="radio_button_unchecked"
                  checked-icon="radio_button_checked" size="lg" class="checkbox" label="Esta institución es publica"
                  style="color: rgb(0, 0, 0)" :disable="viewingApplication" @update:model-value="updateStore()" />
              </q-card-section>
            </q-card-section>
          </div>

          <div class="column">
            <q-btn v-if="!viewingApplication && !updatingApplication" class="btn-clean q-mt-xl" rounded
              text-color="white" color="red-5" label="Limpiar" icon="cleaning_services" @click.prevent="clean" />
          </div>
        </q-card>
      </q-form>
    </q-card>
    <br />
    <br />
    <br />
    <ButtonApplicationStatus 
      v-if="updatingApplication" 
      :required-fields="requiredFieldsOnThisPage"/>
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
import { ruleFieldRequired } from "src/utils/fieldRules";
import { dateRelationshipRule } from "src/utils/fieldRules.js";

const $q = useQuasar();
const useRequest = useRequestUser();
const useLocalStorage = useLocalStorageStore();

const currentYear = new Date().getFullYear();

// Lista de años (desde 1950 hasta el año actual)
const yearOptions = computed(() => {
  const years = [];
  for (let year = currentYear; year >= 1950; year--) {
    years.push(year.toString());
  }
  return years;
});

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
  "Carreras afines u otras",
];

const secondaryRef = ref(null);
const secondarySpecialityRef = ref(null);
const dateStartSecondaryRef = ref(null);
const dateEndSecondaryRef = ref(null);

const highSchoolyRef = ref(null);
const highSchoolSpecialityRef = ref(null);
const dateStartHighSchoolRef = ref(null);
const dateEndHighSchoolRef = ref(null);

const validateRequiredFields = () => {
  secondaryRef.value.validate();
  secondarySpecialityRef.value.validate();
  dateEndSecondaryRef.value.validate();
  dateStartSecondaryRef.value.validate();
  highSchoolyRef.value.validate();
  highSchoolSpecialityRef.value.validate();
  dateStartHighSchoolRef.value.validate();
  dateEndHighSchoolRef.value.validate();
};

const requiredFieldsOnThisPage = computed(() => [
  secondary.value,
  secondarySpeciality.value,
  dateStartSecondary.value,
  dateEndSecondary.value,
  highSchool.value,
  highSchoolSpeciality.value,
  dateStartHighSchool.value,
  dateEndHighSchool.value,
]);

onMounted(() => {
  loadLocalStore();

  if (viewingApplication.value || updatingApplication.value) {
    setSavedStoredValues();
  } else {
    setStoredValues();
  }

  // Si tienes datos previos en formato YYYY-MM-DD, extrae solo el año
  if (dateStartSecondary.value && dateStartSecondary.value.includes('-')) {
    dateStartSecondary.value = dateStartSecondary.value.split('-')[0];
  }
  
  if (dateEndSecondary.value && dateEndSecondary.value.includes('-')) {
    dateEndSecondary.value = dateEndSecondary.value.split('-')[0];
  }

  if (dateStartHighSchool.value && dateStartHighSchool.value.includes('-')) {
    dateStartHighSchool.value = dateStartHighSchool.value.split('-')[0];
  }
  
  if (dateEndHighSchool.value && dateEndHighSchool.value.includes('-')) {
    dateEndHighSchool.value = dateEndHighSchool.value.split('-')[0];
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
  if (!viewingApplication.value && !updatingApplication.value) {
    useLocalStorage.save("educationData", educationData.value);
    $q.notify(notifyPositive("Se ha guardado su progreso.", 1000));
  }
};

const loadLocalStore = () => {
  if (updatingApplication.value)
    return;

  const localStoreData = useLocalStorage.load("educationData");

  if (localStoreData) educationData.value = localStoreData;
};
</script>

<style scoped>
.ipublic-content {
  background-color: #ffffff;
  height: 1%;
  width: 19%;
  margin-right: 2%;
}

.public-content {
  width: 100%;
}

.rounded-borders {
  border-radius: 15px;
  background-color: #4253618f;
}

.rounded-borders2 {
  border-radius: 15px;
  background-color: #ffffff;
}

.study-content {
  width: 25%;
}

.certificate {
  margin-left: 10%;
  color: rgb(0, 0, 0);
}

.date {
  margin-left: 12%;
  color: rgb(0, 0, 0);
}

.city {
  margin-left: 10%;
  color: rgb(0, 0, 0);
}

.maestria {
  margin-left: 12%;
  color: rgb(0, 0, 0);
}

.carrer {
  margin-left: 15%;
  color: rgb(0, 0, 0);
}

.btn-clean {
  text-align: center;
  margin-bottom: 2%;
  width: 10%;
  margin-left: 88%;
}

.otro {
  margin-left: 1%;
  color: rgb(0, 0, 0);
}

.name {
  margin-left: 1%;
  color: rgb(0, 0, 0);
}

.title {
  font-size: large;
  color: rgb(40, 55, 68);
}

.title2 {
  font-size: medium;
  color: rgb(40, 55, 68);
}

.card-education {
  border-radius: 10px;
  vertical-align: top;
  background: rgba(49, 49, 49, 0.473) 51%;
  position: relative;
  height: 75%;
  width: 89%;
  margin-left: 6%;
  margin-top: 2%;
}
</style>
