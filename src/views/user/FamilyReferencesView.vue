<template>
  <q-layout style="background-color: rgb(30, 61, 88);">
    <q-card class="mainCard q-mt-xl">
          <q-card-section class="title"> Referencias familiares y comerciales </q-card-section>
          <q-card-section>
            <PaginationApplication :page="11"/>
            
          </q-card-section>
          <q-card-section class="q-mt-xl column items-start">
            <div class="row items-center q-mx-xl">
          <div class="text-white text-h6 text-weight-regular q-mr-md">Referencias Familiares <strong>(max 3)</strong></div>
          <BadgeOptional />
         </div>
            <FamilyReferences class="q-mt-md self-center" style="width: 92%;" />
          </q-card-section>
          <q-card-section class="q-mt-lg column items-start">
            <div class="row items-center q-mx-xl">
          <div class="text-white text-h6 text-weight-regular q-mr-md">Referencias Comerciales <strong>(max 3)</strong></div>
          <BadgeOptional />
         </div>
            <CommercialReferences class="q-mt-md self-center" style="width: 92%;" />
          </q-card-section>
        </q-card>
        <ButtonApplicationStatus v-if="updatingApplication"/>
  </q-layout>
</template>

<script setup>
import { useRequestUser } from "src/stores/requestUser";
import { storeToRefs } from "pinia";
import FamilyReferences from "src/components/TableFamilyReferences.vue";
import CommercialReferences from "src/components/TableComercialReferences.vue";
import PaginationApplication from "src/components/PaginationApplication.vue";
import ButtonApplicationStatus from "src/components/ButtonApplicationStatus.vue";
import BadgeOptional from "src/components/BadgeOptional.vue";

const useApplication = useRequestUser();

const { updatingApplication } = storeToRefs(useApplication);


</script>

<!-- STYLE BEGGINS ............................................................................................................................ -->
<style scoped>
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

.title {
  font-size: large;
  color: rgb(40, 55, 68);
}
.mainCard {
  background: rgba(49, 49, 49, 0.473) 51%;
}

.mainCard {
  display: relative;
  justify-content: center;
  align-items: center;
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


</style>
