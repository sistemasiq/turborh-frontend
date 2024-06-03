<!--MADE all the things you do with interest and passion, good luck with the next implementations :)-->
<template>
  <q-layout view="hhh LpR lfr" class="bg-white text-black">
    <!--The Header starts here-->
    <q-header
      reveal
      bordered
      class="row col-auto items-center justify-between bg-white text-black"
    >
      <q-toolbar class="col-10" v-if="!showSearch">
        <q-btn
          flat
          @click.prevent="drawerLeft = !drawerLeft"
          round
          dense
          icon="menu"
        />

        <!--We take the images from the S3 bucket-->
        <q-img
         :src="getS3FileUrl(getAssetsPath, 'logo_turbo_navegador.png')"
          class="q-ml-lg q-mr-sm"
          style="width: 30px; height: 30px"
        />
        <div style="text-align: left; font-size: 22px; color: rgb(61, 61, 61)">
          Agenda de entrevistas
        </div>

        <!--Month navigation controllers-->
        <div class="row col-auto items-center justify-center q-ml-sm">
          <todayComponent @today="onToday" />
          <prev @prev="onPrev" />
          <div style="font-size: 1.5em">{{ formattedMonth }}</div>
          <next @next="onNext" />
        </div>
      </q-toolbar>

      <!--Button to open the search bar-->
      <q-toolbar class="row col-3 items-center" v-if="showSearch">
        <q-btn
          flat
          @click.prevent="closeSearch()"
          round
          dense
          icon="arrow_back"
        >
          <q-tooltip class="bg-white text-primary">Volver</q-tooltip>
        </q-btn>
        <div class="text-weight-medium text-body1 q-ml-md">Buscar</div>
      </q-toolbar>

      <!--search bar section-->
      <q-toolbar
        style="min-height: 68px"
        class="row col-8"
        transition-show="slide-left"
        transition-hide="slide-right"
        v-if="showSearch"
      >
        <div
          class="row col-auto items-center justify-between shadow-2"
          style="border-radius: 8px; width: 75%"
        >
          <q-btn
            flat
            round
            dense
            :disable="firstDateRange && secondDateRange"
            icon="search"
            style="width: fit-content; height: fit-content"
            @click="getHistory()"
          >
            <q-tooltip class="bg-white text-primary">Búsqueda</q-tooltip>
          </q-btn>

          <!--input to search by name in the active appointments -->
          <q-input
            rounded
            borderless
            hide-bottom-space
            dense
            placeholder="Buscar candidato"
            v-model="searchInput"
            @update:model-value="searchInput"
            style="width: 90%"
          >
            <template v-slot:append>
              <q-btn
                flat
                round
                dense
                icon="close"
                style="width: fit-content; height: fit-content"
                @click="cleanSearchInput()"
                v-if="searchInput != ''"
              >
                <q-tooltip class="bg-white text-primary">Limpiar</q-tooltip>
              </q-btn>
            </template>
          </q-input>

          <!--This section is to get the history using a range of dates-->
          <q-btn-dropdown
            flat
            rounded
            dense
            v-tooltip="'Opciones de búsqueda'"
            color="white"
            text-color="grey-9"
          >
            <q-list>
              <div class="row items-center justify-between q-pa-md">
                <p class="text-grey-8">Fecha</p>
                <q-input
                  filled
                  v-model="firstDateRange"
                  label="Fecha inicio"
                  mask="date"
                  :rules="['date']"
                  style="width: 40%"
                >
                  <template v-slot:append>
                    <q-icon name="event" class="cursor-pointer">
                      <q-popup-proxy
                        cover
                        transition-show="scale"
                        transition-hide="scale"
                      >
                        <q-date v-model="firstDateRange">
                          <div class="row items-center justify-end">
                            <q-btn
                              v-close-popup
                              label="Close"
                              color="primary"
                              flat
                            >
                              <q-tooltip class="bg-white text-primary"
                                >Cerrar</q-tooltip
                              >
                            </q-btn>
                          </div>
                        </q-date>
                      </q-popup-proxy>
                    </q-icon>
                  </template>
                </q-input>
                <p class="text-grey-8">a</p>
                <q-input
                  filled
                  v-model="secondDateRange"
                  label="Fecha fin"
                  mask="date"
                  :rules="['date']"
                  style="width: 40%"
                >
                  <template v-slot:append>
                    <q-icon name="event" class="cursor-pointer">
                      <q-popup-proxy
                        cover
                        transition-show="scale"
                        transition-hide="scale"
                      >
                        <q-date v-model="secondDateRange">
                          <div class="row items-center justify-end">
                            <q-btn
                              v-close-popup
                              label="Close"
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
              <div class="q-mb-md q-mr-md row items-center justify-end">
                <q-btn
                  :disable="firstDateRange && secondDateRange"
                  no-caps
                  dense
                  color="blue-5"
                  label="Buscar"
                  @click.prevent="getHistory()"
                  class="q-pa-sm"
                />
              </div>
            </q-list>
          </q-btn-dropdown>
        </div>
        <q-list
          dense
          borderless
          v-if="searchInput"
          style="position: absolute"
          class="filtered-list bg-white"
        >
          <q-item
            v-for="(event, index) in filterHistory"
            :key="index"
            @click="showEventData(event)"
            clickable
            v-ripple
            class="bg-white"
          >
            {{
              event.name +
              " " +
              event.fatherLastName +
              " " +
              event.motherLastName
            }}
          </q-item>
        </q-list>
      </q-toolbar>

      <q-toolbar class="col-auto items-center justify-between">
        <q-btn
          flat
          rounded
          dense
          icon="search"
          @click="searchActivation()"
          v-if="!showSearch"
        >
          <q-tooltip class="bg-white text-primary">Búsqueda</q-tooltip>
        </q-btn>
        <q-btn dense flat icon="close" v-close-popup @click="toHome()">
          <q-tooltip class="bg-white text-primary">Cerrar</q-tooltip>
        </q-btn>
      </q-toolbar>
    </q-header>

    <!--The left drawer starts here-->
    <q-drawer
      v-model="drawerLeft"
      side="left"
      bordered
      show-if-above
      class="drawer-container"
    >
    <!--The small calendar month can just select days but is not the main option to register an appointment-->
      <div class="row justify-center">
        <q-calendar-month
          ref="calendar"
          v-model="selectedDate"
          locale="es"
          mini-mode
          :min-weeks="6"
          class="custom-calendar"
          style="width: 280px"
        />
      </div>

      <!--This filters can be viewed just if the user search the appointment´s history -->
      <q-list v-if="searchedAppointments.length > 0">
        <q-expansion-item
          default-opened
          icon="mdi-tune"
          label="Filtros"
          caption="Filtra tu historial"
        >
          <q-separator />
          <div class="col-auto justify-center">
            <div class="col bg-white">
              <q-radio
                v-model="filterSearchedAppointments"
                val="filterAll"
                label="Todos"
                color="blue"
                checked-icon="radio_button_checked"
                unchecked-icon="radio_button_unchecked"
              />
            </div>
            <div class="col bg-white">
              <q-radio
                v-model="filterSearchedAppointments"
                val="filterInactive"
                label="Solo inactivos"
                color="blue"
                checked-icon="radio_button_checked"
                unchecked-icon="radio_button_unchecked"
              />
            </div>
            <div class="col bg-white">
              <q-radio
                v-model="filterSearchedAppointments"
                label="Entrevistados"
                val="filterInterviewed"
                color="blue"
                checked-icon="radio_button_checked"
                unchecked-icon="radio_button_unchecked"
              />
            </div>
            <div class="col bg-white">
              <q-radio
                v-model="filterSearchedAppointments"
                label="Canceladas"
                val="filterCanceled"
                color="blue"
                checked-icon="radio_button_checked"
                unchecked-icon="radio_button_unchecked"
              />
            </div>
          </div>
        </q-expansion-item>
      </q-list>
    </q-drawer>

    <q-drawer
      side="right"
      v-model="drawerRight"
      bordered
      :width="220"
      :breakpoint="500"
      :class="$q.dark.isActive ? 'bg-white-9' : 'bg-white-3'"
    >
      <div
        class="text-body1 text-center bg-green-13 text-white text-weight-medium"
      >
        Citas activas
      </div>
      <q-list bordered separator>
        <q-item
          v-for="(event, index) in events"
          :key="index"
          clickable
          class="col-11"
          @click="showEventData(event)"
        >
          <q-item-section side>
            <q-icon name="circle" color="green-13" style="font-size: 12px" />
          </q-item-section>
          <span>
            {{
              event.name +
              " " +
              event.fatherLastName +
              " " +
              event.motherLastName
            }}
            <br />
            {{ event.date }}
            <br />
            {{ event.hour }}
          </span>
        </q-item>
      </q-list>
    </q-drawer>

    <q-page-container
      v-if="showSearchResults === true"
      style="width: 100%; height: 100%"
    >
      <q-page padding class="column items-star justify-center">
        <div
          v-if="showSearchResults === true && !searchedAppointments.length"
          class="col-auto self-center"
        >
          No se encontraron coincidencias con la busqueda :(
        </div>

        <q-list
          v-if="showSearchResults === true && searchedAppointments.length"
          class="col"
        >
          <q-item
            clickable
            v-ripple
            v-for="(event, index) in filteredSearchedAppointments"
            :key="index"
            class="items-center"
            @click="showEventData(event)"
            style="border-radius: 30px"
          >
            <q-icon
              name="circle"
              :color="
                event.active === 1
                  ? 'green-13'
                  : event.appointmentStatus === 'C'
                  ? 'red-13'
                  : event.appointmentStatus === 'F'
                  ? 'blue-4'
                  : 'grey'
              "
              style="font-size: 15px"
            />
            <div class="row text-blue-grey-13" style="width: 100%">
              <div class="q-ml-lg self-center text-body1 col">
                {{ event.date }}
              </div>
              <div class="self-center text-body1 col">
                {{
                  event.modality === "P"
                    ? "Presencial"
                    : event.modality === "V"
                    ? "Virtual"
                    : "Indeterminada"
                }}
              </div>
              <div class="self-center text-body1 col">
                {{ event.hour }}
              </div>
              <div class="self-center text-body1 col">
                {{
                  event.name +
                  " " +
                  event.fatherLastName +
                  " " +
                  event.motherLastName
                }}
              </div>

              <div
                class="self-center text-body1 col-1"
                :style="
                  event.appointmentStatus === 'P'
                    ? { color: '#2ed573' }
                    : event.appointmentStatus === 'C'
                    ? { color: '#ff4757' }
                    : event.appointmentStatus === 'F'
                    ? { color: '#1e90ff' }
                    : { color: '#a4b0be' }
                "
              >
                {{
                  event.appointmentStatus === "P"
                    ? "Activa"
                    : event.appointmentStatus === "C"
                    ? "Cancelada"
                    : event.appointmentStatus === "F"
                    ? "Completada"
                    : "Indeterminada"
                }}
              </div>
            </div>
          </q-item>
        </q-list>
      </q-page>
    </q-page-container>
    <q-page-container v-if="showSearchResults === false">
      <div style="display: flex; max-width: 100%; width: 100%; height: 670px">
        <q-calendar-month
          ref="calendar"
          v-model="selectedDate"
          day-height="0"
          :min-weekday-length="2"
          date-type="round"
          locale="es"
          date-align="left"
          transition-next="jump-left"
          transition-prev="jump-right"
          :hoverable="hoverable"
          :focusable="focusable"
          :focus-type="focusType"
          animated
          bordered
          show-navigation
          @click-day="onClickDay"
          style="width: 100%; color: black; font-size: medium"
        >
          <template #day="{ scope: { timestamp } }">
            <q-layout view="hhh lpr fFf" container>
              <q-page-container>
                <q-btn
                  v-for="(event, index) in eventsMap[timestamp.date]"
                  :key="index"
                  class="text-black text-caption q-ma-sm appointmentCard"
                  icon="assignment_ind"
                  :style="{
                    'background-color': event.color,
                  }"
                  @click="showEventData(event)"
                >
                  {{
                    (event.hour ? event.hour + " " : "") +
                    " " +
                    (event.modality === "V"
                      ? "Virtual"
                      : event.modality === "P"
                      ? "Presencial"
                      : event.modality)
                  }}

                  <q-tooltip>{{
                    "Citado: " +
                    event.name +
                    " " +
                    event.fatherLastName +
                    " " +
                    event.motherLastName
                  }}</q-tooltip>
                </q-btn>
              </q-page-container>

              <q-footer
                v-if="
                  eventsMap[timestamp.date] &&
                  eventsMap[timestamp.date].length >= 3
                "
                class="bg-white"
                elevated
                bordered
              >
                <q-btn
                  style="width: 100%"
                  class="text-black text-caption"
                  icon="list"
                  @click="showDaysAppointmentList(eventsMap[timestamp.date])"
                >
                  Ver más
                </q-btn>
              </q-footer>
            </q-layout>
          </template>
        </q-calendar-month>
      </div>
      <div class="position-relative">
        <q-checkbox
          unchecked-icon="navigate_before"
          checked-icon="navigate_next"
          left-label
          v-model="drawerRight"
          size="lg"
          color="teal-5"
          :disable="disableCheckbox"
          class="text-body1 floating-checkbox"
        >
          <q-tooltip>Ver citas activas</q-tooltip>
        </q-checkbox>
      </div>
    </q-page-container>

    <!-- END OF PAGE-->
    <!-- DIALOGS-->
    <q-dialog
      v-model="confirm"
      persistent
      transition-show="scale"
      transition-hide="scale"
    >
      <q-layout
        view="hhh lpr fff"
        container
        :style="
          updateSelection ? { 'min-width': '525px' } : { 'min-width': '1050px' }
        "
      >
        <q-header reveal bordered class="bg-blue-8 text-white">
          <q-toolbar>
            <q-toolbar-title>
              <q-avatar
                style="font-size: 50px"
                flat
                round
                dense
                icon="assignment_ind"
              />
              <span v-if="updateSelection">Modificar Cita</span>
              <span v-else>Agendar Cita</span>
            </q-toolbar-title>
            <q-space />
            <q-btn
              style="font-size: 15px"
              flat
              round
              dense
              icon="close"
              @click.prevent="closeAppointmentDialog"
            >
              <q-tooltip> Cerrar ventana </q-tooltip>
            </q-btn>
          </q-toolbar>
        </q-header>

        <q-page-container padding class="row">
          <div class="col-7" v-if="!updateSelection">
            <q-table
              flat
              bordered
              style="background: rgb(234, 237, 249); height: 100%;"
              v-bind:rows="filteredRows"
              separator="horizontal"
              @request="getCandidatesCatalog"
              :columns="columns"
              row-key="name"
              :loading="loading"
              :filter="filter"
              loading-label="Cargando puestos..."
              rows-per-page-label="Puestos por página"
              :table-header-class="{ 'table-header-style': [true] }"
              :table-class="{ 'table-body-style': [true] }"
              class="my-sticky-header-table q-pa-md"
              v-bind:no-data-label="noDataLabel"
              no-results-label="No hay coincidencias con la busqueda"
              :rows-per-page-options="[4]"
            >
              <template v-slot:top-left>
                <q-card-actions horizontal>
                  <div style="font-size: 25px" class="q-mr-md">
                    Listado de Candidatos
                  </div>
                </q-card-actions>
              </template>
              <template v-slot:top-right>
                <q-card-actions horizontal align="right">
                  <q-input
                    borderless
                    dense
                    debounce="300"
                    v-model="filter"
                    placeholder="Buscar"
                    class="q-pl-sm q-pr-sm q-mr-sm"
                    style="
                      background: rgb(255, 255, 255);
                      width: 460px;
                      border-radius: 100px;
                    "
                  >
                    <template v-slot:append>
                      <q-icon name="search" />
                    </template>
                  </q-input>
                  <q-checkbox
                    unchecked-icon="remove_circle_outline"
                    checked-icon="check_circle"
                    left-label
                    v-model="showCitedCandidates"
                    size="lg"
                    color="teal-5"
                    :disable="disableCheckbox"
                    class="text-body1"
                  >
                    <q-tooltip>Mostrar solo agendados</q-tooltip>
                  </q-checkbox>
                </q-card-actions>
              </template>

              <template v-slot:body-cell-name="{ row }">
                <q-td>
                  <q-item
                    :clickable="checkSelection(row)"
                    @click.prevent="onCandidateSelection(row)"
                  >
                    <div class="row">
                      <q-item-label
                        style="font-family: Arial"
                        class="text-body1"
                      >
                        <q-avatar
                          icon="person"
                          color="light-blue-9"
                          text-color="white"
                          class="q-mr-sm"
                          style="font-size: 40px; width: 27px; height: 27px"
                        />
                        {{
                          row.name +
                          " " +
                          row.fatherLastName +
                          " " +
                          row.motherLastName
                        }}
                      </q-item-label>
                    </div>
                  </q-item>
                </q-td>
              </template>
            </q-table>
          </div>
          <!--  Column 2  -->

          <div class="col">
            <q-card class="col-auto" style="height: 100%">
              <q-card-section
                class="column justify-center"
                style="width: 100%; height: 100%"
                v-if="!candidatesAvailable && !updateSelection"
              >
                <div class="row self-center text-grey-8">
                  <q-icon name="mdi-alert" class="text-h6 q-mr-sm" />
                  <p class="text-body1">
                    No hay candidatos postulados por el momento
                  </p>
                </div>
              </q-card-section>
              <q-card-section
                class="column"
                style="height: 100%"
                v-if="candidatesAvailable || updateSelection"
              >
                <div class="row justify-between items-center q-ml-sm">
                  <div class="text-h6 text-weight-medium col-5">
                    Datos de la cita
                  </div>
                  <div class="row col-2 items-center">
                    <q-btn
                      icon="color_lens"
                      flat
                      round
                      dense
                      @click="small = true"
                    >
                      <q-tooltip> Seleccionar color </q-tooltip>
                    </q-btn>
                    <div
                      style="height: 15px; width: 15px; border-radius: 50%"
                      :style="{ backgroundColor: hex }"
                      class="q-ml-sm"
                    />
                  </div>

                  <q-dialog v-model="small">
                    <q-card style="width: 300px">
                      <q-card-section>
                        <div class="text-h6">Selecciona un color</div>
                      </q-card-section>
                      <q-card-section class="q-pt-none">
                        <div class="q-pa-sm">
                          <q-color
                            v-model="hex"
                            default-view="palette"
                            no-header-tabs
                            no-footer
                            hex
                            flat
                            :palette="colorPalette"
                            class="my-picker"
                          />
                        </div>
                      </q-card-section>
                      <q-card-actions align="right" class="bg-white text-teal">
                        <q-btn flat label="OK" v-close-popup />
                      </q-card-actions>
                    </q-card>
                  </q-dialog>
                </div>
                <q-card-actions vertical>
                  <div class="row col">
                    <q-img
                      style="width: 80px; height: 80px; border-radius: 100%"
                      :src="getUserImage"
                      class="q-mr-sm"
                    />
                    <q-input
                      v-model="candidateSelection"
                      label="Nombre del candidato"
                      filled
                      readonly
                      disable
                      class="col self-center"
                    />
                  </div>
                  <div class="row justify-between q-mt-lg">
                    <q-input
                      v-model="selectDay"
                      label="Fecha"
                      filled
                      :disable="!updateSelection"
                      style="width: 48%"
                    >
                      <template v-slot:append>
                        <q-icon name="event" class="cursor-pointer">
                          <q-popup-proxy
                            cover
                            transition-show="scale"
                            transition-hide="scale"
                          >
                            <q-date
                              color="cyan"
                              v-model="selectDay"
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
                    <q-input
                      v-model="selectedHour"
                      mask="time"
                      label="Hora"
                      filled
                      lazy-rules
                      style="width: 48%"
                      :rules="[
                        (value) => !!value || 'La hora de la cita es requerida',
                      ]"
                    >
                      <template v-slot:append>
                        <q-icon name="access_time" class="cursor-pointer">
                          <q-popup-proxy
                            cover
                            transition-show="scale"
                            transition-hide="scale"
                          >
                            <q-time
                              v-model="selectedHour"
                              mask="HH:mm"
                              format24h
                            >
                              <div class="row items-center justify-end">
                                <q-btn
                                  v-close-popup
                                  label="Close"
                                  color="primary"
                                  flat
                                />
                              </div>
                            </q-time>
                          </q-popup-proxy>
                        </q-icon>
                      </template>
                    </q-input>
                    <div>
                      <q-radio
                        v-model="selectedModality"
                        val="Presencial"
                        label="Presencial"
                        color="blue"
                        checked-icon="radio_button_checked"
                        unchecked-icon="radio_button_unchecked"
                      />
                    </div>
                    <div class="row text-body2">
                      <q-radio
                        v-model="selectedModality"
                        val="Virtual"
                        color="blue"
                        checked-icon="radio_button_checked"
                        unchecked-icon="radio_button_unchecked"
                      />
                      <q-btn-dropdown
                        flat
                        auto-close
                        color="white"
                        text-color="grey-9"
                        :icon="
                          selectedPlatform === 'Microsoft Teams'
                            ? 'group'
                            : selectedPlatform === 'Google Meet'
                            ? 'videocam'
                            : selectedPlatform === 'Zoom'
                            ? 'video_chat'
                            : 'computer'
                        "
                        :label="
                          selectedPlatform === 'Presencial'
                            ? 'Virtual'
                            : selectedPlatform != ''
                            ? selectedPlatform
                            : 'Virtual'
                        "
                        class="text-weight-regular"
                        :dropdown-content-class="dropdownContentClass"
                      >
                        <q-list>
                          <q-item
                            v-for="(item, index) in filteredMeetingPlatform"
                            :key="index"
                            clickable
                            v-close-popup
                            @click.prevent="onModalitySelection(item)"
                          >
                            <q-item-section avatar>
                              <q-avatar
                                :icon="
                                  item.platformName === 'Microsoft Teams'
                                    ? 'group'
                                    : item.platformName === 'Google Meet'
                                    ? 'videocam'
                                    : item.platformName === 'Zoom'
                                    ? 'video_chat'
                                    : 'computer'
                                "
                                :color="
                                  item.platformName === 'Microsoft Teams'
                                    ? 'purple-4'
                                    : item.platformName === 'Google Meet'
                                    ? 'yellow-7'
                                    : item.platformName === 'Zoom'
                                    ? 'blue'
                                    : 'green'
                                "
                                text-color="white"
                              />
                            </q-item-section>
                            <q-item-section>
                              <q-item-label>{{
                                item.platformName
                              }}</q-item-label>
                            </q-item-section>
                          </q-item>
                        </q-list>
                      </q-btn-dropdown>
                    </div>
                  </div>
                </q-card-actions>
                <!-- corregir desde aqui-->
                <q-card-actions class="col self-end">
                  <div class="self-end">
                    <q-btn
                      v-if="!updateSelection"
                      flat
                      label="Agendar"
                      icon="add"
                      @click.prevent="createAppointment()"
                      class="bg-cyan-4 text-white q-mr-xs"
                      style="border-radius: 20px"
                    />
                    <q-btn
                      v-if="updateSelection"
                      flat
                      label="Actualizar"
                      icon="update"
                      @click.prevent="updateAppointment"
                      class="bg-green-13 text-white q-mr-xs"
                      style="border-radius: 20px"
                    />
                  </div>
                </q-card-actions>
              </q-card-section>
            </q-card>
          </div>
        </q-page-container>

        <!--User Information-->
        <!--REFACTOR REQUIRED. The distribution of the elements in the div is not a good practice-->
        <!-- Echele ganas al que quiera refactorizar por que mi compa ni quizo hacerlo jajajajjaa -->

        <div class="col">
          <q-card class="col-auto" style="height: 100%">
            <q-expansion-item
              expand-separator
              icon="perm_identity"
              label="Información Personal"
              :caption="candidateSelection != '' ? candidateSelection : ''"
            >
              <q-card-section horizontal style="height: 100%">
                <div class="q-ma-md" v-if="!updateSelection">
                  <q-img
                    style="width: 150px; height: 150px; border-radius: 10%"
                    :src="getUserImage"
                  />
                </div>
                <q-card-actions vertical style="width: 100%">
                  <div
                    class="q-mt-sm q-mb-sm self-center text-blue-grey-8 text-body1"
                  >
                    Profesional
                    <q-separator color="blue-5" />
                  </div>
                  <div class="row justify-between q-ma-md">
                    <q-btn-dropdown
                      flat
                      auto-close
                      color="white"
                      :text-color="studyLevel != ''
                        ? 'blue-grey-8'
                        : 'grey-6'
                        "
                      :icon="updateSelection != true
                      ? 'visibility'
                      : 'false'
                      "
                      :label="updateSelection != true
                      ? 'Ver candidaturas'
                      : 'Candidaturas'
                      "
                      class="text-weight-regular col-3"
                      dropdown-content-class="flexible-width"
                    >
                      <q-list>
                        <q-item
                          v-for="(item, index) in jobsApplications"
                          :key="index"
                          v-close-popup
                          @click.prevent="onModalitySelection(item)"
                        >
                          <q-item-section avatar>
                            <q-avatar
                              icon="mdi-briefcase"
                              color="blue-grey-8"
                              text-color="white"
                            />
                          </q-item-section>
                          <q-item-section>
                            <q-item-label>{{ item }}</q-item-label>
                          </q-item-section>
                        </q-item>
                      </q-list>
                    </q-btn-dropdown>
                    <q-input
                      v-model="studyLevel"
                      label="Grado Estudios"
                      borderless
                      readonly
                      disable
                      class="col-3 text-blue-grey-8"
                    >
                      <template v-slot:before>
                        <q-icon name="school" :color="studyLevel != ''
                        ? 'blue-grey-8'
                        : 'grey-6 '
                        "/>
                      </template>
                    </q-input>
                    <q-input
                      v-model="speciality"
                      label="Especialidad"
                      autogrow
                      borderless
                      readonly
                      disable
                      class="col-3"
                      >
                      <template v-slot:before>
                        <q-icon name="school" :color="speciality != ''
                        ? 'blue-grey-8'
                        : 'grey-6 '
                        "/>
                      </template>
                    </q-input>
                  </div>
                  <div class="row justify-between q-ma-md">
                    <q-input
                      v-model="wishedSalary"
                      label="Sueldo Deseado"
                      borderless
                      readonly
                      disable
                      class="col-3"
                      >
                      <template v-slot:before>
                        <q-icon name="attach_money" :color="wishedSalary != ''
                        ? 'blue-grey-8'
                        : 'grey-6 '
                        "
                        />
                      </template>
                    </q-input>
                    <q-input
                      v-model="languages"
                      label="Idiomas dominados"
                      borderless
                      autogrow
                      readonly
                      disable
                      class="col-3"
                      >
                      <template v-slot:before>
                        <q-icon name="language" :color="languages != ''
                        ? 'blue-grey-8'
                        : 'grey-6 '
                        "
                        />
                      </template>
                    </q-input>
                    <q-input
                      v-model="lastSchool"
                      label="Institución"
                      borderless
                      autogrow
                      readonly
                      disable
                      class="col-3"
                      >
                      <template v-slot:before>
                        <q-icon name="apartment" :color="lastSchool != ''
                        ? 'blue-grey-8'
                        : 'grey-6 '
                        "
                        />
                      </template>
                    </q-input>
                  </div>
                  <div
                    class="q-mt-sm q-mb-sm self-center text-blue-grey-8 text-body1"
                  >
                    Personal
                    <q-separator color="blue-5" />
                  </div>
                  <div class="row justify-between q-ma-md">
                    <q-input
                      v-model="age"
                      label="Edad"
                      borderless
                      readonly
                      disable
                      class="col-3"
                      >
                      <template v-slot:before>
                        <q-icon name="face" :color="age != ''
                        ? 'blue-grey-8'
                        : 'grey-6 '
                        "
                        />
                      </template>
                    </q-input>
                    <q-input
                      v-model="sex"
                      label="Sexo"
                      borderless
                      readonly
                      disable
                      class="col-3"
                      >
                      <template v-slot:before>
                        <q-icon name="people" :color="sex != ''
                        ? 'blue-grey-8'
                        : 'grey-6 '
                        "
                        />
                      </template>
                    </q-input>
                    <q-input
                      v-model="phoneNumber"
                      label="Número de teléfono"
                      borderless
                      readonly
                      disable
                      class="col-3"
                      >
                      <template v-slot:before>
                        <q-icon name="phone" :color="phoneNumber != ''
                        ? 'blue-grey-8'
                        : 'grey-6 '
                        "
                        />
                      </template>
                    </q-input>
                  </div>
                  <div class="row justify-between q-ma-md">
                    <q-input
                      v-model="birthday"
                      label="Fecha de nacimiento"
                      borderless
                      readonly
                      disable
                      class="col-3"
                    >
                      <template v-slot:before>
                        <q-icon name="cake" :color="birthday != ''
                        ? 'blue-grey-8'
                        : 'grey-6 '
                        "
                        />
                      </template>
                    </q-input>
                    <q-input
                      v-model="state"
                      label="Estado"
                      borderless
                      autogrow
                      readonly
                      disable
                      class="col-3"
                    >
                      <template v-slot:before>
                        <q-icon name="map" :color="state != ''
                        ? 'blue-grey-8'
                        : 'grey-6 '
                        "
                        />
                      </template>
                    </q-input>
                    <q-input
                      v-model="city"
                      label="Ciudad"
                      borderless
                      autogrow
                      readonly
                      disable
                      class="col-3"
                    >
                      <template v-slot:before>
                        <q-icon name="location_on" :color="city != ''
                        ? 'blue-grey-8'
                        : 'grey-6 '
                        "
                        />
                      </template>
                    </q-input>
                  </div>
                </q-card-actions>
              </q-card-section>
            </q-expansion-item>
          </q-card>
        </div>
      </q-layout>
    </q-dialog>

    <q-dialog v-model="openDialog2" allow-focus-outside seamless>
      <q-layout
        view="hHh lpr fff"
        container
        style="min-width: 800px; max-height: 450px"
        class="shadow-24"
      >
        <q-header bordered class="bg-white text-black">
          <q-toolbar>
            <q-toolbar-title>
              <q-avatar
                style="font-size: 50px"
                flat
                round
                dense
                icon="assignment_ind"
              />
              Datos de la cita
            </q-toolbar-title>
            <q-btn
              v-if="active === 1"
              style="font-size: 15px"
              flat
              round
              dense
              icon="edit"
              class="q-mr-sm"
              @click="onModification"
            >
              <q-tooltip> Modificar </q-tooltip>
            </q-btn>
            <q-btn
              v-if="active === 1"
              style="font-size: 15px"
              flat
              round
              dense
              icon="delete"
              class="q-mr-sm"
              @click="deactivateAppointment"
            >
              <q-tooltip> Eliminar </q-tooltip>
            </q-btn>

            <q-btn
              style="font-size: 15px"
              flat
              round
              dense
              icon="close"
              @click="closeShowAppointmentDialog"
            >
              <q-tooltip> Cerrar ventana </q-tooltip>
            </q-btn>
          </q-toolbar>
        </q-header>
        <q-page-container
          style="max-width: fit-content; max-height: fit-content"
        >
          <q-card
            style="
              width: 100%;
              min-width: fit-content;
              height: fit-content;
              min-height: fit-content;
              max-height: 400px;
            "
          >
            <q-card-section horizontal>
              <div class="q-ma-md">
                <q-img
                  style="width: 260px; height: 260px; border-radius: 15px"
                  :src="getUserImage"
                />
              </div>
              <div class="q-ma-md">
                <div class="row q-mb-md">
                  <q-input
                    v-model="candidateSelection"
                    label="Nombre del candidato"
                    readonly
                    disable
                    class="q-mb-md"
                    style="width: 99%"
                  />
                  <q-input
                    v-model="selectDay"
                    label="Fecha"
                    readonly
                    disable
                    class="q-mr-lg"
                    style="width: 46%"
                  />
                  <q-input
                    v-model="selectedHour"
                    mask="time"
                    label="Hora"
                    readonly
                    disable
                    style="width: 46%"
                    lazy-rules
                    :rules="[
                      (value) => !!value || 'La hora de la cita es requerida',
                    ]"
                  >
                  </q-input>
                  <q-input
                    v-model="selectedModality"
                    label="Modalidad"
                    readonly
                    disable
                    style="width: 46%"
                    lazy-rules
                    :rules="[
                      (value) => !!value || 'La hora de la cita es requerida',
                    ]"
                  >
                  </q-input>

                  <q-input
                    v-if="selectedModality === 'Virtual'"
                    v-model="linkData"
                    label="Link de la reunión"
                    readonly
                    disable
                    class="q-ml-lg"
                    style="width: fit-content"
                  />

                  <q-btn
                    v-if="selectedModality === 'Virtual' && active === 1"
                    class="bg-white text-black q-mt-md"
                    rounded
                    icon="mdi-open-in-new"
                    style="width: fit-content; height: fit-content"
                    :href="linkData"
                    target="_blank"
                  >
                    <q-tooltip class="bg-blue-5"> Entrar a la cita </q-tooltip>
                  </q-btn>
                </div>
              </div>
            </q-card-section>
            <!--  BUTTONS ---------------------------------------------------------------------------------->
            <q-card-actions align="right">
              <q-btn
                :disable="active === 0"
                flat
                :label="
                  appointmentStatus === 'P'
                    ? 'Marcar cita completada'
                    : appointmentStatus === 'C'
                    ? 'Cancelada'
                    : 'Completada'
                "
                :icon="
                  appointmentStatus === 'P'
                    ? 'done'
                    : appointmentStatus === 'C'
                    ? 'event_busy'
                    : 'event_available'
                "
                @click="completeAppointment()"
                class="text-black"
              />
            </q-card-actions>
          </q-card>
        </q-page-container>
        <!--paste here the user information section-->
        <!--User Information-->
        <!--REFACTOR REQUIRED. The distribution of the elements in the div is not a good practice-->

        <div class="col">
          <q-card class="col-auto" style="height: 100%">
            <q-expansion-item
              expand-separator
              icon="perm_identity"
              label="Información Personal"
              :caption="candidateSelection != '' ? candidateSelection : ''"
            >
            <q-card-section horizontal style="height: 100%">
                <q-card-actions vertical style="width: 100%">
                  <div
                    class="q-mt-sm q-mb-sm self-center text-blue-grey-8 text-body1"
                  >
                    Profesional
                    <q-separator color="blue-5" />
                  </div>
                  <div class="row justify-around q-ml-xl" >
                    <q-btn-dropdown
                      flat
                      auto-close
                      color="white"
                      :text-color="studyLevel != ''
                        ? 'blue-grey-8'
                        : 'grey-6'
                        "
                      icon="visibility"
                      label="Ver candidaturas"
                      class="text-weight-regular col-3"
                      dropdown-content-class="flexible-width"
                    >
                      <q-list>
                        <q-item
                          v-for="(item, index) in jobsApplications"
                          :key="index"
                          v-close-popup
                          @click="onModalitySelection(item)"
                        >
                          <q-item-section avatar>
                            <q-avatar
                              icon="mdi-briefcase"
                              color="blue-grey-8"
                              text-color="white"
                            />
                          </q-item-section>
                          <q-item-section>
                            <q-item-label>{{ item }}</q-item-label>
                          </q-item-section>
                        </q-item>
                      </q-list>
                    </q-btn-dropdown>
                    <q-input
                      v-model="studyLevel"
                      label="Grado Estudios"
                      borderless
                      readonly
                      disable
                      class="col-3 text-blue-grey-8"
                    >
                      <template v-slot:before>
                        <q-icon name="school" :color="studyLevel != ''
                        ? 'blue-grey-8'
                        : 'grey-6 '
                        "/>
                      </template>
                    </q-input>
                    <q-input
                      v-model="speciality"
                      label="Especialidad"
                      autogrow
                      borderless
                      readonly
                      disable
                      class="col-3"
                      >
                      <template v-slot:before>
                        <q-icon name="school" :color="speciality != ''
                        ? 'blue-grey-8'
                        : 'grey-6 '
                        "/>
                      </template>
                    </q-input>
                  </div>
                  <div class="row justify-around q-mt-md q-ml-xl">
                    <q-input
                      v-model="wishedSalary"
                      label="Sueldo Deseado"
                      borderless
                      readonly
                      disable
                      class="col-3"
                      >
                      <template v-slot:before>
                        <q-icon name="attach_money" :color="wishedSalary != ''
                        ? 'blue-grey-8'
                        : 'grey-6 '
                        "
                        />
                      </template>
                    </q-input>
                    <q-input
                      v-model="languages"
                      label="Idiomas dominados"
                      borderless
                      autogrow
                      readonly
                      disable
                      class="col-3"
                      >
                      <template v-slot:before>
                        <q-icon name="language" :color="languages != ''
                        ? 'blue-grey-8'
                        : 'grey-6 '
                        "
                        />
                      </template>
                    </q-input>
                    <q-input
                      v-model="lastSchool"
                      label="Institución"
                      borderless
                      autogrow
                      readonly
                      disable
                      class="col-3"
                      >
                      <template v-slot:before>
                        <q-icon name="apartment" :color="lastSchool != ''
                        ? 'blue-grey-8'
                        : 'grey-6 '
                        "
                        />
                      </template>
                    </q-input>
                  </div>
                  <div
                    class="q-mt-md q-mb-sm self-center text-blue-grey-8 text-body1"
                  >
                    Personal
                    <q-separator color="blue-5" />
                  </div>
                  <div class="row justify-around q-mt-md q-ml-xl">
                    <q-input
                      v-model="age"
                      label="Edad"
                      borderless
                      readonly
                      disable
                      class="col-3"
                      >
                      <template v-slot:before>
                        <q-icon name="face" :color="age != ''
                        ? 'blue-grey-8'
                        : 'grey-6 '
                        "
                        />
                      </template>
                    </q-input>
                    <q-input
                      v-model="sex"
                      label="Sexo"
                      borderless
                      readonly
                      disable
                      class="col-3"
                      >
                      <template v-slot:before>
                        <q-icon name="people" :color="sex != ''
                        ? 'blue-grey-8'
                        : 'grey-6 '
                        "
                        />
                      </template>
                    </q-input>
                    <q-input
                      v-model="phoneNumber"
                      label="Número de teléfono"
                      borderless
                      readonly
                      disable
                      class="col-3"
                      >
                      <template v-slot:before>
                        <q-icon name="phone" :color="phoneNumber != ''
                        ? 'blue-grey-8'
                        : 'grey-6 '
                        "
                        />
                      </template>
                    </q-input>
                  </div>
                  <div class="row justify-around q-mt-md q-ml-xl">
                    <q-input
                      v-model="birthday"
                      label="Fecha de nacimiento"
                      borderless
                      readonly
                      disable
                      class="col-3"
                    >
                      <template v-slot:before>
                        <q-icon name="cake" :color="birthday != ''
                        ? 'blue-grey-8'
                        : 'grey-6 '
                        "
                        />
                      </template>
                    </q-input>
                    <q-input
                      v-model="state"
                      label="Estado"
                      borderless
                      autogrow
                      readonly
                      disable
                      class="col-3"
                    >
                      <template v-slot:before>
                        <q-icon name="map" :color="state != ''
                        ? 'blue-grey-8'
                        : 'grey-6 '
                        "
                        />
                      </template>
                    </q-input>
                    <q-input
                      v-model="city"
                      label="Ciudad"
                      borderless
                      autogrow
                      readonly
                      disable
                      class="col-3"
                    >
                      <template v-slot:before>
                        <q-icon name="location_on" :color="city != ''
                        ? 'blue-grey-8'
                        : 'grey-6 '
                        "
                        />
                      </template>
                    </q-input>
                  </div>
                </q-card-actions>
              </q-card-section>
            </q-expansion-item>
          </q-card>
        </div>
      </q-layout>
    </q-dialog>

    <!--DIALOG TO SHOW MORE APPOINTMENTS WHEN A DAY HAS MORE OF 3 APPOINTMENTS REGISTERED FOR THAT DAY-->
    <q-dialog auto-close seamless v-model="dayAppointmentsDialog">
      <q-card-section class="bg-white shadow-24">
        <div class="row items-center justify-between" style="width: 100%">
          <div class="text-body1 text-weight-medium">Citas del día:</div>
          <q-btn
            style="font-size: 15px"
            flat
            round
            dense
            icon="close"
            @click="dayAppointmentsDialog = false"
          >
            <q-tooltip> Cerrar ventana </q-tooltip>
          </q-btn>
        </div>
        <p>{{ appointmentDaysList[0].date }}</p>
        <div>
          <q-btn
            v-for="(event, index) in appointmentDaysList"
            :key="index"
            class="text-black text-caption q-mb-md appointmentCard"
            icon="assignment_ind"
            :style="{ 'background-color': event.color }"
            @click="showEventData(event)"
          >
            {{
              (event.hour ? " - " + event.hour : "") +
              " " +
              (event.modality === "V"
                ? "Virtual"
                : event.modality === "P"
                ? "Presencial"
                : event.modality)
            }}

            <q-tooltip>{{
              "Citado: " +
              event.name +
              " " +
              event.fatherLastName +
              " " +
              event.motherLastName
            }}</q-tooltip>
          </q-btn>
        </div>
      </q-card-section>
    </q-dialog>
  </q-layout>
