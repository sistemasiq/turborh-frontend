<template>
  <q-btn
    outline
    rounded
    :color="filterActive ? 'red' : 'black'"
    @click.prevent="openFilter = true"
  >
    <div class="text-black">
      <q-icon name="filter_list" />
      {{ filterActive ? "Ver filtros activos" : "Activar Filtros" }}
    </div>
  </q-btn>

  <q-dialog position="top" v-model="openFilter">
    <q-card style="width: 80vw">
      <q-card-section>
        <div class="text-h6">Filtros</div>
      </q-card-section>

      <q-separator />

      <q-card-section class="justify-between q-mt-md" horizontal>
        <q-checkbox
          class="q-ml-md"
          v-model="enableFilfterByGender"
          label="Por sexo"
        />
        <q-btn-dropdown
          v-if="enableFilfterByGender"
          class="q-mr-xl"
          outline
          :label="genderChoosed.name"
          text-color="black"
          color="white"
        >
          <q-list>
            <q-item
              v-for="(item, index) in genderFilterList"
              :key="index"
              clickable
              v-close-popup
              @click.prevent="onGenderChoosed(item)"
            >
              <q-item-section>
                <q-item-label>{{ item.name }}</q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
        </q-btn-dropdown>
      </q-card-section>

      <q-card-section class="justify-between q-mt-md" horizontal>
        <q-checkbox
          class="q-ml-md"
          v-model="enableFilfterByAge"
          label="Por edad"
        />
        <q-card-section v-if="enableFilfterByAge">
          <q-input
            class="q-mr-sm"
            outlined
            label="Edad inicial"
            label-color="black"
            text-color="black"
            color="black"
            v-model="initialAgeValue"
            type="number"
          />
          <q-input
            class="q-mr-sm q-mt-md"
            outlined
            label="Edad final"
            label-color="black"
            text-color="black"
            color="black"
            type="number"
            v-model="finalAgeValue"
          />
        </q-card-section>
      </q-card-section>

      <q-card-section class="justify-between q-mt-md" horizontal>
        <q-checkbox
          class="q-ml-md"
          v-model="enableFilfterBySalary"
          label="Por salario"
        />
        <q-card-section v-if="enableFilfterBySalary">
          <q-input
            class="q-mr-sm"
            outlined
            label="Salario inicial"
            label-color="black"
            text-color="black"
            color="black"
            type="number"
            v-model="initialSalaryValue"
          />
          <q-input
            class="q-mr-sm q-mt-md"
            outlined
            label="Salario final"
            label-color="black"
            text-color="black"
            color="black"
            type="number"
            v-model="finalSalaryValue"
          />
        </q-card-section>
      </q-card-section>

      <q-card-section class="justify-between q-mt-md" horizontal>
        <q-checkbox
          class="q-ml-md"
          v-model="enableFilfterByCivilStatus"
          label="Por estado civil"
        />
        <q-btn-dropdown
          v-if="enableFilfterByCivilStatus"
          class="q-mr-xl"
          outline
          :label="civilStatusChoosed.name"
          text-color="black"
          color="white"
        >
          <q-list>
            <q-item
              v-for="(item, index) in civilStatusFilterList"
              :key="index"
              clickable
              v-close-popup
              @click.prevent="onCivilStatusChoosed(item)"
            >
              <q-item-section>
                <q-item-label>{{ item.name }}</q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
        </q-btn-dropdown>
      </q-card-section>

      <q-card-section class="justify-between q-mt-md" horizontal>
        <q-checkbox
          class="q-ml-md"
          v-model="enableFilfterByLicenceType"
          label="Por tipo de licencia"
        />
        <q-select
          v-if="enableFilfterByLicenceType"
          outlined
          color="blue"
          label-color="black"
          v-model="licencesTypeChoosed"
          multiple
          use-chips
          emit-value
          map-options
          :options="licenceTypeFilterList"
          label="Tipo de licencia/s"
          class="q-mr-xl"
        />
      </q-card-section>

      <q-card-section class="justify-between q-mt-md" horizontal>
        <q-checkbox
          class="q-ml-md"
          v-model="enableFilfterByScholarity"
          label="Por nivel de escolaridad"
        />

        <q-select
          v-if="enableFilfterByScholarity"
          outlined
          color="blue"
          label-color="black"
          v-model="scholarityChoosed"
          multiple
          use-chips
          emit-value
          map-options
          :options="scholarityFilterList"
          label="Escolaridad"
          class="q-mr-xl"
        />
      </q-card-section>

      <q-card-section class="justify-between q-mt-md" horizontal>
        <q-checkbox
          class="q-ml-md"
          v-model="enableFilfterByMachineryUse"
          label="Por uso de maquinaria/herramientas"
        />
        <q-select
          v-if="enableFilfterByMachineryUse"
          outlined
          color="blue"
          label-color="black"
          v-model="machineryChoosed"
          multiple
          use-chips
          emit-value
          map-options
          :loading="!machineryFetched"
          :options="machineryFilterListNames"
          label="Maquinaria/herramientas"
          class="q-mr-xl"
        />
      </q-card-section>

      <q-card-section class="justify-between q-mt-md" horizontal>
        <q-checkbox
          class="q-ml-md"
          v-model="enableFilfterBySkill"
          label="Por oficios"
        />
        <q-select
          v-if="enableFilfterBySkill"
          outlined
          color="blue"
          label-color="black"
          v-model="skillsChoosed"
          multiple
          use-chips
          emit-value
          map-options
          :options="skillFilterList"
          label="Maquinaria/herramientas"
          class="q-mr-xl"
        />
      </q-card-section>

      <q-separator />

      <q-card-actions class="justify-end q-pa-md">
        <q-btn
          label="Quitar filtros"
          text-color="black"
          class="bg-yellow-8 q-mr-lg"
          style="border-radius: 8px"
          @click.prevent="clearFilters()"
        />
        <q-btn
          label="Cerrar"
          v-close-popup
          text-color="white"
          class="bg-red-5 q-mr-sm"
          style="border-radius: 8px"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { ref, watch, computed, onMounted } from "vue";
