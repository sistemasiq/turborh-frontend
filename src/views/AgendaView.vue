<template>
  <q-layout view="hhh LpR lfr" class="bg-white text-black">
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

        <q-img
          src="~/assets/img/logo_turbo_navegador.png"
          class="q-ml-lg q-mr-sm"
          style="width: 30px; height: 30px"
        />
        <div style="text-align: left; font-size: 22px; color: rgb(61, 61, 61)">
          Agenda de entrevistas
        </div>

        <div class="row col-auto items-center justify-center q-ml-sm">
          <todayComponent @today="onToday" />
          <prev @prev="onPrev" />
          <div style="font-size: 1.5em">{{ formattedMonth }}</div>
          <next @next="onNext" />
        </div>
      </q-toolbar>

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
            @click="getSearchedAppointments()"
          >
            <q-tooltip class="bg-white text-primary">Búsqueda</q-tooltip>
          </q-btn>
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
                  @click.prevent="getSearchedAppointments()"
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

    <q-drawer
      v-model="drawerLeft"
      side="left"
      bordered
      show-if-above
      class="drawer-container"
    >
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
                    ? "Virtual"
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
              @click="closeAppointmentDialog"
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
              style="background: rgb(234, 237, 249)"
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
                    @click="onCandidateSelection(row)"
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
                            @click="onModalitySelection(item)"
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
                      @click="newAppointment"
                      class="bg-cyan-4 text-white q-mr-xs"
                      style="border-radius: 20px"
                    />
                    <q-btn
                      v-if="updateSelection"
                      flat
                      label="Actualizar"
                      icon="update"
                      @click="updateAppointment"
                      class="bg-green-13 text-white q-mr-xs"
                      style="border-radius: 20px"
                    />
                  </div>
                </q-card-actions>
              </q-card-section>
            </q-card>
          </div>
        </q-page-container>
      </q-layout>
    </q-dialog>

    <q-dialog v-model="openDialog2" allow-focus-outside seamless>
      <q-layout
        view="hHh lpr fff"
        container
        style="min-width: 800px; max-height: 400px"
        class="shadow-24"
      >
        <q-header reveal bordered class="bg-white text-black">
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
      </q-layout>
    </q-dialog>
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
import { ref, computed, onMounted, onUnmounted } from "vue";
import { useQuasar } from "quasar";
import { getS3FileUrl } from "src/services/profiles.js";
import axios from "axios";
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
  presentialAppointmentData,
  virtualAppointmentData,
  canceledAppointmentData,
  finishedAppointmentData,
} from "src/services/whatsApp";
import { notifyPositive, notifyNegative } from "src/utils/notifies.js";
import { useRouter } from "vue-router";
/* REF CONSTANTS ---------------------------------------------------------------------------------------------------------------------------------------------------- */

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
const createdBy = ref("57");
const active = ref();
const color = ref("");
const selectedDate = ref(today());
const email = ref("");
const phoneNumber = ref("");
const locale = ref(""); // Puedes establecer el valor de la localización según tus necesidades
const selectedMonth = ref(new Date().getMonth());
const confirm = ref(false); //show the qdialog
const small = ref(false); //show the qdialog
const openDialog2 = ref(false);
const dropdownContentClass = "flexible-width";
const mostrarDialog = ref(false);
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

onMounted(() => {
  getCandidatesCatalog();
  getAppointmentsCatalog();
  getLinksList();
  window.addEventListener("keydown", windowKeydownListener);
});

onUnmounted(() => {
  window.removeEventListener("keydown", windowKeydownListener);
});

const windowKeydownListener = (event) => {
  if (
    event.key === "Enter" &&
    showSearch.value === true &&
    firstDateRange.value != "" &&
    secondDateRange.value != ""
  ) {
    getSearchedAppointments();
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
    return getS3FileUrl(getUserImagesPath, "default_user_icon.png");
  } else {
    return getS3FileUrl(getUserImagesPath, photoUUID.value);
  }
});