</template>

<script setup>
import {
  QCalendarMonth,
  today,
  parseDate,
  parseTimestamp,
  /*--------*/
} from "@quasar/quasar-ui-qcalendar/src/index.js";
import "@quasar/quasar-ui-qcalendar/src/QCalendarVariables.sass";
import "@quasar/quasar-ui-qcalendar/src/QCalendarTransitions.sass";
import "@quasar/quasar-ui-qcalendar/src/QCalendarMonth.sass";
import prev from "../components/Prev.vue";
import next from "../components/Next.vue";
import todayComponent from "../components/Today.vue";
import { ref, computed, onMounted, onUnmounted, onBeforeMount } from "vue";
import { useQuasar } from "quasar";
import { getAssetsPath } from "src/utils/folderPaths";
import { getS3FileUrl } from "src/services/profiles.js";
import {
  getLinksList,
  getAppointmentsCatalog,
  getAppointmentsHistory,
  postAppointment,
  putAppointment,
  deleteAppointment,
} from "src/services/administrators/Agenda.js";
import { getUserImagesPath } from "src/utils/folderPaths.js";
import {
  scheduledAppointment,
  modifiedAppointment,
  canceledAppointment,
  finishedAppointment,
  sendEmail,
} from "src/services/mail.js";
import {
  sendWhatsAppMessage,
} from "src/services/whatsApp";
import { getAge } from "src/utils/operations";
import { notifyPositive, notifyNegative } from "src/utils/notifies.js";
import { getAllCandidatesDiary } from "src/services/candidates";
import { useRouter } from "vue-router";
import { useAuthStore } from "src/stores/auth";
import { setHeaderAuthorization } from "src/services/user";
import { useLocalStorageStore } from "src/stores/localStorage";
import { storeToRefs } from "pinia";
/* REF CONSTANTS ---------------------------------------------------------------------------------------------------------------------------------------------------- */

