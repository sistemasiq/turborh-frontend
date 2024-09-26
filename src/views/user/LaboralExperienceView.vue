<template>
  <q-layout style="background-color: rgb(30, 61, 88)">
    <q-card flat bordered class="rounded-borders">
      <q-card-section class="title"> Experiencia Laboral </q-card-section>

      <q-card-section>
        <PaginationApplication :page="10"></PaginationApplication>
        <div style="margin-top: 6%">
          
          <LaboralExperienceData></LaboralExperienceData>
        </div>
      </q-card-section>
      <q-card-section
        :style="{ 'margin-right': !updatingApplication ? '40%' : '0%' }"
      >
      </q-card-section>
    </q-card>
   
  </q-layout>
</template>

<script setup>
import LaboralExperienceData from "src/components/LaboralExperienceData.vue";
import PaginationApplication from "src/components/PaginationApplication.vue";
import { useRequestUser } from "src/stores/requestUser";
import { storeToRefs } from "pinia";

const useApplication = useRequestUser();
const { updatingApplication } = storeToRefs(useApplication);
</script>

<style scoped>
.title {
  font-size: large;
  color: rgb(40, 55, 68);
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

.rounded-borders {
  border-radius: 15px;
  background-color: rgba(49, 49, 49, 0.473) 51%;
}

.personaldata-background {
  width: 100%;
  height: 100%;
}
</style>
