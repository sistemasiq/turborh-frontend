<template>
  
  <q-layout view="hHr LpR lFf" >
          
            <q-item-section class="btnshowdiary">
              <q-btn
                    class="q-mr-lg q-mb-lg"
                    style="
                      color: rgb(255, 255, 255);
                      background: rgba(126, 231, 231, 0.89);
                      border-radius: 100%;
                      width: 50px;
                      height: 50px;
                      font-size: 20px;
                      margin-left: 10%;
                    "
                    icon="calendar_month"
                    @click="mostrarDialogo"
                  />
            </q-item-section>
         
     
  
      
      <q-dialog
        v-model="mostrarDialog"
        persistent
        :maximized="maximizedToggle"
        transition-show="slide-up"
        transition-hide="slide-down"
        class="dialog-card"
      >
      <q-card class="bg-white text-black">
          <q-bar>
            <q-space />
  
            <q-btn dense flat icon="minimize" @click="maximizedToggle = false" :disable="!maximizedToggle">
              <q-tooltip v-if="maximizedToggle" class="bg-white text-primary">Minimize</q-tooltip>
            </q-btn>
            <q-btn dense flat icon="crop_square" @click="maximizedToggle = true" :disable="maximizedToggle">
              <q-tooltip v-if="!maximizedToggle" class="bg-white text-primary">Maximize</q-tooltip>
            </q-btn>
            <q-btn dense flat icon="close" v-close-popup>
              <q-tooltip class="bg-white text-primary">Close</q-tooltip>
            </q-btn>
          </q-bar>
  

      <div class="subcontent">
    <div style="margin-left: 68%">
    </div>
    <div style="display: flex; justify-content: center; align-items: center; flex-wrap: nowrap; margin-left: 17%;">
      <div style="font-size: 2em;">{{ formattedMonth }}</div>
    </div>
    <div
      style="
        display: flex;
        justify-content: left;
        margin-left: 5%;
        align-items: left;
        flex-wrap: wrap;
      "
    >
   


      <div style="display: flex; max-width: 250px; width: 30%; height: 40%">
        <q-calendar-month
          ref="calendar"
          v-model="selectDay"
          locale="es"
          :day-min-height="10"
          mini-mode
          :min-weeks="6"
          bordered
          @change="onChange"
          @moved="onMoved"
          @click-date="onClickDate"
          @click-day="onClickDate"
        />
      </div>


      <div
        style="display: flex; max-width: 1000px; width: 100%; margin-left: 1%"
      >
      <q-calendar-month
          ref="calendar"
          v-model="selectDay"
          :selected-start-end-dates="startEndDates"
          :day-min-height="110"
          animated
          bordered
          show-navigation
          locale="es"
          date-align="left"
          @mousedown-day="onMouseDownDay"
          @mouseup-day="onMouseUpDay"
          @mousemove-day="onMouseMoveDay"
          @change="onChange"
          @moved="onMoved"
          @click-date="onClickDate"
          @click-day="onClickDate"
          @click="onClickDate"
        >
          <!--           <template #day="{ timestamp }">
            <div>
              <q-btn
                v-if="timestamp == appointmentDay"
                style="background-color: rgb(58, 156, 156); color: black"
                >a</q-btn
              >
            </div>
          </template> -->
          <!--           <template #day="{ date }">
            <div>
                <q-btn :v-if="date === appointmentDay" style="background-color: rgb(58, 156, 156); color: black"
                  >a</q-btn
                >
            </div>
          </template> -->
          <template
            #day="{ date }"
            :v-if="date === appointmentDay && scheduledAppointments.length > 0"
            v-for="item in itemsWithNames"
            :key="item.id"
          >
            <q-btn
              :v-if="
                date === appointmentDay && scheduledAppointments.length > 0
              "
              v-for="item in itemsWithNames"
              :key="item.id"
              class="q-mr-lg row"
              style="
                border-radius: 30px;
                background-color: rgba(51, 184, 64, 0.849);
                color: rgb(255, 255, 255);
                height: 10px;
                width: 90%;
                font-size: 8px;
                font-family: 'Arial';
              ">
              <q-img
                :src="require('@/assets/img/profile_guy.jpg')"
                style="width: 30px; height: 30px; border-radius: 30px; position: absolute; left: 0%;"
                class="avatar"
              >
              </q-img>
              <div class="row">
                {{ item.name }}
              </div>
            </q-btn>
          </template>
        </q-calendar-month>
      </div>
    </div>
  </div>

  <!-- /* DIALOG and TOOLBAR --------------------------------------------------------------------------------*/ -->
  <q-dialog v-model="confirm" persistent>
    <q-card style="border-radius: 20px; background: rgb(255, 255, 255)">
      <q-toolbar class="bg-blue-8 text-white">
        <q-avatar
          style="font-size: 50px"
          flat
          round
          dense
          icon="assignment_ind"
        />
        <q-toolbar-title> Añadir Evento </q-toolbar-title>
      </q-toolbar>

      <!-- /* Card Content --------------------------------------------------------------------------------*/ -->
      <q-card-section class="items-center">
        <!-- /* DROPDOWN BTN 1--------------------------------------------------------------------------------*/ -->
        <div class="q-ml-md q-mt-sm q-mb-sm q-mr-md">
          <q-btn-dropdown
  split
  auto-close
  class="shadow-0"
  color="grey-3"
  text-color="grey-9"
  :label="candidateSelection || 'Selecciona al candidato'"
  style="width: 260px; height: 45px"
  :dropdown-content-class="dropdownContentClass"
  @click="onMainClick"