const filteredRows = computed(() => {
  const filtered = totalTableRows.value.filter((candidate) => {
    return showCitedCandidates.value
      ? candidate.status === "C"
      : candidate.status === "P";
  });

  console.log("asdasdscacxas", filtered.length);
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

const getLinksList = async () => {
  try {
    const request = await axios.get(`/links/list`, {
      timeout: 18000,
    });

    if (request.status === 200) {
      meetingPlatform.value = request.data;
      console.log(meetingPlatform.value);
    }
  } catch (error) {
    if (axios.isCancel(error)) {
      console.log("La solicitud fue cancelada.");
    } else {
      console.log("Error:", error);
      console.log(
        "Error al conectar con el servidor: Tiempo de espera agotado."
      );
      $q.notify({
        type: "negative",
        message:
          "Hubo un problema al obtener la lista de plataformas virtuales",
        position: "top",
        timeout: 5000,
        actions: [{ label: "Cerrar", color: "yellow" }],
      });
    }
  }
};

const getAppointmentsCatalog = async () => {
  try {
    loading.value = true;
    disableCheckbox.value = true;
    const request = await axios.get(`/appointment/list`, {
      timeout: 18000,
    });

    if (request.status === 200) {
      events.value = request.data;
      console.log("TABLA DE CITAS: ", request.data);
      loading.value = false;
      disableCheckbox.value = false;
    }
  } catch (error) {
    if (axios.isCancel(error)) {
      console.log("La solicitud fue cancelada.");
    } else {
      console.log("Error:", error);
      console.log(
        "Error al conectar con el servidor: Tiempo de espera agotado."
      );
      $q.notify({
        type: "negative",
        message: "Hubo un problema al obtener la lista de citas",
        position: "top",
        timeout: 5000,
        actions: [{ label: "Cerrar", color: "yellow" }],
      });
      loading.value = false;
      noDataLabel.value = "Error al obtener la lista de citas";
      disableCheckbox.value = true;
    }
  }
};

const getCandidatesCatalog = async () => {
  try {
    loading.value = true;
    disableCheckbox.value = true;
    const request = await axios.get(`/agenda/catalogoCandidatos`, {
      timeout: 18000,
    });

    if (request.status === 200) {
      totalTableRows.value = request.data;
      console.log("TABLA DE CANDIDATOS: ", request.data);
      loading.value = false;
      disableCheckbox.value = false;
    }
  } catch (error) {
    if (axios.isCancel(error)) {
      console.log("La solicitud fue cancelada.");
    } else {
      console.log("Error:", error);
      console.log(
        "Error al conectar con el servidor: Tiempo de espera agotado."
      );
      $q.notify({
        type: "negative",
        message: "Hubo un problema al obtener la lista de candidatos",
        position: "top",
        timeout: 5000,
        actions: [{ label: "Cerrar", color: "yellow" }],
      });
      loading.value = false;
      noDataLabel.value = "Error al obtener la lista de candidatos";
      disableCheckbox.value = true;
    }
  }
};

const getSearchedAppointments = async () => {
  const apiUrl = `/appointment/filter/date?firstDate=${firstDateRange.value}&lastDate=${secondDateRange.value}`;
  try {
    $q.loading.show();
    const request = await axios.get(apiUrl);

    if (request.status === 200) {
      $q.loading.hide();
      $q.notify({
        type: "positive",
        message: "Historial obtenido correctamente",
        position: "bottom",
        timeout: 1000,
      });
      searchedAppointments.value = request.data;
      showSearchResults.value = true;
      console.log("TABLA DE DATOS BUSCADOS: ", request.data);
    }
  } catch (error) {
    $q.loading.hide();
    $q.notify({
      type: "negative",
      message: "Error al obtener el historial",
      position: "bottom",
      timeout: 1000,
    });
    console.log("ERROR: ", error);
  }
};

const closeSearch = () => {
  showSearch.value = !showSearch.value;
  showSearchResults.value = false;
  searchedAppointments.value = "";
  searchInput.value = "";
};

const mostrarDialogo = () => {
  mostrarDialog.value = true;
};

const modifiedBy = ref("");
const appointmentStatus = ref("");
const candidateStatus = ref("");
const appointmentDaysList = ref([]);

const showDaysAppointmentList = (data) => {
  dayAppointmentsDialog.value = true;
  openDialog2.value = false;
  confirm.value = false;
  appointmentDaysList.value = data;
  console.log("DATA", data);
  console.log("ARREGLO", data);
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
  createdBy.value = event.createdBy;
  modifiedBy.value = event.modifiedBy;
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
  console.log("DATOS OBTENIDOS");
  console.log(candidateSelection);
  console.log(
    appointmentId.value,
    platformSelectedID.value,
    userID.value,
    active.value,
    createdBy.value,
    modifiedBy.value,
    selectDay.value,
    selectedHour.value,
    selectedModality.value,
    hex.value,
    appointmentStatus.value,
    candidateStatus.value,
    fatherLastName.value,
    motherLastName.value,
    name.value,
    photoUUID.value,
    selectedPlatform.value,
    "siu,",
    email.value,
    linkData.value
  );
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
/*ADD EVENTS ===================================================================================================================================== */

const events = ref([]);

const newAppointment = async () => {
  if (
    selectedModality.value === "Virtual" &&
    candidateSelection.value != "" &&
    userID.value != "" &&
    createdBy.value != "" &&
    selectDay.value != "" &&
    selectedHour.value != ""
  ) {
    try {
      if (platformSelectedID.value === 0 || platformSelectedID.value === 4) {
        platformSelectedID.value = 3;
      }
      let modalityValue = "V";
      const appointment = {
        linkID: platformSelectedID.value,
        userID: userID.value,
        active: 1,
        createdBy: createdBy.value,
        date: selectDay.value,
        hour: selectedHour.value,
        modality: modalityValue,
        color: hex.value,
        appointmentStatus: "P",
        candidateStatus: "C",
      };
      $q.loading.show();
      const request = await axios.post(`/appointment/create`, appointment);

      if (request.status === 200) {
        let getInsertedAppointment = request.data;
        const candidateIndex = totalTableRows.value.findIndex(
          (candidate) => candidate.userID === request.data.userID
        );
        totalTableRows.value[candidateIndex].status = "C";
        $q.notify({
          type: "positive",
          message: "La cita fue registrada correctamente",
          position: "top",
          timeout: 1000,
        });
        console.log(
          "Object from back value Virtual: " + getInsertedAppointment.link
        );
        events.value.push(getInsertedAppointment);
        $q.loading.hide();
        confirm.value = false;

        /*Send a WhatsApp Message */
        const type = "virtual";
        const data = {
          phoneNumber: phoneNumber.value,
          name: name.value,
          date: selectDay.value,
          hour: selectedHour.value,
          platformName: selectedPlatform.value,
          link: getInsertedAppointment.link,
          supportEmail: "reclutamiento@turbomaquinas.com",
        };

        sendWhatsAppMessage(type, data);

        /*CORREO*/
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
        if (sendEmail === true) {
          notifyPositive(
            "Correo enviado a: " + data.name + "exitosamente",
            3000
          );
        } else {
          notifyNegative("Hubo un error al enviar el correo");
        }

        candidateSelection.value = "";
        userID.value = "";
        selectedHour.value = "";
        selectedModality.value = "";
        linkData.value = "";
        color.value = "";
      }
    } catch (error) {
      console.log("BRO:", error);
      $q.notify({
        type: "negative",
        message: "Hubo un error en el registro. Intenta de nuevo",
        position: "top",
        timeout: 1000,
      });
      $q.loading.hide();
    }
  } else if (
    selectedModality.value === "Presencial" &&
    candidateSelection.value != "" &&
    userID.value != "" &&
    createdBy.value != "" &&
    selectDay.value != "" &&
    selectedHour.value != ""
  ) {
    try {
      console.log(
        "registro PLATFORM ID presencial: ",
        platformSelectedID.value
      );
      let modalityValue = "P";
      const appointment = {
        userID: userID.value,
        linkID: 4,
        active: 1,
        createdBy: createdBy.value,
        date: selectDay.value,
        hour: selectedHour.value,
        modality: modalityValue,
        color: hex.value,
        appointmentStatus: "P",
        candidateStatus: "C",
      };
      $q.loading.show();
      const request = await axios.post(`/appointment/create`, appointment);
      console.log(
        "datos enviados al back correctamente de PRESENCIAL" +
          JSON.stringify(appointment)
      );
      if (request.status === 200) {
        let getInsertedAppointment = request.data;
        console.log(getInsertedAppointment);
        const candidateIndex = totalTableRows.value.findIndex(
          (candidate) => candidate.userID === request.data.userID
        );
        totalTableRows.value[candidateIndex].status = "C";
        $q.notify({
          type: "positive",
          message: "La cita fue registrada correctamente",
          position: "top",
          timeout: 1000,
        });
        events.value.push(getInsertedAppointment);
        $q.loading.hide();
        confirm.value = false;

        /*Send a WhatsApp Message */
        const type = "presential";
        const data = {
          phoneNumber: phoneNumber.value,
          name: name.value,
          date: selectDay.value,
          hour: selectedHour.value,
          supportEmail: "reclutamiento@turbomaquinas.com",
        };

        sendWhatsAppMessage(type, data);

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
        //createdBy.value = "";
        selectedHour.value = "";
        selectedModality.value = "";
        linkData.value = "";
        color.value = "";
      } else {
        console.log("why?" + JSON.stringify(appointment));
        $q.notify({
          type: "negative",
          message: "Hubo un error en el registro. Intenta de nuevo",
          position: "top",
          timeout: 1000,
        });
        $q.loading.hide();
      }
    } catch (error) {
      $q.notify({
        type: "negative",
        message: "Hubo un error en el registro. Intenta de nuevo",
        position: "top",
        timeout: 1000,
      });
      $q.loading.hide();
    }
  } else if (candidateSelection.value == "") {
    $q.notify({
      type: "negative",
      message: "Debe seleccionar un candidato",
      position: "top",
      timeout: 1000,
    });
    $q.loading.hide();
  } else if (selectedHour.value == "") {
    $q.notify({
      type: "negative",
      message: "Debe seleccionar una hora",
      position: "top",
      timeout: 1000,
    });
    $q.loading.hide();
  } else if (selectedModality.value == "") {
    $q.notify({
      type: "negative",
      message: "Debe seleccionar una modalidad",
      position: "top",
      timeout: 1000,
    });
    $q.loading.hide();
  }
};

const updateAppointment = async () => {
  if (
    selectedModality.value === "Virtual" &&
    appointmentId.value != "" &&
    candidateSelection.value != "" &&
    userID.value != "" &&
    selectDay.value != "" &&
    selectedHour.value != ""
  ) {
    try {
      if (platformSelectedID.value === 0 || platformSelectedID.value === 4) {
        platformSelectedID.value = 3;
      }
      let modalityValue = "V";
      const appointment = {
        appointmentId: appointmentId.value,
        userID: userID.value,
        linkID: platformSelectedID.value,
        modifiedBy: createdBy.value,
        date: selectDay.value,
        hour: selectedHour.value,
        modality: modalityValue,
        color: hex.value,
      };
      $q.loading.show();
      const request = await axios.put(`/appointment/update`, appointment);

      if (request.status === 200) {
        let updatedAppointment = request.data;
        const appointmentIndex = events.value
          .map((event) => {
            return event.appointmentId;
          })
          .indexOf(appointment.appointmentId);
        events.value[appointmentIndex] = updatedAppointment;
        $q.notify({
          type: "positive",
          message: "La cita fue actualizada correctamente",
          position: "top",
          timeout: 1000,
        });

        $q.loading.hide();
        confirm.value = false;

        if (
          updatedAppointment.linkID != comparativeAppointment.linkID ||
          updatedAppointment.date != comparativeAppointment.date ||
          updatedAppointment.hour != comparativeAppointment.hour
        ) {
          console.log(
            "DATOS DE LA ACTUALIZACIÓN: ",
            updatedAppointment.linkID +
              " " +
              comparativeAppointment.linkID +
              " " +
              updatedAppointment.date +
              " " +
              comparativeAppointment.date +
              " " +
              updatedAppointment.hour +
              " " +
              comparativeAppointment.hour
          );

          /*Send a WhatsApp Message */
          const type = "virtual/change";
          const data = {
            phoneNumber: phoneNumber.value,
            name: name.value,
            date: selectDay.value,
            hour: selectedHour.value,
            platformName: selectedPlatform.value,
            link: updatedAppointment.link,
            supportEmail: "reclutamiento@turbomaquinas.com",
          };

          sendWhatsAppMessage(type, data);

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
          if (sendEmail === true) {
            notifyPositive("Se a notificado al candidato", 1000);
          } else {
            notifyNegative("Hubo un error al enviar el correo");
          }
        }

        candidateSelection.value = "";
        userID.value = "";
        platformSelectedID.value = 0;
        //createdBy.value = "";
        selectedHour.value = "";
        selectedModality.value = "";
        linkData.value = "";
        color.value = "";
      }
    } catch (error) {
      $q.notify({
        type: "negative",
        message: "Hubo un error en el registro. Intenta de nuevo",
        position: "top",
        timeout: 1000,
      });
      $q.loading.hide();
      console.log(error);
    }
  } else if (
    selectedModality.value === "Presencial" &&
    appointmentId.value != "" &&
    candidateSelection.value != "" &&
    userID.value != "" &&
    selectDay.value != "" &&
    selectedHour.value != ""
  ) {
    try {
      console.log("UPDATE-Presencial id platform: ", platformSelectedID.value);
      let modalityValue = "P";
      const appointment = {
        appointmentId: appointmentId.value,
        userID: userID.value,
        linkID: 4,
        modifiedBy: createdBy.value,
        date: selectDay.value,
        hour: selectedHour.value,
        modality: modalityValue,
        color: hex.value,
      };
      $q.loading.show();
      const request = await axios.put(`/appointment/update`, appointment);

      if (request.status === 200) {
        let updatedAppointment = request.data;
        const appointmentIndex = events.value
          .map((event) => {
            return event.appointmentId;
          })
          .indexOf(appointment.appointmentId);
        events.value[appointmentIndex] = updatedAppointment;
        $q.notify({
          type: "positive",
          message: "La cita fue actualizada correctamente",
          position: "top",
          timeout: 1000,
        });
        $q.loading.hide();
        confirm.value = false;

        if (
          updatedAppointment.linkID != comparativeAppointment.linkID ||
          updatedAppointment.date != comparativeAppointment.date ||
          updatedAppointment.hour != comparativeAppointment.hour
        ) {
          console.log(
            "DATOS DE LA ACTUALIZACIÓN: ",
            updatedAppointment.linkID +
              " " +
              comparativeAppointment.linkID +
              " " +
              updatedAppointment.date +
              " " +
              comparativeAppointment.date +
              " " +
              updatedAppointment.hour +
              " " +
              comparativeAppointment.hour
          );

          /*Send a WhatsApp Message */
          const type = "presential/change";
          const data = {
            phoneNumber: phoneNumber.value,
            name: name.value,
            date: selectDay.value,
            hour: selectedHour.value,
            supportEmail: "reclutamiento@turbomaquinas.com",
          };

          sendWhatsAppMessage(type, data);

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
          if (sendEmail === true) {
            notifyPositive(
              "Correo enviado a: " + data.name + "exitosamente",
              3000
            );
          } else {
            notifyNegative("Hubo un error al enviar el correo");
          }
        }
        candidateSelection.value = "";
        userID.value = "";
        platformSelectedID.value = 0;
        selectedHour.value = "";
        selectedModality.value = "";
        linkData.value = "";
        color.value = "";
      }
    } catch (error) {
      $q.notify({
        type: "negative",
        message: "Hubo un error en el registro. Intenta de nuevo",
        position: "top",
        timeout: 1000,
      });
      $q.loading.hide();
      console.log("error: " + error);
    }
  } else if (candidateSelection.value == "") {
    $q.notify({
      type: "negative",
      message: "Debe seleccionar un candidato",
      position: "top",
      timeout: 1000,
    });
    $q.loading.hide();
  } else if (selectedHour.value == "") {
    $q.notify({
      type: "negative",
      message: "Debe seleccionar una hora",
      position: "top",
      timeout: 1000,
    });
    $q.loading.hide();
  } else if (selectedModality.value == "") {
    $q.notify({
      type: "negative",
      message: "Debe seleccionar una modalidad",
      position: "top",
      timeout: 1000,
    });
    $q.loading.hide();
  }
};

const eventsMap = computed(() => {
  console.log("si lo detecta el cambio");
  const map = {};
  if (events.value.length > 0) {
    events.value.forEach((event) => {
      (map[event.date] = map[event.date] || []).push(event); //se hace un objeto que contine objetos difertenes, la clave de cada objeto es la fecha y el valor son arreglos con los objetos que guardan los valores de los datos de la cita
    });
  }
  console.log("este es el mapa:", map);
  return map;
});

const onCandidateSelection = (data) => {
  candidateSelection.value =
    data.name + " " + data.fatherLastName + " " + data.motherLastName;
  userID.value = data.userID;
  console.log("VALOR USER ID EN VARIABLES: " + userID.value);
  name.value = data.name;
  fatherLastName.value = data.fatherLastName;
  motherLastName.value = data.motherLastName;
  photoUUID.value = data.photoUUID;
  email.value = data.email;
  phoneNumber.value = data.celphone;
};

const onModalitySelection = (data) => {
  selectedPlatform.value = data.platformName;
  platformSelectedID.value = data.id;
  selectedModality.value = "Virtual";
  console.log(selectedModality.value);
  console.log(platformSelectedID.value);
  console.log(selectedPlatform.value);
};

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
    console.log("DATE 1: ", timestampDate.value);
  }
};

const closeAppointmentDialog = () => {
  confirm.value = false;
};

const closeShowAppointmentDialog = () => {
  openDialog2.value = false;
};

const deactivateAppointment = async () => {
  const apiUrl = "/appointment/deactivate";
  $q.loading.show();
  try {
    const request = await axios.put(apiUrl, null, {
      params: {
        appointmentStatus: "C",
        appointmentId: appointmentId.value,
        candidateStatus: "P",
        userID: userID.value,
      },
    });

    if (request.status === 200) {
      openDialog2.value = false;

      const candidateIndex = totalTableRows.value.findIndex(
        (candidate) => candidate.userID === userID.value
      );
      totalTableRows.value[candidateIndex].status = "P";
      console.log("Id del candidato: ", totalTableRows.value[candidateIndex]);

      const appointmentIndex = events.value.findIndex(
        (appointment) => appointment.appointmentId === appointmentId.value
      );
      events.value.splice(appointmentIndex, 1);
      $q.notify({
        type: "positive",
        message: "Cita eliminada",
        position: "top",
        timeout: 1000,
      });
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
      if (sendEmail === true) {
        notifyPositive("Se a notificado al candidato", 1000);
      } else {
        notifyNegative("Hubo un error al enviar el correo");
      }
    }
  } catch (error) {
    $q.notify({
      type: "negative",
      message: "Hubo un error al eliminar la cita. Intenta de nuevo",
      position: "top",
      timeout: 1000,
    });
    $q.loading.hide();
    openDialog2.value = false;
    console.log("error in deactivation: " + error);
  }
};

const completeAppointment = async () => {
  const apiUrl = "/appointment/deactivate";
  $q.loading.show();
  try {
    const request = await axios.put(apiUrl, null, {
      params: {
        appointmentStatus: "F",
        appointmentId: appointmentId.value,
        candidateStatus: "E",
        userID: userID.value,
      },
    });

    if (request.status === 200) {
      openDialog2.value = false;

      const candidateIndex = totalTableRows.value.findIndex(
        (candidate) => candidate.userID === userID.value
      );
      totalTableRows.value[candidateIndex].status = "E";
      console.log("Id del candidato: ", totalTableRows.value[candidateIndex]);

      const appointmentIndex = events.value.findIndex(
        (appointment) => appointment.appointmentId === appointmentId.value
      );
      events.value.splice(appointmentIndex, 1);
      $q.notify({
        type: "positive",
        message: "Cita completada",
        position: "top",
        timeout: 1000,
      });
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
      if (sendEmail === true) {
        notifyPositive("Se a notificado al candidato", 1000);
      } else {
        notifyNegative("Hubo un error al enviar el correo");
      }
    }
  } catch (error) {
    $q.notify({
      type: "negative",
      message: "Hubo un error al eliminar la cita. Intenta de nuevo",
      position: "top",
      timeout: 1000,
    });
    $q.loading.hide();
    openDialog2.value = false;
    console.log("error in deactivation: " + error);
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
  /*
  border-bottom: var(--calendar-border);
  color: var(--calendar-color); */
  background: rgb(22, 48, 70);
  color: rgb(255, 255, 255);
  /*   display: flex;
  align-items: center;
  justify-content: center; */
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

/* @media screen and (max-width: 1000px) {

} */
</style>
