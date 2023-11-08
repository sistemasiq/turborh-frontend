<template>
  <q-layout view="hHr LpR lFf" >
          <q-drawer
          side="left"
          show-if-above
          bordered
          class="menu"
          >
          <q-img class="logo-turbo" :src="require('@/assets/img/logo-turbomaquinas.png')" style="width: 30%; height: 10%;" />
          <p class="turbo">Turbomáquinas</p>
          <q-item-section >
            <q-item-label class="menu-register">
              <p class="labordepartments">Departamentos laborales</p>

              <p class="welder">Soldadores</p>
              <p class="turner">Torneros</p>
              <p class="accountingassistant">Asistente contable</p>
              <p class="secretary">Secretaria</p>
              <p class="receptionist">Recepcionista</p>
              <p class="vigilant">Vigilante</p>

              </q-item-label>
            </q-item-section>
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
          </q-drawer>



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

          <q-card-section>
            <div class="text-h6">AGENDA DE CITAS</div>
          </q-card-section>

          <q-card-section>
            <div class="text-h6">Agendar cita con Valentina Rodríguez</div>
          </q-card-section>

          <q-card-section class="q-pt-none">
      <div class="q-pa-md">

      <div class="q-gutter-md row items-start">
        <q-date v-model="newEventDate" mask="DD-MM-YYYY" color="blue" style="color: black;" />
        <q-time v-model="newEventTime" mask="HH:mm" color="blue" style="color: black;"/>
        <br>
        <br>


        <div class="home-content rounded-borders" style="display: flex;">
                      <div class="home-content rounded-borders" style="display: flex;">
                          <q-checkbox v-model="isCheckedPresencial" color="cyan" unchecked-icon="radio_button_unchecked"
                          checked-icon="radio_button_checked" size="lg" class="checkbox"
                          label="Cita presencial" style="color: black;">
                      </q-checkbox>
                  </div>
              </div>
        <div class="home-content rounded-borders" style="display: flex;">
                      <div class="home-content rounded-borders" style="display: flex;">
                          <q-checkbox v-model="isCheckedVirtual" color="cyan" unchecked-icon="radio_button_unchecked"
                          checked-icon="radio_button_checked" size="lg" class="checkbox"
                          label="Cita virtual" style="color: black;">
                      </q-checkbox>
                  </div>
              </div>
              <q-input light outlined v-if="isCheckedVirtual" type="text" color="primary" v-model="newEventLink" label="Ingrese el link de la llamda" /> <br>


      </div>
      <br>
  <q-btn class="btn-save" rounded text-color="white" color="blue" label="Guardar" @click="saveEvent" />
  <br>
  <br>
  <div class="text-h6">Detalles de la cita</div>
        <br>

  </div>
  </q-card-section>

  <div>
      <q-splitter
        v-model="splitterModel"
        style="height: 450px"
      >

        <template v-slot:before>
          <div class="q-pa-md">
            <q-date
              v-model="date"
              :events="events"
              event-color="orange"
            />
          </div>
        </template>

        <template v-slot:after>
          <div class="q-pa-md">
      <div class="q-gutter-md row items-start">
        <q-card
          class="flex"
          v-for="event in events"
          :key="event.date"
          style="
          background: rgba(150, 169, 235, 0.658);
          border-radius: 8%;

          "
        >
          <q-card-section class="q-pa-md " >
            <div>Nombre: {{ event.name }}</div>
            <div>Fecha y hora: {{ event.date }}</div>
            <div>Medio: {{ event.mean }}</div>
            <div v-if="event.link"> Link de llamada:
              <a @click="openLink(event.link)">{{ event.link }}</a>
            </div>
          </q-card-section>
        </q-card>
      </div>
    </div>
        </template>
      </q-splitter>
    </div>
  </q-card>

  </q-dialog>

  </q-layout>
  </template>

  <script setup>
  import NewDiary from 'src/components/NewDiary.vue';
  import { ref } from 'vue';

  const maximizedToggle = ref(true)
  const mostrarDialog = ref(false);

  const mostrarDialogo = () => {
    mostrarDialog.value = true;
  };

  const events = ref([]);
  const newEventName = ref('');
  const newEventMean = ref('');
  const isCheckedVirtual = ref(false)
  const isCheckedPresencial = ref(false);
  const newEventLink = ref('');

  const newEventDate = ref('');
  const newEventTime = ref('');


  const saveEvent = () => {
    let selectedMean = '';

    if (isCheckedPresencial.value) {
      selectedMean = 'Presencial';
    } else if (isCheckedVirtual.value) {
      selectedMean = 'Virtual';
    }

    const event = {
      name: newEventName.value,
      date: `${newEventDate.value} ${newEventTime.value}`,
      mean: selectedMean,
      link: newEventLink.value
    };

    events.value.push(event);
    newEventName.value = 'Valentina Rodríguez';
    newEventMean.value = '';
    newEventDate.value = '';
    newEventTime.value = '';
    newEventLink.value = '';
  };

  const openLink = (link) => {
    window.open(link, '_blank');
  };

  const splitterModel = ref(50)
  const date = ref([])

  </script>

  <style>
  .custom-table {
    border-collapse: collapse;
  }

  .custom-table td,
  .custom-table th {
    border: 1px solid #ccc;
    padding: 8px;
  }

  .dialog-card{
    width: 600px;
  }

  .btnshowdiary{
    margin-top: 30%;
  }

  .message{
      color: rgba(100, 95, 95, 0.76);
      margin-left: 37%;
  }

  .welder{
    color: rgb(255, 255, 255);
    font-size: 80%;
    margin-right: 10%;

  }

  .turner{
    color: rgb(255, 255, 255);
    font-size: 80%;
    margin-right: 10%;

  }

  .accountingassistant{
    color: rgb(255, 255, 255);
    font-size: 80%;
    margin-right: 10%;

  }

  .secretary{
    color: rgb(255, 255, 255);
    font-size: 80%;
    margin-right: 10%;

  }

  .receptionist{
    color: rgb(255, 255, 255);
    font-size: 80%;
    margin-right: 10%;
  }

  .vigilant{
    color: rgb(255, 255, 255);
    font-size: 80%;
    margin-right: 10%;
  }

   .menu{
    background: rgba(22, 48, 70);
    border-top-right-radius: 2%;
    border-bottom-right-radius: 2%;

   }

   .menu-register{
    color: rgb(95, 158, 160);
    font-size: 150%;
    margin-top: 15%;
    margin-left: 20%;
   }

   .logo-turbo{
   margin-top: 5%;
   margin-left: 30%;

   }

   .labordepartments{
    color: rgb(255, 255, 255);
    font-size: 100%;
    margin-right: 10%;
   }

   .turbo{
    color: rgb(255, 255, 255);
    font-size: 150%;
    margin-left: 20%;
   }

  :root {
      background: rgb(255, 255, 255);
  }

  </style>