>
  <q-list>
    <q-item
      v-for="(item, index) in candidateName"
      :key="index"
      clickable
      v-close-popup
      @click="onCandidateSelection(item)"
    >
      <q-item-section avatar>
        <q-avatar
          icon="person"
          color="light-blue-4"
          text-color="white"
        />
      </q-item-section>
      <q-item-section>
        <q-item-label>{{ item }}</q-item-label>
        <q-item-label caption>Secretario</q-item-label>
      </q-item-section>
    </q-item>
  </q-list>
</q-btn-dropdown>
        </div>

        <!-- /* DATE AND TIME SELECTION 2 --------------------------------------------------------------------------------*/ -->

        <div class="q-ml-md q-mt-lg q-mb-sm q-mr-md" style="width: 260px">
          <h6>Fecha y hora de la cita</h6>
          <q-input filled v-model="selectDay">
            <template v-slot:prepend>
              <q-icon name="event" class="cursor-pointer">
                <q-popup-proxy
                  cover
                  transition-show="scale"
                  transition-hide="scale"
                >
                  <q-date v-model="selectDay" mask="YYYY-MM-DD HH:mm">
                    <div class="row items-center justify-end">
                      <q-btn v-close-popup label="Close" color="primary" flat />
                    </div>
                  </q-date>
                </q-popup-proxy>
              </q-icon>
            </template>

            <template v-slot:append>
              <q-icon name="access_time" class="cursor-pointer">
                <q-popup-proxy
                  cover
                  transition-show="scale"
                  transition-hide="scale"
                >
                  <q-time v-model="selectDay" mask="YYYY-MM-DD HH:mm" format24h>
                    <div class="row items-center justify-end">
                      <q-btn v-close-popup label="Close" color="primary" flat />
                    </div>
                  </q-time>
                </q-popup-proxy>
              </q-icon>
            </template>
          </q-input>
        </div>

        <!-- /* DROPDOWNBTN SECCTION --------------------------------------------------------------------------------*/ -->
        <div class="q-ml-md q-mt-lg q-mb-sm q-mr-md">
          <q-btn-dropdown
  split
  auto-close
  class="shadow-0"
  color="grey-3"
  text-color="grey-9"
  :label="selectedModality || 'Selecciona la modalidad'"
  style="width: 260px; height: 45px"
  :dropdown-content-class="dropdownContentClass"
  @click="onMainClick"
>
  <q-list>
    <q-item
      v-for="(item, index) in meetingModality"
      :key="index"
      clickable
      v-close-popup
      @click="onModalitySelection(item)"
    >
      <q-item-section avatar>
        <q-avatar
          icon="person"
          color="light-blue-4"
          text-color="white"
        />
      </q-item-section>
      <q-item-section>
        <q-item-label>{{ item }}</q-item-label>
      </q-item-section>
    </q-item>
  </q-list>
</q-btn-dropdown>
        </div>
        <div v-if="selectedModality === 'Virtual'">
  <q-input
    v-model="linkData"
    class="q-ml-md q-mt-lg q-mb-xl q-mr-md"
    outlined
    style="width: 260px; height: 10px"
    label="Link de reunión"
  ></q-input>
</div>
      </q-card-section>

      <!-- /* SAVED BUTTONS --------------------------------------------------------------------------------*/ -->

      <q-card-actions align="right">
        <q-btn
          flat
          label="Agendar"
          v-close-popup
          @click="newAppointment"
          style="
            background: rgb(77, 195, 245);
            color: rgb(255, 255, 255);
            border-radius: 30px;
          "
        />
        <q-btn
          flat
          label="Cancelar"
          v-close-popup
          style="
            background: rgb(245, 77, 77);
            color: rgb(255, 255, 255);
            border-radius: 30px;
          "
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</q-card>
  </q-dialog>
          
      
  
  </q-layout>

