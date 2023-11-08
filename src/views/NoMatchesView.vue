<template>
  <q-layout view="hHr LpR lFf">
    <q-drawer side="left" show-if-above bordered class="menu">
      <q-img
        class="logo-turbo"
        :src="require('@/assets/img/logo-turbomaquinas.png')"
        style="width: 30%; height: 10%"
      />
      <p class="turbo">Turbomáquinas</p>
      <q-item-section>
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
    </q-drawer>

    <div>
      <q-icon name="sentiment_very_dissatisfied" size="200px" class="sadface" />
    </div>
    <h3 class="message">No se encontraron coincidencias</h3>
  </q-layout>
</template>

<style>
.message {
  color: rgba(100, 95, 95, 0.76);
  margin-left: 37%;
}

.sadface {
  color: rgba(100, 95, 95, 0.76);
  margin-left: 53%;
  margin-top: 12%;
}

.welder {
  color: rgb(255, 255, 255);
  font-size: 80%;
  margin-right: 10%;
}

.turner {
  color: rgb(255, 255, 255);
  font-size: 80%;
  margin-right: 10%;
}

.accountingassistant {
  color: rgb(255, 255, 255);
  font-size: 80%;
  margin-right: 10%;
}

.secretary {
  color: rgb(255, 255, 255);
  font-size: 80%;
  margin-right: 10%;
}

.receptionist {
  color: rgb(255, 255, 255);
  font-size: 80%;
  margin-right: 10%;
}

.vigilant {
  color: rgb(255, 255, 255);
  font-size: 80%;
  margin-right: 10%;
}

.menu {
  background: rgba(22, 48, 70);
  border-top-right-radius: 2%;
  border-bottom-right-radius: 2%;
}

.menu-register {
  color: rgb(95, 158, 160);
  font-size: 150%;
  margin-top: 15%;
  margin-left: 20%;
}

.logo-turbo {
  margin-top: 5%;
  margin-left: 30%;
}

.labordepartments {
  color: rgb(255, 255, 255);
  font-size: 100%;
  margin-right: 10%;
}

.departaments {
  color: rgb(255, 255, 255);
  font-size: 100%;
  margin-right: 10%;
}

.turbo {
  color: rgb(255, 255, 255);
  font-size: 150%;
  margin-left: 20%;
}

:root {
  background: rgb(255, 255, 255);
}
</style>
