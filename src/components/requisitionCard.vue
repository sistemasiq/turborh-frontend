<template>
<q-card
          flat
          bordered
          class="rounded-borders"
          style="margin-top: 3%; margin-left: 3%"
        >
          <q-card-section
            v-for="(item, index) in currentRequisitions"
            style="height: 100%; border-bottom-color: red"
            class="row items-center"
          >
            <div class="history-item">
              <p class="text-h4">Puesto</p>
              <p class="text-h4">{{ item.jobName }}</p>
              <p class="text-h4">{{ item.vacancyNumber }}</p>
            </div>

            <div
              v-if="index != currentRequisitions.length - 1"
              style="
                border-bottom: 1px solid #ccc;
                width: 100%;
                padding-top: 1%;
              "
            />
          </q-card-section>
        </q-card>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { storeToRefs } from "pinia";
import { useQuasar } from "quasar";
import { useRequisitionDetailsStore } from "src/stores/requisitionDetails";

import axios from "axios";

const useRequisitionDetails = useRequisitionDetailsStore();
const $q = useQuasar();
const router = useRouter();

const filterAll = ref(false);
const filterDate = ref(false);
const filterAuthorized = ref(false);
const filterUnauthorized = ref(false);

const newSearchedItem = ref("");

const totalRequisitions = ref([]);
const currentRequisitions = ref([]);
const candidatesNumbers = ref([]);

onMounted(() => {
  filterAll.value = true;
  fetchRequisitionsAll(true);
});


const updateCandidateNumbers = () => {
  candidatesNumbers.value = [];

  currentRequisitions.value.forEach((element) => {
    fetchCandidatesNumber(element.numRequisition).then((result) => {
      candidatesNumbers.value.push(result);
    });
  });
};

const handleFilterAll = () => {
  if (!filterAll.value) return;

  const filters = {
    date: filterDate,
    auth: filterAuthorized,
    noAuth: filterUnauthorized,
  };

  Object.keys(filters).forEach((key) => {
    filters[key].value = false;
  });

  fetchRequisitionsAll();
};

const handleFilterDate = () => {
  if (filterDate.value) {
    if (filterAuthorized.value && filterUnauthorized.value) {
      fetchRequisitionsDate();
    } else if (filterAuthorized.value) {
      fetchRequisitionsAuthorizedDate();
    } else if (filterUnauthorized.value) {
      fetchRequisitionsUnauthorizedDate();
    } else {
      fetchRequisitionsDate();
    }
    return;
  }

  if (filterAuthorized.value && filterUnauthorized.value) {
    fetchRequisitionsAll();
  } else if (filterAuthorized.value) {
    fetchRequisitionsAuthorized();
  } else if (filterUnauthorized.value) {
    fetchRequisitionsUnauthorized();
  } else {
    fetchRequisitionsAll();
  }
};

const handleFilterAuthorized = () => {
  if (filterAuthorized.value) {
    if (filterDate.value && filterUnauthorized.value) {
      fetchRequisitionsDate();
    } else if (filterDate.value) {
      fetchRequisitionsAuthorizedDate();
    } else if (filterUnauthorized.value) {
      fetchRequisitionsAll();
    } else {
      fetchRequisitionsAuthorized();
    }

    return;
  }

  if (filterDate.value && filterUnauthorized.value) {
    fetchRequisitionsUnauthorizedDate();
  } else if (filterUnauthorized.value) {
    fetchRequisitionsUnauthorized();
  } else if (filterDate.value) {
    fetchRequisitionsDate();
  } else {
    fetchRequisitionsAll();
  }
};

const handleFilterUnauthorized = () => {
  if (filterUnauthorized.value) {
    if (filterDate.value && filterAuthorized.value) {
      fetchRequisitionsDate();
    } else if (filterDate.value) {
      fetchRequisitionsUnauthorizedDate();
    } else if (filterAuthorized.value) {
      fetchRequisitionsAll();
    } else {
      fetchRequisitionsUnauthorized();
    }
    return;
  }

  if (filterDate.value && filterAuthorized.value) {
    fetchRequisitionsAuthorizedDate();
  } else if (filterAuthorized.value) {
    fetchRequisitionsAuthorized();
  } else if (filterDate.value) {
    fetchRequisitionsDate();
  } else {
    fetchRequisitionsAll();
  }
};

