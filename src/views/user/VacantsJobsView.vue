<template>
  <q-layout>
    <q-page-container>
      <q-page>
        <p
          class="text-h4 text-weight-bold"
          style="margin-left: 40px; margin-top: 40px; color: rgb(100, 95, 95)"
        >
          Vacantes Disponibles
        </p>

        <div class="row">
          <VacantsCard/>
        </div>

        <q-dialog
          full-width
          full-height
          v-model="showJobDetails"
          class="q-mr-xl"
          persistent
        >
          <q-card class="my-card">
            <q-img
              :src="require('@/assets/img/accountant.jpg')"
              spinner-color="white"
              class="full-width q-pt-md"
              style="height: 25%; border-radius: 30px"
            />
            <q-card-section>
              <q-btn
                size="lg"
                flat
                icon="close"
                class="absolute-right"
                v-close-popup
              ></q-btn>
            </q-card-section>


            <q-card-section>
              <div class="q-ml-xl">
                <p class="text-h5 text-weight-regular">Función principal</p>
                <p class="text-h6 text-weight-regular">
                  {{ jobFunction }}
                </p>
              </div>
            </q-card-section>
            <div
              style="display: flex; justify-content: space-between"
              class="q-mb-xl"
            >
              <q-card flat bordered class="job-requirements">
                <q-card-section style="background-color: #151515">
                  <p class="text-h6 text-weight-regular">
                    Funciones del puesto
                  </p>
                </q-card-section>
                <q-card-section class="bg-white text-black">
                  <p style="font-size: large">{{ jobFunction }}</p>
                </q-card-section>
              </q-card>
              <q-card flat bordered class="job-requirements">
                <q-card-section style="background-color: #151515">
                  <p class="text-h6 text-weight-regular">
                    Habilidades y/o conocimientos
                  </p>
                </q-card-section>
                <q-card-section class="bg-white text-black">
                  <p style="font-size: large">{{ jobFunction }}</p>
                </q-card-section>
              </q-card>
            </div>
          </q-card>
        </q-dialog>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref } from "vue";
import VacantsCard from "src/components/VacantsCards.vue";

const showJobDetails = ref(false);

</script>

<style scoped>
.job-requirements {
  margin-top: 1%;
  width: 50%;
  height: 100%;
  margin-left: 3%;
  margin-right: 3%;
  border-radius: 15px;
  color: #ffffff;
  text-align: center;
}
.my-card {
  border-radius: 30px;
  color: #000000;
  background: #ffffff;
}

.vacants {
  background-color: #ff6060;
  border-bottom-right-radius: 10px;
  border-top-right-radius: 10px;
  border-bottom-left-radius: 25px;
}

.details-button {
  background-color: white;
  height: 50px;
  width: 130px;
  font-size: medium;
}

.card-job {
  width: 30%;
}

.rounded-borders {
  border-radius: 10px;
  background-color: #ffffff;
}

.content {
  background-color: #192c3d;
  height: 100%;
  padding-top: 2%;
}
</style>