const useAuth = useAuthStore();
const { user, logged } = storeToRefs(useAuth);
const useLocalStorage = useLocalStorageStore();
const router = useRouter();
const $q = useQuasar();
const appointmentId = ref("");
const userID = ref("");
const name = ref("");
const photoUUID = ref("");
const hex = ref("");
const meetingPlatform = ref([]);
const calendar = ref(null);
const candidateSelection = ref("");
const fatherLastName = ref("");
const motherLastName = ref("");
const platformSelectedID = ref(0);
const linkData = ref("");
const selectDay = ref("");
const selectedHour = ref("");
const selectedModality = ref("");
const createdBy = ref("");
const active = ref();
const color = ref("");
const selectedDate = ref(today());
const email = ref("");
const phoneNumber = ref("");
const locale = ref(""); // YOU CAN DEFINE THE LOCALE AS YOU NEED, IS THE LANGUAGE SELECTION BASICALLY
const selectedMonth = ref(new Date().getMonth());
const confirm = ref(false); //show the qdialog
const small = ref(false); //show the qdialog
const openDialog2 = ref(false);
const dropdownContentClass = "flexible-width";
const hoverable = ref(true);
const focusable = ref(true);
const focusType = ref(["day", "date"]);
const drawerLeft = ref(false);
const drawerRight = ref(false);
const showSearch = ref(false);
const showSearchResults = ref(false);
const searchedAppointments = ref([]);
const candidatesAvailable = ref(true);
const dayAppointmentsDialog = ref(false);
const searchInput = ref("");
const updateSelection = ref(false);
const timestampDate = ref();
const showCitedCandidates = ref(false);
const filter = ref("");
const noDataLabel = ref("No hay candidatos a mostrar");
const loading = ref(false);
const totalTableRows = ref([]);
const disableCheckbox = ref(false);
const firstDateRange = ref("");
const secondDateRange = ref("");
const selectedPlatform = ref("");
const modifiedBy = ref("");
const appointmentStatus = ref("");
const candidateStatus = ref("");
const appointmentDaysList = ref([]);
const events = ref([]); //this is the array where the appointments are