const setCandidatesNumbers = async () => {
  for (const item of currentRequisitions.value) {
    const number = await fetchCandidatesNumber(item.numRequisition);
    candidatesNumbers.value.push(number);
  }
};

const fetchRequisitionsAll = async (onMounted) => {
  try {
    const notifyRequisitions = $q.notify({
      type: "ongoing",
      message: "Cargando requisiciones...",
      position: "bottom",
    });

    const request = await axios.get(`/requisicion/autorizada`);

    if (request.status === 200) {
      currentRequisitions.value = request.data;
      updateCandidateNumbers();
      if (onMounted) {
        totalRequisitions.value = currentRequisitions.value;
      }
      notifyRequisitions();
    } else {
      console.log("Error on fetch requisitions with status " + request.status);
    }
  } catch (error) {
    console.log(error);
  }
};

const fetchRequisitionsDate = async () => {
  try {
    const request = await axios.get(
      `/requisicion/porFecha`
    );

    if (request.status === 200) {
      currentRequisitions.value = request.data;
      updateCandidateNumbers();
    } else {
      console.log(
        "Error on fetch requisitions by date with status " + request.status
      );
    }
  } catch (error) {
    console.log("Error on fetching requisitions by date");
  }
};

const fetchRequisitionsAuthorized = async () => {
  try {
    const request = await axios.get(
      `/requisicion/autorizada`
    );

    if (request.status === 200) {
      currentRequisitions.value = request.data;
      updateCandidateNumbers();
    } else {
      console.log(
        "Error on fetch requisitions authorized with status " + request.status
      );
    }
  } catch (error) {
    console.log("Error on fetching requisitions authorized");
  }
};

const fetchRequisitionsUnauthorized = async () => {
  try {
    const request = await axios.get(
      `/requisicion/noAutorizada`
    );

    if (request.status === 200) {
      currentRequisitions.value = request.data;
      updateCandidateNumbers();
    } else {
      console.log(
        "Error on fetch requisitions unauthorized with status " + request.status
      );
    }
  } catch (error) {
    console.log("Error on fetching requisitions unauthorized");
  }
};

const fetchRequisitionsAuthorizedDate = async () => {
  try {
    const request = await axios.get(
      `/requisicion/autorizada/porFecha`
    );

    if (request.status === 200) {
      currentRequisitions.value = request.data;
      updateCandidateNumbers();
    } else {
      console.log(
        "Error on fetch requisitions authorized by date with status " +
          request.status
      );
    }
  } catch (error) {
    console.log("Error on fetching requisitions authorized");
  }
};

const fetchRequisitionsUnauthorizedDate = async () => {
  try {
    const request = await axios.get(
      `/requisicion/noAutorizada/porFecha`
    );

    if (request.status === 200) {
      currentRequisitions.value = request.data;
      updateCandidateNumbers();
    } else {
      console.log("Request status " + request.status);
    }
  } catch (error) {
    console.log("Error on fetching requisitions authorized");
  }
};

const fetchCandidatesNumber = async (numRequisition) => {
  try {
    const request = await axios.get(
      `/requisicion/candidatos/${numRequisition}`
    );

    if (request.status === 200) {
      return request.data;
    }
  } catch (error) {
    console.log("Error fetching candidates number");
  }
  return null;
};
</script>


<style>
.rounded-borders {
  border-radius: 15px;
  background-color: #ffffff;
}

.button {
  width: 150px;
  height: 50px;
}

.button.details {
  background-color: #38638a;
  color: #ffffff;
}

.button.print {
  background-color: #7ee7e7;
  color: #38638a;
  width: 200px;
  left: 85%;
  position: absolute;
}

.filter {
  height: 100%;
  margin-left: 18%;
  margin-top: 2%;
  width: 95%;
  padding-left: 10%;
  color: #ffffff;
}

.text-requests {
  font-size: 24px;
  background-color: #f1f6fc;
  border-radius: 100px;
  color: #fd999a;
  width: 50px;
  margin-left: 20%;
}

.history-item {
  margin: 1%;
  flex: 1;
}

.history-item p {
  font-size: 20px;
}

.filter-icon {
  margin-left: 0.5%;
  margin-bottom: 0.1%;
}
</style>
