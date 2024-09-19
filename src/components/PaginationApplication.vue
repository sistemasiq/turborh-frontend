  <template>
  <div class="absolute-left q-ml-md q-mt-md">
    <q-pagination
      v-model="currentPage"
      color="cyan"
      :max="maxPages"
      :max-pages="3"
      boundary-numbers
      disable
    />
  </div>
  <div class="absolute-right q-mt-md q-mr-md q-mb-xl">
    <q-btn v-if="currentPage > 1" class="q-mr-sm" color="cyan" round icon="home" @click.prevent="goToFirstPage">
      <q-tooltip class="text-body2"
              transition-show="scale"
              transition-hide="scale" anchor="top middle"  self="bottom middle" :offset="[10, 10]">
          Ir a inicio
        </q-tooltip>
      </q-btn>
    <q-btn v-if="currentPage > 1" class="q-mr-sm" color="cyan" round icon="navigate_before"  @click.prevent="previousPage">
      <q-tooltip class="text-body2"
              transition-show="scale"
              transition-hide="scale" anchor="top middle"  self="bottom middle" :offset="[10, 10]">
          Anterior
        </q-tooltip>
    </q-btn>
    <q-btn v-if="currentPage < maxPages" class="q-mr-sm" color="cyan" round icon="navigate_next" @click.prevent="nextPage">
      <q-tooltip class="text-body2"
              transition-show="scale"
              transition-hide="scale" anchor="top middle"  self="bottom middle" :offset="[10, 10]">
              Siguiente
        </q-tooltip>
    </q-btn>
    <q-btn :disable="disableNextButton" v-if="currentPage < 11 && (viewingApplication || updatingApplication)" color="cyan" round icon="done" @click.prevent="goToEndPage">
      <q-tooltip class="text-body2"
              transition-show="scale"
              transition-hide="scale" anchor="top middle"  self="bottom middle" :offset="[10, 10]">
          Ir a final
        </q-tooltip>
    </q-btn>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useRequestUser } from "src/stores/requestUser";
import { storeToRefs } from "pinia";


const useRequest = useRequestUser();
const router = useRouter();
const props = defineProps(["page", "requiredFields"]);
const emit = defineEmits(["onFieldValidation"])

const currentPage = ref(0);

const currentRequiredFields = ref([])

const maxPages = computed(() => {
  return viewingApplication.value || updatingApplication.value ? 11 : 12;
})

onMounted(() => {
  setProps()
})

const computedCurrentRequiredFields = computed(() => {
  if(currentRequiredFields.value){
    return currentRequiredFields.value
  }
})

const {updatingApplication, viewingApplication} = storeToRefs(useRequest);

const disableNextButton = computed(() => {

  if(currentRequiredFields.value.length === 0 || viewingApplication.value){
    return false;
  }
  return computedCurrentRequiredFields.value.some(field => !field);
});

watch(props, (newProps) => {
  currentRequiredFields.value = newProps.requiredFields;
});

const nextPage = () => {
  emit("onFieldValidation");

  if(disableNextButton.value)
  return;

  const nextPageIndex = currentPage.value + 1;
  router.push(`/userHome/solicitud-${nextPageIndex}`);
}
const previousPage = () => {
  const previousPageIndex = currentPage.value - 1;
  router.push(`/userHome/solicitud-${previousPageIndex}`);
}

const goToFirstPage = () => {
  router.push("/userHome/solicitud-1");
}

const goToEndPage = () => {
  router.push("/userHome/solicitud-11");
}

const setProps = () => {
  currentPage.value = props.page;

  if(props.requiredFields){
    currentRequiredFields.value = props.requiredFields;
  }
};
</script>