//USER INFORMATION
const civilStatus = ref(""); //TODO: delete this const
const jobsApplications = ref([]);
const studyLevel = ref("");
const speciality = ref("");
const wishedSalary = ref("");
const languages = ref("");
const lastSchool = ref("");

const age = ref("");
const birthday = ref("");
const sex = ref("");
const city = ref("");
const state = ref("");

let comparativeAppointment;
/*filters*/
const filterSearchedAppointments = ref("filterAll");

const colorPalette = [
  //first row
  "#ffcccc",
  "#ffe6cc",
  "#ffffcc",
  "#ccffcc",
  "#ccffe6",
  "#ccffff",
  "#cce6ff",
  "#ccccff",
  "#e6ccff",
  "#ffccff",
  //second row
  "#ff9999",
  "#ffcc99",
  "#ffff99",
  "#99ff99",
  "#99ffcc",
  "#99ffff",
  "#99ccff",
  "#9999ff",
  "#cc99ff",
  "#ff99ff",
  //thrid row
  "#ff6666",
  "#ffb366",
  "#ffff66",
  "#66ff66",
  "#66ffb3",
  "#66ffff",
  "#66b3ff",
  "#6666ff",
  "#b366ff",
  "#ff66ff",
];
/* Eventos del teclado */

onBeforeMount(() => {
  loadLocalStorage();
})