import { getAllMachineryActive } from "src/services/machineryTools";
import { getSessionStorageItem } from "src/stores/sessionStorage";

const emit = defineEmits(["filtersChanged"]);

const filters = ref({
  gender: null,
  ageRange: { min: 0, max: 0 },
  salaryRange: { min: 0, max: 0 },
  civilStatus: null,
  licenceTypes: [],
  scholarity: null,
  machineryUse: [],
  skills: [],
});

const openFilter = ref(false);

const enableFilfterByGender = ref(false);
const enableFilfterByAge = ref(false);
const enableFilfterBySalary = ref(false);
const enableFilfterByCivilStatus = ref(false);
const enableFilfterByLicenceType = ref(false);
const enableFilfterByScholarity = ref(false);
const enableFilfterByMachineryUse = ref(false);
const enableFilfterBySkill = ref(false);

const genderChoosed = ref("sexo");
const scholarityChoosed = ref([]);
const civilStatusChoosed = ref("estado civil");
const licencesTypeChoosed = ref([]);
const machineryChoosed = ref([]);
const skillsChoosed = ref([]);

const initialAgeValue = ref(0);
const finalAgeValue = ref(0);

const initialSalaryValue = ref(0);
const finalSalaryValue = ref(0);

const genderFilterList = [
  {
    name: "Masculino",
    val: "M",
  },
  {
    name: "Femenino",
    val: "F",
  },
  {
    name: "Otro",
    val: "O",
  },
];

const civilStatusFilterList = [
  {
    name: "Soltero",
    val: "S",
  },
  {
    name: "Casado",
    val: "C",
  },
  {
    name: "Viudo",
    val: "V",
  },
  {
    name: "Union libre",
    val: "U",
  },
];

const filterActive = computed(() => {
  return (
    enableFilfterByGender.value ||
    enableFilfterByAge.value ||
    enableFilfterBySalary.value ||
    enableFilfterByCivilStatus.value ||
    enableFilfterByLicenceType.value ||
    enableFilfterByScholarity.value ||
    enableFilfterByMachineryUse.value ||
    enableFilfterBySkill.value
  );
});

watch(
  [
    enableFilfterByGender,
    enableFilfterByAge,
    enableFilfterBySalary,
    enableFilfterByCivilStatus,
    enableFilfterByLicenceType,
    enableFilfterByScholarity,
    enableFilfterByMachineryUse,
    enableFilfterBySkill,
    genderChoosed,
    scholarityChoosed,
    civilStatusChoosed,
    licencesTypeChoosed,
    machineryChoosed,
    skillsChoosed,
    initialAgeValue,
    finalAgeValue,
    initialSalaryValue,
    finalSalaryValue,
    // ... add watchers for other filter values
  ],
  () => {
    filters.value = {
      gender: enableFilfterByGender.value ? genderChoosed.value.val : null,
      ageRange: enableFilfterByAge.value
        ? { min: initialAgeValue.value, max: finalAgeValue.value }
        : null,
      salaryRange: enableFilfterBySalary.value
        ? { min: initialSalaryValue.value, max: finalSalaryValue.value }
        : null,
      civilStatus: enableFilfterByCivilStatus.value
        ? civilStatusChoosed.value.val
        : null,
      licenceTypes: enableFilfterByLicenceType.value
        ? licencesTypeChoosed.value
        : [],
      scholarity: enableFilfterByScholarity.value
        ? scholarityChoosed.value
        : [],
      machineryUse: enableFilfterByMachineryUse.value
        ? machineryChoosed.value
        : [],
      skills: enableFilfterBySkill.value ? skillsChoosed.value : [],
    };

    emit("filtersChanged", filters.value);
  }
);