</template>

<script setup>

const selectedMonth = ref(new Date().getMonth());
const onNext = () => {
  calendar.value.next();
  selectedMonth.value += 1;
};

const onPrev = () => {
  calendar.value.prev();
  selectedMonth.value -= 1;
};
const formattedMonth = computed(() => {
  const date = new Date();
  date.setMonth(selectedMonth.value);
  return monthFormatter().format(date) + ' ' + date.getFullYear();
});

const locale = ref('') // Puedes establecer el valor de la localización según tus necesidades

function monthFormatter() {
  try {
    return new Intl.DateTimeFormat(locale.value || undefined, {
      month: 'long',
      timeZone: 'UTC'
    })
  } catch (e) {
    // Manejar el error según sea necesario
  }
}


const maximizedToggle = ref(true)
  const mostrarDialog = ref(false);
  
  const mostrarDialogo = () => {
    mostrarDialog.value = true;
  };
  
import {
  QCalendarMonth,
  getDayIdentifier,
  QCalendarAgenda,
  today,
} from "@quasar/quasar-ui-qcalendar/src/index.js";
import "@quasar/quasar-ui-qcalendar/src/QCalendarVariables.sass";
import "@quasar/quasar-ui-qcalendar/src/QCalendarTransitions.sass";
import "@quasar/quasar-ui-qcalendar/src/QCalendarMonth.sass";
import { ref, computed, defineComponent } from "vue";

const appointmentDay = ref("0000-00-00"); //this const save the current appointment for a specific day

/* const isAppointmentDay = computed(() => {
  return (date) => {
    const appointmentDate = new Date(appointmentDay.value)
    return date instanceof Date && date.toDateString() === appointmentDate.toDateString()
  }
}) */

const getCurrentDay = (day) => {
  const date = new Date();
  date.setDate(day);
  return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
};

// Método para verificar si el día actual es el día seleccionado para colocar la etiqueta
/* const isNoteDay = (day) => {
  const selectedDate = new Date("2023-06-20"); // Establece la fecha específica que desees
  return day === selectedDate.getDate();
};
 */

const parseTimestamp = (timestamp) => {
  const [year, month, day] = timestamp.split("-");
  return {
    year: parseInt(year),
    month: parseInt(month) - 1,
    day: parseInt(day),
    weekday: new Date(year, month - 1, day).getDay(),
  };
};

const addToDate = (timestamp, { year = 0, month = 0, day = 0 }) => {
  const date = new Date(
    timestamp.year + year,
    timestamp.month + month,
    timestamp.day + day
  );
  return {
    year: date.getFullYear(),
    month: date.getMonth(),
    day: date.getDate(),
    weekday: date.getDay(),
  };
};

const selectedDate = ref(today());
const events = ref([
  {
    id: 1,
    title: "1st of the Month",
    details: "Everything is funny as long as it is happening to someone else",
    date: getCurrentDay(1),
    bgcolor: "orange",
  },
  // ... rest of the events
]);

const eventsMap = computed(() => {
  const map = {};
  if (events.value.length > 0) {
    events.value.forEach((event) => {
      (map[event.date] = map[event.date] || []).push(event);
      if (event.days !== undefined) {
        let timestamp = parseTimestamp(event.date);
        let days = event.days;
        do {
          timestamp = addToDate(timestamp, { day: 1 });
          if (!map[timestamp.date]) {
            map[timestamp.date] = [];
          }
          map[timestamp.date].push(event);
        } while (--days > 1);
      }
    });
  }
  return map;
});

/* AÑADIR AL ARREGLO------------------------------------------------------------------------------------------- */

const scheduledAppointments = ref([]);
const meetingModality = ref(["Presencial", "Virtual"]);
const candidateName = ref([
  "Jorge Herrera",
  "Juan Pérez",
  "Ana Hernandez",
  "José Camarena",
]);
const candidateSelection = ref("");
const selectedModality = ref("");
const linkData = ref("");

/* const selectedDate = ref(today()); */
const calendar = ref(null);
const anchorTimestamp = ref(null);
const otherTimestamp = ref(null);
const mouseDown = ref(false);
const mobile = ref(false);

const selectionDate = ref(null); // value of the v-model
const selectDay = ref();
const selectedNoteDay = ref(null); // Variable para almacenar el día seleccionado

// Método para verificar si el día actual es el día seleccionado para colocar la etiqueta
const isNoteDay = (day) => {
  if (selectedNoteDay.value === null) {
    return false;
  }
  return day === selectedNoteDay.value;
};