onMounted(() => {
  getCandidatesCatalog();
  getAppointments();
  getPlatforms();
  window.addEventListener("keydown", windowKeydownListener);
});

onUnmounted(() => {
  window.removeEventListener("keydown", windowKeydownListener);
});

const loadLocalStorage = () => {
  const userStored = useLocalStorage.load("user");
  const loggedStored = useLocalStorage.load("logged");

  if (userStored) {
    user.value = userStored;
    createdBy.value = user.value.id;
    modifiedBy.value = user.value.id;
    setHeaderAuthorization(userStored.token);
  }

  if (loggedStored) logged.value = loggedStored;
};

const windowKeydownListener = (event) => {
  if (
    event.key === "Enter" &&
    showSearch.value === true &&
    firstDateRange.value != "" &&
    secondDateRange.value != ""
  ) {
    getHistory();
  }
};

const toHome = () => {
  router.push("/home");
};

const filteredSearchedAppointments = computed(() => {
  return searchedAppointments.value.filter((item) => {
    return filterAppointment(item);
  });
});

const filterAppointment = (item) => {
  if (filterSearchedAppointments.value === "filterAll") {
    return item;
  } else if (filterSearchedAppointments.value === "filterInactive") {
    return item.active === 0;
  } else if (filterSearchedAppointments.value === "filterInterviewed") {
    return item.appointmentStatus === "F";
  } else if (filterSearchedAppointments.value === "filterCanceled") {
    return item.appointmentStatus === "C";
  }
};

