<template>
  <q-layout class="main-layout" view="hHr LpR lFf">
    <q-page-container>
      <q-page>
        <q-drawer side="left" show-if-above bordered class="menu">
          <div style="margin-left: 30px">
            <q-img
              class="logo-turbo"
              :src="require('@/assets/img/logo-turbomaquinas.png')"
              style="width: 30%; height: 10%"
            />
          </div>
          <div style="margin-left: 20px; margin-bottom: 50px">
            <p class="turbo">Turbomáquinas</p>
          </div>

          <p
            style="
              font-size: 150%;
              font-family: 'arial';
              color: #ffffff;
              position: relative;
              margin-left: 50px;
            "
          >
            <strong>Opciones de usuario</strong>
          </p>
          <br />

          <q-item-section style="align-items: start">
            <div
              class="row"
              style="color: #ffffff; display: flex; align-items: center; margin-left: 20px; margin-bottom: 18px;"
            >
              Contabilidad y finanzas
              <q-checkbox
                style="position: absolute; right: 10px;"
                v-model="checkBox[0]"
              />
            </div>

            <div
              class="row"
              style="color: #ffffff; display: flex; align-items: center; margin-left: 20px; margin-bottom: 18px;"
            >
              Alabes
              <q-checkbox
                style="position: absolute; right: 10px;"
                v-model="checkBox[1]"
              />
            </div>

            <div
              class="row"
              style="color: #ffffff; display: flex; align-items: center; margin-left: 20px; margin-bottom: 18px;"
            >
              Maquinación Pesada
              <q-checkbox
                style="position: absolute; right: 10px;"
                v-model="checkBox[2]"
              />
            </div>

            <div
              class="row"
              style="color: #ffffff; display: flex; align-items: center; margin-left: 20px; margin-bottom: 18px;"
            >
            Maquinación Mediana
              <q-checkbox
                style="position: absolute; right: 10px;"
                v-model="checkBox[3]"
              />
            </div>

            <div
              class="row"
              style="color: #ffffff; display: flex; align-items: center; margin-left: 20px; margin-bottom: 18px;"
            >
              Maquinación ligera
              <q-checkbox
                style="position: absolute; right: 10px;"
                v-model="checkBox[4]"
              />
            </div>

            <div
              class="row"
              style="color: #ffffff; display: flex; align-items: center; margin-left: 20px; margin-bottom: 18px;"
            >
            Soldadura
              <q-checkbox
                style="position: absolute; right: 10px;"
                v-model="checkBox[5]"
              />
            </div>


          </q-item-section>
        </q-drawer>

        <!-- MAIN LAYOUT --------------------------------------------------------------- -->

        <q-card-section
          style="margin-top: 50px; position: absolute; left: 20px"
        >
          <div
            class="text-h3"
            style="font-family: 'calibri'; color: rgb(29, 28, 28)"
          >
            <strong>Vacantes disponibles</strong>
          </div>
        </q-card-section>

        <div>
          <SecretaryJobCard></SecretaryJobCard>
        </div>

      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import SecretaryJobCard from "src/components/SecretaryJobCard.vue";

const checkBox = ref([0]);
const router = useRouter();

const createApplication = () => {
  router.replace("/frontpage");
};

const deleteJobApplication = () => {};
</script>

<style>
.main-layout {
  background: rgb(255, 255, 255);
}

.tittle {
  background: rgb(255, 255, 255);
  font-size: large;
  color: rgb(40, 55, 68);
  border-radius: 25%;
}

.avatar {
  position: relative;
  margin-left: 20%;
}

.menu {
  background: rgba(22, 48, 70);
  width: 70px;
}

.menu-register {
  color: rgb(95, 158, 160);
  font-size: 150%;
  margin-top: 15%;
  margin-left: 10%;
}

.logo-turbo {
  margin-top: 5%;
  margin-left: 31%;
}

.turbo {
  color: rgb(255, 255, 255);
  font-size: 150%;
  margin-left: 20%;
}
/* SIDE BAR ENDS----------------------------------------------------------------------*/

.my-card {
  color: #ffffff;
  background: #050606;
  font-family: Arial;
  margin-left: 20px;
  margin-top: 20px;
  width: 350px;
  height: 375px;
  border-radius: 30px;
}
</style>