const onCandidateSelection = (item) => {
  candidateSelection.value = item;
  console.log(candidateSelection.value);
};

const onModalitySelection = (item) => {
  selectedModality.value = item;
  console.log(selectedModality.value);
};

/* const onClickDate = (data) => {
  console.log(
    "EL VALOR ES ESTE----------------------------------",
    data.scope.timestamp.date
  );
  selectDay.value = data.scope.timestamp.date;
  console.log("wtf", selectDay.value);
  selectedNoteDay.value = data.scope.timestamp.date; // Almacena el día seleccionado en la variable
  confirm.value = true;
};
 */
const onClickDate = (data) => {
  console.log(
    "EL VALOR ES ESTE----------------------------------",
    data.scope.timestamp.date
  );
  if (data?.scope) {
    selectDay.value = data.scope.timestamp.date;
    selectedNoteDay.value = data.scope.timestamp.date;
    confirm.value = true;
  }
  console.log("wtf", selectDay.value);
};

const hasAppointment = ref(false);
let appointmentId = 0;

const newAppointment = () => {
  const appointment = {
    id: appointmentId,
    name: candidateSelection.value,
    dateTimeValue: selectDay.value,
    modality: selectedModality.value,
    meetingLink: selectedModality.value === "Virtual" ? linkData.value : "",
  };
  scheduledAppointments.value.push(appointment);
  appointmentId++;
  hasAppointment.value = true;
  appointmentDay.value = appointment.dateTimeValue;
  console.log(appointment.dateTimeValue, "appointment");
  console.log(appointmentDay.value, "appointmentDay");
  console.log(selectDay.value, "selectDay");
  console.log(selectDay.value === appointment.dateTimeValue);
};

const itemsWithNames = computed(() => {
  return scheduledAppointments.value.map((item) => {
    return {
      id: item.id,
      name: item.name,
    };
  });
});
const confirm = ref(false);
const dropdownContentClass = "flexible-width";
/* const dateStartSecondary = ref("");
 */
const leftClick = (e) => {
  return e.button === 0;
};

const startEndDates = computed(() => {
  const dates = [];
  if (
    anchorDayIdentifier.value !== false &&
    otherDayIdentifier.value !== false
  ) {
    if (anchorDayIdentifier.value <= otherDayIdentifier.value) {
      dates.push(anchorTimestamp.value.date, otherTimestamp.value.date);
    } else {
      dates.push(otherTimestamp.value.date, anchorTimestamp.value.date);
    }
  }
  return dates;
});

const anchorDayIdentifier = computed(() => {
  if (anchorTimestamp.value !== null) {
    return getDayIdentifier(anchorTimestamp.value);
  }
  return false;
});

const otherDayIdentifier = computed(() => {
  if (otherTimestamp.value !== null) {
    return getDayIdentifier(otherTimestamp.value);
  }
  return false;
});

const onMouseDownDay = ({ scope, event }) => {
  if (leftClick(event)) {
    if (
      mobile.value === true &&
      anchorTimestamp.value !== null &&
      otherTimestamp.value !== null &&
      anchorTimestamp.value.date === otherTimestamp.value.date
    ) {
      otherTimestamp.value = scope.timestamp;
      mouseDown.value = false;
      return;
    }
    // mouse is down, start selection and capture current
    mouseDown.value = true;
    anchorTimestamp.value = scope.timestamp;
    otherTimestamp.value = scope.timestamp;
  }
};

const onMouseUpDay = ({ scope, event }) => {
  if (leftClick(event)) {
    // mouse is up, capture last and cancel selection
    otherTimestamp.value = scope.timestamp;
    mouseDown.value = false;
  }
};

const onMouseMoveDay = ({ scope, event }) => {
  if (mouseDown.value === true && scope.outside !== true) {
    otherTimestamp.value = scope.timestamp;
  }
};

const onToday = () => {
  calendar.value.moveToToday();
  selectedDate.value =
    today(); /*Parte del evento para mostrar la targeta en cada día */
};



const onMoved = (data) => {
  console.log("onMoved", data);
};

const onChange = (data) => {
  console.log("onChange", data);
  console.log(selectDay.value);
};

const date = ref(null);
</script>

<style scoped>
/* Estilos personalizados si los necesitas */
.delete-button:not(.q-btn-icon):hover {
  background-color: rgb(215, 86, 86);
}
</style>

<style>
.flexible-width {
  width: auto;
  white-space: nowrap;
}

.q-calendar-month__head {
  border-bottom: var(--calendar-border);
  color: var(--calendar-color);
  background: #87d7ff;
  color: rgb(0, 0, 0);
}
</style>