/* Functions ---------------------------------------------------------------------------------------------------------------------------------------------------- */

const filterHistory = computed(() => {
  return events.value.filter((data) => {
    return data.name.toLowerCase().includes(searchInput.value.toLowerCase());
  });
});

const cleanSearchInput = () => {
  searchInput.value = ""; // Establece el valor del input como una cadena vacía
};

const getUserImage = computed(() => {
  if (
    photoUUID.value === null ||
    photoUUID.value === undefined ||
    photoUUID.value === ""
  ) {
    return getS3FileUrl(getUserImagesPath, "default.png");
  } else {
    return getS3FileUrl(getUserImagesPath, photoUUID.value);
  }
});

//This filter checks the checkbox in the table of candidates, and if it´s checked then it returns true so the list of the candidates is going to show
//only the candidates with the status of C = citados if not, then is going to show the candidates with the status different than C which are P = pendientes and E = Entrevistados
const filteredRows = computed(() => {
  const filtered = totalTableRows.value.filter((candidate) => {
    return showCitedCandidates.value
      ? candidate.status === "C"
      : candidate.status != "C";
  });

  if (filtered.length < 1) {
    candidatesAvailable.value = false;
  } else {
    candidatesAvailable.value = true;
  }

  return filtered;
});

const filteredMeetingPlatform = computed(() => {
  return meetingPlatform.value.filter((data) => {
    return data.platformName != "Presencial";
  });
});

const getPlatforms = async () => {
  const request = await getLinksList();
  if (request != null) {
    meetingPlatform.value = request;
  }
  if (meetingPlatform.value == null) {
    $q.notify({
      type: "negative",
      message: "Hubo un problema al obtener la lista de plataformas virtuales",
      position: "top",
      timeout: 5000,
      actions: [{ label: "Cerrar", color: "yellow" }],
    });
  }
};

const getAppointments = async () => {
  loading.value = true;
  disableCheckbox.value = true;
  const request = await getAppointmentsCatalog();
  if (request != null) {
    loading.value = false;
    disableCheckbox.value = false;
    events.value = request;
  } else {
    $q.notify(notifyNegative("Hubo un problema al obtener la lista de citas"));
    loading.value = false;
    noDataLabel.value = "Error al obtener la lista de citas";
    disableCheckbox.value = true;
  }
};

const getCandidatesCatalog = async () => {
  loading.value = true;
  disableCheckbox.value = true;
  const request = await getAllCandidatesDiary();
  if (request != null) {
    loading.value = false;
    disableCheckbox.value = false;
    totalTableRows.value = request;
    console.log(totalTableRows.value);
  } else {
    $q.notify(
      notifyNegative("Hubo un problema al obtener la lista de candidatos")
    );
    loading.value = false;
    noDataLabel.value = "Error al obtener la lista de candidatos";
    disableCheckbox.value = true;
  }
};

const getHistory = async () => {
  const firstDate = parseDates(firstDateRange.value);
  const secondDate = parseDates(secondDateRange.value);

  if (firstDate <= secondDate) {
    $q.loading.show();
    const request = await getAppointmentsHistory(
      firstDateRange.value,
      secondDateRange.value
    );
    if (request != null) {
      searchedAppointments.value = request;
      showSearchResults.value = true;
      $q.loading.hide();
    } else {
      $q.loading.hide();
      $q.notify(notifyNegative("Hubo un problema al obtener el historial"));
    }
  } else {
    $q.notify(
      notifyNegative("Selecciona una fecha inicial inferior a la fecha final")
    );
  }
};

const closeSearch = () => {
  showSearch.value = !showSearch.value;
  showSearchResults.value = false;
  searchedAppointments.value = "";
  searchInput.value = "";
};

const showDaysAppointmentList = (data) => {
  dayAppointmentsDialog.value = true;
  openDialog2.value = false;
  confirm.value = false;
  appointmentDaysList.value = data;
};

const showEventData = (event) => {
  //Apertura de dialogo de lectura y cerrado de dialogo de registro
  openDialog2.value = true;
  confirm.value = false;

  candidateSelection.value =
    event.name + " " + event.fatherLastName + " " + event.motherLastName;
  /*Datos necesarios para operaciones CRUD*/
  appointmentId.value = event.appointmentId;
  platformSelectedID.value = event.linkID;
  userID.value = event.userID;
  active.value = event.active;
  selectDay.value = event.date;
  selectedHour.value = event.hour;
  if (event.modality == "V") {
    selectedModality.value = "Virtual";
  } else if (event.modality == "P") {
    selectedModality.value = "Presencial";
  }
  hex.value = event.color;
  appointmentStatus.value = event.appointmentStatus;
  candidateStatus.value = event.candidateStatus;
  fatherLastName.value = event.fatherLastName;
  motherLastName.value = event.motherLastName;
  linkData.value = event.link;
  name.value = event.name;
  photoUUID.value = event.photoUUID;
  selectedPlatform.value = event.platformName;
  email.value = event.email;
  phoneNumber.value = event.phoneNumber;
  birthday.value = event.birthday;
  sex.value = event.sex;
  wishedSalary.value = event.wishedSalary;
  if(event.sex == "M"){
    sex.value = "Masculino";
  } else if(event.sex == "F"){
    sex.value = "Femenino";
  } else {
    sex.value = "Otro"
  }
  city.value = event.city;
  state.value = event.state;
  languages.value = event.languages;
  jobsApplications.value = event.jobNames;

  if(event.levelOfStudy == null){
    studyLevel.value = "No especificado";
  } else {
    studyLevel.value = event.levelOfStudy;
  }

  if(event.lastSchoolSpeciality == null){
    speciality.value = "No especificado";
  } else {
    speciality.value = event.lastSchoolSpeciality;
  }

  if(event.lastSchool == null){
    lastSchool.value = "No especificado";
  } else {
    lastSchool.value = event.lastSchool;
  }

  age.value = getAge(event.birthday);
  comparativeAppointment = {
    linkID: platformSelectedID.value,
    date: selectDay.value,
    hour: selectedHour.value,
  };
};

const onModification = () => {
  openDialog2.value = false;
  confirm.value = true;
  updateSelection.value = true;
};

const columns = [
  {
    name: "name",
    label: "Candidatos",
    required: true,
    align: "left",
    field: (row) => row.name,
    sortable: true,
  },
  {
    name: "celphone",
    label: "Teléfono",
    required: true,
    align: "right",
    field: (row) => row.celphone,
    sortable: true,
  },
];

//to navigate between the different months
const searchActivation = () => {
  showSearch.value = true;
  drawerLeft.value = true;
};

const onNext = () => {
  calendar.value.next();
  selectedMonth.value += 1;
};

const onPrev = () => {
  calendar.value.prev();
  selectedMonth.value -= 1;
};

const onToday = () => {
  calendar.value.moveToToday();
  selectedDate.value =
    today(); /*Parte del evento para mostrar la targeta en cada día */
  selectedMonth.value = new Date().getMonth();
};

const formattedMonth = computed(() => {
  const date = new Date();
  date.setMonth(selectedMonth.value);
  return monthFormatter().format(date) + " " + date.getFullYear();
});

const monthFormatter = () => {
  try {
    return new Intl.DateTimeFormat(locale.value || undefined, {
      month: "long",
      timeZone: "UTC",
    });
  } catch (e) {
    // Manejar el error según sea necesario
  }
};