const licenceTypeFilterList = ["Automovil", "Chofer", "Moto", "Otro"];

const scholarityFilterList = [
  "Secundaria",
  "Bachillerato sin certificado",
  "Bachillerato con certificado",
  "Profesional",
  "Maestria",
  "Otro",
];

const machineryFilterListNames = ref([]);

const skillFilterList = [
  "Mécanico Automotríz",
  "Electricista",
  "Electrónico",
  "Chofer",
  "Secretaría",
  "Auxiliar Contable",
  "Intendencia",
  "Vigilancia",
  "Logística",
  "Empaque y/o emplayado",
  "Carpintería",
];

onMounted(() => {
  checkFiltersInSession(); // Check if filters are stored in session
  fetchMachinery(); // Fetch the machinery filter list
  skillFilterList.sort(); // Sort the skills list
});

const checkFiltersInSession = () => {
  const filtersInSession = JSON.parse(getSessionStorageItem("filters"));

  if (filtersInSession) {
    // Set the general filters object
    filters.value = filtersInSession;

    // Set individual filters
    enableFilfterByGender.value = !!filtersInSession.gender;
    genderChoosed.value = filtersInSession.gender
      ? genderFilterList.find((g) => g.val === filtersInSession.gender)
      : "sexo";

    enableFilfterByAge.value = !!filtersInSession.ageRange;
    initialAgeValue.value = filtersInSession.ageRange?.min || 0;
    finalAgeValue.value = filtersInSession.ageRange?.max || 0;

    enableFilfterBySalary.value = !!filtersInSession.salaryRange;
    initialSalaryValue.value = filtersInSession.salaryRange?.min || 0;
    finalSalaryValue.value = filtersInSession.salaryRange?.max || 0;

    enableFilfterByCivilStatus.value = !!filtersInSession.civilStatus;
    civilStatusChoosed.value = filtersInSession.civilStatus
      ? civilStatusFilterList.find(
          (cs) => cs.val === filtersInSession.civilStatus
        )
      : "estado civil";

    enableFilfterByLicenceType.value = !!filtersInSession.licenceTypes.length;
    licencesTypeChoosed.value = filtersInSession.licenceTypes || [];

    enableFilfterByScholarity.value = !!filtersInSession.scholarity.length;
    scholarityChoosed.value = filtersInSession.scholarity || [];

    enableFilfterByMachineryUse.value = !!filtersInSession.machineryUse.length;
    machineryChoosed.value = filtersInSession.machineryUse || [];

    enableFilfterBySkill.value = !!filtersInSession.skills.length;
    skillsChoosed.value = filtersInSession.skills || [];
  }
};


const onGenderChoosed = (item) => {
  genderChoosed.value = item;
};

const onCivilStatusChoosed = (item) => {
  civilStatusChoosed.value = item;
};

const clearFilters = () => {
  enableFilfterByGender.value = false;
  enableFilfterByAge.value = false;
  enableFilfterBySalary.value = false;
  enableFilfterByCivilStatus.value = false;
  enableFilfterByLicenceType.value = false;
  enableFilfterByScholarity.value = false;
  enableFilfterByMachineryUse.value = false;
  enableFilfterBySkill.value = false;

  genderChoosed.value = "sexo";
  scholarityChoosed.value = "escolaridad";
  civilStatusChoosed.value = "estado civil";
  licencesTypeChoosed.value = [];
  machineryChoosed.value = [];
  skillsChoosed.value = [];

  initialAgeValue.value = 0;
  finalAgeValue.value = 0;

  initialSalaryValue.value = 0;
  finalSalaryValue.value = 0;

  emit("filtersChanged", filters.value);
};

const machineryFetched = ref(false);
const fetchMachinery = async () => {
  try {
    machineryFetched.value = false;
    const machineryCatalog = await getAllMachineryActive();

    if (machineryCatalog) {
      machineryCatalog.forEach((element) => {
        machineryFilterListNames.value.push(element.name);
      });

      machineryFilterListNames.value.sort();
    }
  } catch (error) {
  } finally {
    machineryFetched.value = true;
  }
};
</script>