const checkSelection = (candidate) => {
  let check = true;

  if (candidate.status === "C") {
    check = false;
  }

  return check;
};

//Function to convert the date string to a date object
const parseDates = (dateStr) => {
  const [year, month, day] = dateStr.split("/").map(Number);
  return new Date(year, month - 1, day);
};

/*ADD EVENTS ===================================================================================================================================== */
const checkVariablesToCreateMethod = () => {
  return !!(
    candidateSelection.value != "" &&
    userID.value != "" &&
    createdBy.value != "" &&
    selectDay.value != "" &&
    selectedHour.value != ""
  );
};

const checkVariablesToUpdateMethod = () => {
  return !!(
    appointmentId.value != "" &&
    candidateSelection.value != "" &&
    userID.value != "" &&
    selectDay.value != "" &&
    selectedHour.value != ""
  );
};

const asignDefaultPlatform = () => {
  //The platform selected is inicializated in 0 because of the id of every platform in the database. 0 isn´t a platform in the database and 4 is Presential mode
  if (platformSelectedID.value === 0 || platformSelectedID.value === 4) {
    platformSelectedID.value = 3; //Default platform "Zoom" if a platform is not selected
    selectedPlatform.value = "Zoom"; //Default platform name if a platform is not selected
  }
};

const postVirtualAppointment = async () => {
  $q.loading.show();
  asignDefaultPlatform();

  /* Object creation and insertion */
  const appointment = {
    linkID: platformSelectedID.value,
    userID: userID.value,
    active: 1,
    createdBy: createdBy.value,
    date: selectDay.value,
    hour: selectedHour.value,
    modality: "V",
    color: hex.value,
    appointmentStatus: "P",
    candidateStatus: "C",
  };
  const request = await postAppointment(appointment);

  if (request != null) {
    let getInsertedAppointment = request;
    const candidateIndex = totalTableRows.value.findIndex(
      (candidate) => candidate.userID === request.userID
    );
    totalTableRows.value[candidateIndex].status = "C";
    events.value.push(getInsertedAppointment);

    $q.notify(notifyPositive("Cita registrada exitosamente!"));
    $q.loading.hide();
    confirm.value = false; //close the dialog

    /* Send a WhatsApp Message */
    const data = {
      phoneNumber: phoneNumber.value,
      name: name.value,
      date: selectDay.value,
      hour: selectedHour.value,
      platformName: selectedPlatform.value,
      link: getInsertedAppointment.link,
      supportEmail: "reclutamiento@turbomaquinas.com",
    };
    sendWhatsAppMessage("virtual", data);

    /* Send an Email*/
    const mailData = {
      to: email.value,
      subject: scheduledAppointment.subject,
      name: name.value,
      firstText: scheduledAppointment.firstText,
      date: selectDay.value,
      hour: selectedHour.value,
      modality: "Virtual",
      platformName: selectedPlatform.value,
      lastText: scheduledAppointment.lastText,
      link: getInsertedAppointment.link,
      emailType: scheduledAppointment.emailType,
    };
    sendEmail("scheduled-appointment", mailData);

    candidateSelection.value = "";
    selectedPlatform.value = "";
    userID.value = "";
    selectedHour.value = "";
    selectedModality.value = "";
    linkData.value = "";
    color.value = "";
  } else {
    $q.notify(notifyNegative("Hubo un error al registrar la cita"));
    $q.loading.hide();
  }
};

const postPresentialAppointment = async () => {
  $q.loading.show();
  /* Object creation and insertion */
  const appointment = {
    userID: userID.value,
    linkID: 4,
    active: 1,
    createdBy: createdBy.value,
    date: selectDay.value,
    hour: selectedHour.value,
    modality: "P",
    color: hex.value,
    appointmentStatus: "P",
    candidateStatus: "C",
  };
  const request = await postAppointment(appointment);

  if (request != null) {
    let getInsertedAppointment = request;
    const candidateIndex = totalTableRows.value.findIndex(
      (candidate) => candidate.userID === request.userID
    );
    totalTableRows.value[candidateIndex].status = "C";
    events.value.push(getInsertedAppointment);

    $q.notify(notifyPositive("Cita registrada exitosamente!"));
    $q.loading.hide();
    confirm.value = false;

    /*Send a WhatsApp Message */
    const data = {
      phoneNumber: phoneNumber.value,
      name: name.value,
      date: selectDay.value,
      hour: selectedHour.value,
      supportEmail: "reclutamiento@turbomaquinas.com",
    };
    sendWhatsAppMessage("presential", data);

    /*Send an Email */
    const mailData = {
      to: email.value,
      subject: scheduledAppointment.subject,
      name: name.value,
      firstText: scheduledAppointment.firstText,
      date: selectDay.value,
      hour: selectedHour.value,
      modality: "Presencial",
      lastText: scheduledAppointment.lastText,
      emailType: scheduledAppointment.emailType,
    };
    sendEmail("scheduled-appointment", mailData);

    candidateSelection.value = "";
    userID.value = "";
    platformSelectedID.value = 0;
    selectedHour.value = "";
    selectedModality.value = "";
    linkData.value = "";
    color.value = "";
  } else {
    $q.notify(notifyNegative("Hubo un error al registrar la cita"));
    $q.loading.hide();
  }
};

const createAppointment = () => {
  if (selectedModality.value === "Virtual" && checkVariablesToCreateMethod()) {
    postVirtualAppointment();
  } else if (
    selectedModality.value === "Presencial" &&
    checkVariablesToCreateMethod()
  ) {
    postPresentialAppointment();

    /* Fields exceptions */
  } else if (candidateSelection.value == "") {
    $q.notify(notifyNegative("Seleccione un candidato"));
  } else if (selectedHour.value == "") {
    $q.notify(notifyNegative("Seleccione una hora"));
  } else if (selectedModality.value == "") {
    $q.notify(notifyNegative("Seleccione una modalidad"));
  }
};

const putVirtualApppointment = async () => {
  $q.loading.show();
  asignDefaultPlatform();
  const appointment = {
    appointmentId: appointmentId.value,
    userID: userID.value,
    linkID: platformSelectedID.value,
    modifiedBy: modifiedBy.value,
    date: selectDay.value,
    hour: selectedHour.value,
    modality: "V",
    color: hex.value,
  };
  const request = await putAppointment(appointment);

  if (request != null) {
    let updatedAppointment = request;
    const appointmentIndex = events.value
      .map((event) => {
        return event.appointmentId;
      })
      .indexOf(appointment.appointmentId);
    events.value[appointmentIndex] = updatedAppointment;
    $q.notify(notifyPositive("Cita actualizada exitosamente!"));
    $q.loading.hide();
    confirm.value = false;

    /* Comparative values to check if the appointment has change is some value, if any of the values has not changed, then the email and whatsApp will not be sended to the users */
    if (
      updatedAppointment.linkID != comparativeAppointment.linkID ||
      updatedAppointment.date != comparativeAppointment.date ||
      updatedAppointment.hour != comparativeAppointment.hour
    ) {
      /*Send a WhatsApp Message */
      const data = {
        phoneNumber: phoneNumber.value,
        name: name.value,
        date: selectDay.value,
        hour: selectedHour.value,
        platformName: selectedPlatform.value,
        link: updatedAppointment.link,
        supportEmail: "reclutamiento@turbomaquinas.com",
      };
      sendWhatsAppMessage("virtual/change", data);

      /*Send an Email message */
      const mailData = {
        to: email.value,
        subject: modifiedAppointment.subject,
        name: name.value,
        firstText: modifiedAppointment.firstText,
        date: selectDay.value,
        hour: selectedHour.value,
        modality: "Virtual",
        platformName: selectedPlatform.value,
        lastText: modifiedAppointment.lastText,
        link: updatedAppointment.link,
        emailType: modifiedAppointment.emailType,
      };
      sendEmail("modified-appointment", mailData);
    }

    candidateSelection.value = "";
    userID.value = "";
    platformSelectedID.value = 0;
    selectedPlatform.value = "";
    selectedHour.value = "";
    selectedModality.value = "";
    linkData.value = "";
    color.value = "";
  } else {
    $q.notify(notifyNegative("Hubo un error al actualizar la cita"));
    $q.loading.hide();
  }
};

const putPresentialAppointment = async () => {
  $q.loading.show();
  const appointment = {
    appointmentId: appointmentId.value,
    userID: userID.value,
    linkID: 4,
    modifiedBy: modifiedBy.value,
    date: selectDay.value,
    hour: selectedHour.value,
    modality: "P",
    color: hex.value,
  };
  const request = await putAppointment(appointment);

  if (request != null) {
    let updatedAppointment = request;
    const appointmentIndex = events.value
      .map((event) => {
        return event.appointmentId;
      })
      .indexOf(appointment.appointmentId);
    events.value[appointmentIndex] = updatedAppointment;
    $q.notify(notifyPositive("Cita actualizada exitosamente!"));
    $q.loading.hide();
    confirm.value = false;

    if (
      updatedAppointment.linkID != comparativeAppointment.linkID ||
      updatedAppointment.date != comparativeAppointment.date ||
      updatedAppointment.hour != comparativeAppointment.hour
    ) {

      /*Send a WhatsApp Message */
      const data = {
        phoneNumber: phoneNumber.value,
        name: name.value,
        date: selectDay.value,
        hour: selectedHour.value,
        supportEmail: "reclutamiento@turbomaquinas.com",
      };
      sendWhatsAppMessage("presential/change", data);

      const mailData = {
        to: email.value,
        subject: modifiedAppointment.subject,
        name: name.value,
        firstText: modifiedAppointment.firstText,
        date: selectDay.value,
        hour: selectedHour.value,
        modality: "Presencial",
        platformName: selectedPlatform.value,
        lastText: modifiedAppointment.lastText,
        link: updatedAppointment.link,
        emailType: modifiedAppointment.emailType,
      };
      sendEmail("modified-appointment", mailData);
    }
    candidateSelection.value = "";
    userID.value = "";
    platformSelectedID.value = 0;
    selectedHour.value = "";
    selectedModality.value = "";
    linkData.value = "";
    color.value = "";
  } else {
    $q.notify(notifyNegative("Hubo un error al actualizar la cita"));
    $q.loading.hide();
    console.log("ERROR while updating the appointment: " + error);
  }
};

const updateAppointment = async () => {
  if (selectedModality.value === "Virtual" && checkVariablesToUpdateMethod()) {
    putVirtualApppointment();
  } else if (
    selectedModality.value === "Presencial" &&
    checkVariablesToUpdateMethod()
  ) {
    putPresentialAppointment();

    /* Fields exceptions */
  } else if (candidateSelection.value == "") {
    $q.notify(notifyNegative("Seleccione un candidato"));
  } else if (selectedHour.value == "") {
    $q.notify(notifyNegative("Seleccione una hora"));
  } else if (selectedModality.value == "") {
    $q.notify(notifyNegative("Seleccione una modalidad"));
  }
};

//this maps an object with the date and every registered event in the agenda, so is the MAIN handler to know in which date are registered all the appointments, when the value in one date change, it registers the event in that date
//this and the event array are the MAIN handlers of the appointments registration in the agenda.
const eventsMap = computed(() => {
  const map = {};
  if (events.value.length > 0) {
    events.value.forEach((event) => {
      (map[event.date] = map[event.date] || []).push(event); //se hace un objeto que contine objetos difertenes, la clave de cada objeto es la fecha y el valor son arreglos con los objetos que guardan los valores de los datos de la cita
    });
  }
  return map;
});

//When a candidate is selected this recover his information in variables, then we can use his information to register an appointment or just see its information
const onCandidateSelection = (data) => {
  candidateSelection.value =
    data.name + " " + data.fatherLastName + " " + data.motherLastName;
  userID.value = data.userID;
  name.value = data.name;
  fatherLastName.value = data.fatherLastName;
  motherLastName.value = data.motherLastName;
  photoUUID.value = data.photoUUID;
  email.value = data.email;
  phoneNumber.value = data.celphone;
  birthday.value = data.birthday;
  if(data.sex == "M"){
    sex.value = "Masculino";
  } else if(data.sex == "F"){
    sex.value = "Femenino";
  } else {
    sex.value = "Otro"
  }
  wishedSalary.value = data.wishedSalary;
  city.value = data.city;
  state.value = data.state;
  languages.value = data.languages;
  jobsApplications.value = data.jobNames;

  studyLevel.value = setDefaultIfNull(data.levelOfStudy);
  speciality.value = setDefaultIfNull(data.lastSchoolSpeciality);
  lastSchool.value = setDefaultIfNull(data.lastSchool);

  age.value = getAge(data.birthday);
};

//To check the school level if there is empty then we define a default message
const setDefaultIfNull = (data) => {

  return data === null ? "No especificado" : data;

}

//the modality selection checks the platform selected and defines the varible with the selected platform and defines a virtual modality
const onModalitySelection = (data) => {
  selectedPlatform.value = data.platformName;
  platformSelectedID.value = data.id;
  selectedModality.value = "Virtual";
};

//Function to handle when a day is clicked and cleans all the variables
const onClickDay = (data) => {
  if (openDialog2.value === true || dayAppointmentsDialog.value === true) {
    confirm.value = false;
  } else if (openDialog2.value === false) {
    confirm.value = true;
    timestampDate.value = parseTimestamp(data.scope.timestamp.date);
    candidateSelection.value = "";
    selectedHour.value = "";
    selectedModality.value = "";
    selectedPlatform.value = "";
    linkData.value = "";
    hex.value = "";
    photoUUID.value = "";
    updateSelection.value = false;
    platformSelectedID.value = 0;
    if (data?.scope) {
      selectDay.value = timestampDate.value.date;
    }
    email.value = "";
    phoneNumber.value = "";
    birthday.value = "";
    sex.value = "";
    wishedSalary.value = "";
    civilStatus.value = "";
    city.value = "";
    state.value = "";
    languages.value = "";
    jobsApplications.value = "";
    studyLevel.value = "";
    speciality.value = "";
    lastSchool.value = "";
    age.value = "";
  }
};

const closeAppointmentDialog = () => {
  confirm.value = false;
};

const closeShowAppointmentDialog = () => {
  openDialog2.value = false;
  //in this function we also can clean the variables insted of doing it in the onCLickDay function
};

const deactivateAppointment = async () => {
  $q.loading.show();
  try {
    //this both const declarations are used in the database to change the status of the appointment and the status of the candidate
    const candidateStatus = "P";
    const appointmentStatus = "C";
    const request = await deleteAppointment(
      candidateStatus,
      userID.value,
      appointmentStatus,
      appointmentId.value
    );

    if (request === true) {
      const candidateIndex = totalTableRows.value.findIndex(
        (candidate) => candidate.userID === userID.value
      );
      totalTableRows.value[candidateIndex].status = "P";

      const appointmentIndex = events.value.findIndex(
        (appointment) => appointment.appointmentId === appointmentId.value
      );
      events.value.splice(appointmentIndex, 1);

      $q.notify(notifyPositive("Cita eliminada exitosamente"));
      openDialog2.value = false;
      $q.loading.hide();

      /*Send a WhatsApp Message */
      const type = "canceled";
      const data = {
        phoneNumber: phoneNumber.value,
        name: name.value,
        supportEmail: "reclutamiento@turbomaquinas.com",
      };
      sendWhatsAppMessage(type, data);

      /*Send an Email message */
      const mailData = {
        to: email.value,
        subject: canceledAppointment.subject,
        name: name.value,
        firstText: canceledAppointment.firstText,
        lastText: canceledAppointment.lastText,
        emailType: canceledAppointment.emailType,
      };
      sendEmail("canceled-appointment", mailData);
    }
  } catch (error) {
    $q.notify(
      notifyNegative("Hubo un error al eliminar la cita. Intenta de nuevo")
    );
    $q.loading.hide();
    openDialog2.value = false;
    console.log("ERROR while deactivating the appointment: " + error);
  }
};

const completeAppointment = async () => {
  $q.loading.show();
  try {
    const candidateStatus = "E";
    const appointmentStatus = "F";
    const request = await deleteAppointment(
      candidateStatus,
      userID.value,
      appointmentStatus,
      appointmentId.value
    );

    if (request === true) {
      openDialog2.value = false;

      const candidateIndex = totalTableRows.value.findIndex(
        (candidate) => candidate.userID === userID.value
      );
      totalTableRows.value[candidateIndex].status = "E";

      const appointmentIndex = events.value.findIndex(
        (appointment) => appointment.appointmentId === appointmentId.value
      );
      events.value.splice(appointmentIndex, 1);
      $q.notify(notifyPositive("Cita completada!"));
      $q.loading.hide();

      /*Send a WhatsApp Message */
      const type = "finished";
      const data = {
        phoneNumber: phoneNumber.value,
        name: name.value,
        supportEmail: "reclutamiento@turbomaquinas.com",
      };
      sendWhatsAppMessage(type, data);

      /*Send an Email message */
      const mailData = {
        to: email.value,
        subject: finishedAppointment.subject,
        name: name.value,
        firstText: finishedAppointment.firstText,
        lastText: finishedAppointment.lastText,
        emailType: finishedAppointment.emailType,
      };
      sendEmail("finished-appointment", mailData);
    }
  } catch (error) {
    $q.notify(
      notifyNegative("Hubo un error al completar la cita. Intenta nuevamente")
    );
    $q.loading.hide();
    openDialog2.value = false;
    console.log("ERROR while finishing the appointment: " + error);
  }
};
</script>

<style>
.filtered-list {
  position: absolute;
  width: 68%;
  z-index: 1;
  top: 100%;
  border-radius: 0px 0px 6px 6px;
}

.position-relative {
  position: relative;
}

.floating-checkbox {
  position: absolute;
  bottom: 20px;
  /* Ajusta la distancia desde la parte inferior según tus preferencias */
  right: 20px;
  /* Ajusta la distancia desde la derecha según tus preferencias */
}

.my-picker {
  max-width: 250px;
}

/* Estilos personalizados si los necesitas */
.delete-button:not(.q-btn-icon):hover {
  background-color: rgb(215, 86, 86);
}

.q-calendar-month__head {
  background: rgb(22, 48, 70);
  color: rgb(255, 255, 255);
}

.custom-calendar {
  color: black;
  height: 250px;
}

.custom-calendar .q-calendar-month__head {
  background-color: white;
  color: rgb(70, 70, 70);
}

.appointmentCard {
  border-radius: 15px;
  display: flex;
  align-items: center;
  font-size: 10px;
}
</style>
