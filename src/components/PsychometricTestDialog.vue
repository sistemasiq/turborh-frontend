<template>
  <q-dialog v-model="open">
    <q-card>
      <q-card-section>
        <div class="text-h6">Enviar test psicométrico</div>
        <q-checkbox
          class="absolute-right q-mr-xl"
          v-model="sendLink"
          label="Enviar link"
          @update:model-value="resetPsychTestInformation()"
        />
      </q-card-section>

      <q-separator />

      <q-card-section
        v-if="!sendLink"
        style="width: 550px; max-width: 90vw; max-height: 50vh"
        class="justify-between"
        horizontal
      >
        <q-card-section style="width: 50%">
          <q-btn-dropdown
            flat
            auto-close
            color="white"
            text-color="grey-9"
            :icon="dropdownIcon"
            :label="dropdownLabel"
            class="text-weight-regular"
            dropdown-content-class="flexible-width"
          >
            <q-list>
              <q-item
                v-for="(item, index) in totalPlatforms"
                :key="index"
                clickable
                v-close-popup
                @click.prevent="selectPsychPlatform(item)"
              >
                <q-item-section avatar>
                  <q-avatar
                    :icon="getAvatarIcon(item)"
                    :color="getAvatarColor(item)"
                    text-color="white"
                  />
                </q-item-section>
                <q-item-section>
                  <q-item-label>{{ item.psychPlatformName }}</q-item-label>
                </q-item-section>
              </q-item>
            </q-list>
          </q-btn-dropdown>
        </q-card-section>

        <q-card-section style="width: 50%">
          <q-input
            v-if="psychPlatformRequireCredentials"
            light
            outlined
            color="black"
            v-model="userNameForPsychTests"
            label="Nombre"
            label-color="black"
            lazy-rules
            :rules="requiredFieldRules"
            style="width: 100%"
          />
          <q-input
            v-if="psychPlatformRequireCredentials"
            light
            outlined
            color="black"
            v-model="passwordForPsychTest"
            label="Contraseña"
            label-color="black"
            lazy-rules
            :rules="requiredFieldRules"
            style="width: 100%"
          />
        </q-card-section>
      </q-card-section>

      <q-card-section
        v-if="sendLink"
        style="width: 550px; max-width: 90vw; max-height: 50vh"
        class="justify-between"
        horizontal
      >
        <q-card-section style="width: 100%">
          <q-input
            light
            outlined
            color="black"
            v-model="testLink"
            label="Link del formulario"
            label-color="black"
            lazy-rules
            :rules="requiredFieldRules"
          />
        </q-card-section>
      </q-card-section>

      <q-separator />

      <q-card-actions class="justify-end q-pa-md">
        <q-btn
          flat
          v-close-popup
          label="Cancelar"
          class="text-red-8 q-mr-sm"
          style="border-radius: 8px"
          @click.prevent="resetPsychTestInformation()"
        />
        <q-btn
          flat
          icon="send"
          label="Enviar"
          class="text-white"
          :class="disableSendPsychTestButton ? 'bg-grey-5' : 'bg-green-13'"
          style="border-radius: 8px"
          @click.prevent="handleSendClick"
          :disable="disableSendPsychTestButton"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { getPsychometricPlatforms } from "src/services/user";
import { ref, computed, watch, onMounted } from "vue";
import { useQuasar } from "quasar";
import { notifyNegative, notifyPositive } from "src/utils/notifies";
import { postUserPsychTestData, putUserPsychTestData } from "src/services/user";
import { sendLinkMessage, sendPsychTestMessage } from "src/services/whatsApp";
import { sendPsychometricTestEmail } from "src/services/mail";

const $q = useQuasar();
// Props to receive data from parent
const props = defineProps({
  open: Boolean, // Controls dialog visibility
  selectedCandidate: Object, // Candidate data object
});

// Emit event to parent
const emit = defineEmits(["update:open", "update:selectedCandidate"]);

// Internal reactive states
const open = ref(props.open);
const sendLink = ref(false);
const selectedPsychTestPlatform = ref("");
const userNameForPsychTests = ref("");
const passwordForPsychTest = ref("");
const psychPlatformRequireCredentials = ref(false);
const testLink = ref("");
const totalPlatforms = ref([]);
const psychTestPlatformId = ref("");
const selectedCandidate = ref({});
const psychPlatformLink = ref("");
const userId = ref(0);
const userPhoneNumber = ref("");
const userName = ref("");
const userPsychTestStatus = ref("");

const disableSendPsychTestButton = computed(() => {
  // Define the logic to disable/enable the send button
  if (
    props.selectedCandidate.candidatePsychData.some(
      (candidate) => candidate.psychPlatformId === psychTestPlatformId.value
    )
  ) {
    return true;
  }
  if (
    psychTestPlatformId.value != "" &&
    !psychPlatformRequireCredentials.value &&
    !sendLink.value
  ) {
    return false;
  }
  if (
    psychTestPlatformId.value != "" &&
    psychPlatformRequireCredentials.value &&
    !sendLink.value
  ) {
    return !(
      selectedPsychTestPlatform.value &&
      userNameForPsychTests.value &&
      passwordForPsychTest.value
    );
  }
  if (sendLink.value) {
    return testLink.value === "";
  }
  return true;
});

// Watcher to update dialog visibility
watch(
  () => props.open,
  (val) => {
    open.value = val;
    if (open.value) {
      setSelectedCandidate();
    }
  }
);

onMounted(() => {
  getPsychPlatformsData();
});

const setSelectedCandidate = () => {
  if (props.selectedCandidate) {
    selectedCandidate.value = props.selectedCandidate;

    userId.value = selectedCandidate.value.userId;
    if (userId.value === undefined || userId.value === 0) {
      userId.value = selectedCandidate.value.creado_por;
    }
    userName.value = selectedCandidate.value.name;
    if (userName.value === undefined || userName.value === "") {
      userName.value = selectedCandidate.value.nombre;
    }

    userPhoneNumber.value = selectedCandidate.value.phoneNumber;
    if (userPhoneNumber.value === undefined || userPhoneNumber.value === 0) {
      userPhoneNumber.value = selectedCandidate.value.telefono;
    }

    userPsychTestStatus.value = selectedCandidate.value.psychTestStatus;
    if (
      userPsychTestStatus.value === undefined ||
      userPsychTestStatus.value === ""
    ) {
      userPsychTestStatus.value =
        selectedCandidate.value.test_psicometrico_estado;
    }
    console.log("SELECTED CANDIDATE USER => " + userId.value);
    console.log(selectedCandidate.value);
  }
};

const isStatusInEnglishFormat = () => {
  if (
    selectedCandidate.value.psychTestStatus === undefined ||
    selectedCandidate.value.psychTestStatus === ""
  ) {
    return false;
  } else {
    return true;
  }
};

// Method to reset form fields
const resetPsychTestInformation = () => {
  selectedPsychTestPlatform.value = "";
  userNameForPsychTests.value = "";
  passwordForPsychTest.value = "";
  psychPlatformRequireCredentials.value = false;
  psychTestPlatformId.value = "";
  emit("update:open", false);
};

// Method to select the platform
const selectPsychPlatform = (platform) => {
  psychTestPlatformId.value = platform.id;
  selectedPsychTestPlatform.value = platform.psychPlatformName;
  psychPlatformLink.value = platform.link;
  if (platform.requireCredentials) {
    psychPlatformRequireCredentials.value = true;
    sendLink.value = false;
  } else {
    psychPlatformRequireCredentials.value = false;
  }
};

// Helper to determine dropdown icon based on selected platform
const dropdownIcon = computed(() => {
  if (selectedPsychTestPlatform.value === "") return "list";
  return selectedPsychTestPlatform.value === "Grupo Arhca" ? "group" : "list";
});

// Helper to determine dropdown label
const dropdownLabel = computed(() => {
  return selectedPsychTestPlatform.value || "Plataforma";
});

// Helper to get avatar icon based on platform
const getAvatarIcon = (item) => {
  return item.psychPlatformName !== "Grupo Arhca" ? "list" : "group";
};

// Helper to get avatar color based on platform
const getAvatarColor = (item) => {
  return item.psychPlatformName === "Grupo Arhca" ? "purple-4" : "grey-4";
};

// Default validation rule
const requiredFieldRules = [
  (value) => !!value || "Este campo no puede estar vacío.",
];

// Placeholder method to handle sending information (use your existing logic here)
const handleSendClick = async () => {
  // Call your send logic here or refactor to import existing methods
  await sendPsychTestInformation();
};

const sendPsychTestInformation = async () => {
  if (sendLink.value) {
    await sendPsychTestLink();
  }
  if (
    psychTestPlatformId.value != "" &&
    !sendLink.value &&
    psychPlatformRequireCredentials.value
  ) {
    let candidateIndex = -1;

    if (selectedCandidate.value.candidatePsychData) {
      candidateIndex = selectedCandidate.value.candidatePsychData.findIndex(
        (candidate) => candidate.psychPlatformId === psychTestPlatformId.value
      );
    }

    if (candidateIndex < 0) {
      postUserPsychData();
    } else if (candidateIndex >= 0) {
      putUserPsychData();
    }
  }
  if (
    psychTestPlatformId.value != "" &&
    !sendLink.value &&
    !psychPlatformRequireCredentials.value
  ) {
    let candidateIndex = -1;

    if (selectedCandidate.value.candidatePsychData) {
      candidateIndex = selectedCandidate.value.candidatePsychData.findIndex(
        (candidate) => candidate.psychPlatformId === psychTestPlatformId.value
      );
    }

    if (candidateIndex < 0) {
      postUserPsychFormsData();
    } else if (candidateIndex >= 0) {
      $q.notify(notifyNegative("El link ya ha sido enviado"));
    }
  }
};

const sendPsychTestLink = async () => {
  try {
    $q.loading.show();

    const sendedMessage = await sendLinkMessage(
      userPhoneNumber.value,
      userName.value,
      testLink.value
    );

    if (sendedMessage) {
      $q.notify(notifyPositive("Enviado link correctamente"));
      testLink.value = ""; //cleans the input field that retrieves the free link
      sendLink.value = false; //Returns to default state the send link variable which is the v-model of the checkbox for send free links
      resetPsychTestInformation();
    }
  } catch (error) {
    console.log(error);
  } finally {
    emit("update:open", false);
    $q.loading.hide();
  }
};

const postUserPsychFormsData = async () => {
  try {
    $q.loading.show(); //shows the loading indicator

    //build the object to save in the database
    const data = {
      psychPlatformId: psychTestPlatformId.value,
      psychPlatformName: selectedPsychTestPlatform.value,
      psychPlatformLink: psychPlatformLink.value,
      psychPlatformUserName: "",
      psychPlatformPassword: "",
      requiredCredentials: psychPlatformRequireCredentials.value,
    };

    let userPsychPlatformStatus = "";
    if (userPsychTestStatus.value == null || userPsychTestStatus.value == "") {
      userPsychPlatformStatus = "P";
    } else if (userPsychTestStatus.value == "E") {
      userPsychPlatformStatus = "E";
    }

    const response = await postUserPsychTestData(
      userId.value,
      psychTestPlatformId.value,
      "",
      "",
      userPsychPlatformStatus
    ); //call to method post that sends the data to the endpoint

    if (response == true) {
      userPsychTestStatus.value = "E";
      if(isStatusInEnglishFormat()){
        selectedCandidate.value.psychTestStatus = "E"
      }else{
        selectedCandidate.value.test_psicometrico_estado = "E"
      }
      selectedCandidate.value.candidatePsychData.push(data);
    }

    emit("update:selectedCandidate", selectedCandidate.value);

    //TODO: sends the data via WhatsApp
    const sendedMessage = await sendLinkMessage(
      userPhoneNumber.value,
      userName.value,
      psychPlatformLink.value
    );
    if (sendedMessage) {
      $q.notify(notifyPositive("Enviado link correctamente"));
    }

    testLink.value = ""; //cleans the input field that retrieves the free link
    sendLink.value = false; //Returns to default state the send link variable which is the v-model of the checkbox for send free links
    resetPsychTestInformation(); //cleans the variables
  } catch (error) {
    console.log(error);
  } finally {
    emit("update:open", false);
    $q.loading.hide();
  }
};

const postUserPsychData = async () => {
  try {
    $q.loading.show(); //shows the loading indicator

    //build the object to push in the local array
    const data = {
      psychPlatformId: psychTestPlatformId.value,
      psychPlatformName: selectedPsychTestPlatform.value,
      psychPlatformLink: psychPlatformLink.value,
      psychPlatformUserName: userNameForPsychTests.value,
      psychPlatformPassword: passwordForPsychTest.value,
      requiredCredentials: psychPlatformRequireCredentials.value,
    };

    //TODO: this is useless
    //NOTA Esquire: a
    let userPsychPlatformStatus = "";
    if (userPsychTestStatus.value == null || userPsychTestStatus.value == "") {
      userPsychPlatformStatus = "P";
    } else if (userPsychTestStatus.value == "E") {
      userPsychPlatformStatus = "E";
    }

    const response = await postUserPsychTestData(
      userId.value,
      psychTestPlatformId.value,
      userNameForPsychTests.value,
      passwordForPsychTest.value,
      userPsychPlatformStatus
    ); //call to method post that sends the data to the endpoint

    if (response == true) {
      userPsychTestStatus.value = "E";
      if(isStatusInEnglishFormat()){
        selectedCandidate.value.psychTestStatus = "E"
      }else{
        selectedCandidate.value.test_psicometrico_estado = "E"
      }
      selectedCandidate.value.candidatePsychData.push(data);
    }
    emit("update:selectedCandidate", selectedCandidate.value);

    //sends the data via email
    const sendedEmail = await sendPsychometricTestEmail(
      selectedCandidate.value.email,
      userName.value,
      userNameForPsychTests.value,
      passwordForPsychTest.value
    );

    if (sendedEmail) {
      // If the email was sended succesfully then we send the whatsApp
      const sendedMessage = await sendPsychTestMessage(
        userPhoneNumber.value,
        userName.value,
        userNameForPsychTests.value,
        passwordForPsychTest.value
      );
      if (sendedMessage) {
        $q.notify(notifyPositive("Enviada prueba psicométrica correctamente"));
      }
    }
    testLink.value = ""; //cleans the input field that retrieves the free link
    sendLink.value = false; //Returns to default state the send link variable which is the v-model of the checkbox for send free links
    resetPsychTestInformation(); //cleans the variables
  } catch (error) {
    console.log(error);
  } finally {
    emit("update:open", false);
    $q.loading.hide();
  }
};

//UPDATE PSYCH DATA--------------------------------------------------------------------
const putUserPsychData = async () => {
  try {
    $q.loading.show(); //shows the loading indicator

    //build the object to save in the database
    const data = {
      psychPlatformId: psychTestPlatformId.value,
      psychPlatformName: selectedPsychTestPlatform.value,
      psychPlatformLink: psychPlatformLink.value,
      psychPlatformUserName: userNameForPsychTests.value,
      psychPlatformPassword: passwordForPsychTest.value,
      requiredCredentials: psychPlatformRequireCredentials.value,
    };

    const response = await putUserPsychTestData(
      userNameForPsychTests.value,
      passwordForPsychTest.value,
      userId.value,
      psychTestPlatformId.value
    ); //call to method post that sends the data to the endpoint

    if (response == true) {
      const candidateIndex =
        selectedCandidate.value.candidatePsychData.findIndex(
          (candidate) => candidate.psychPlatformId === psychTestPlatformId.value
        );
      selectedCandidate.value.candidatePsychData[candidateIndex] = data;
    }

    emit("update:selectedCandidate", selectedCandidate.value);

    //sends the data via email
    const sendedEmail = await sendPsychometricTestEmail(
      selectedCandidate.value.email,
      userName.value,
      userNameForPsychTests.value,
      passwordForPsychTest.value
    );

    if (sendedEmail) {
      // If the email was sended succesfully then we send the whatsApp
      const sendedMessage = await sendPsychTestMessage(
        userPhoneNumber.value,
        userName.value,
        userNameForPsychTests.value,
        passwordForPsychTest.value
      );
      if (sendedMessage) {
        $q.notify(notifyPositive("Enviada prueba psicométrica correctamente"));
      }
    }
    testLink.value = ""; //cleans the input field that retrieves the free link
    sendLink.value = false; //Returns to default state the send link variable which is the v-model of the checkbox for send free links
    resetPsychTestInformation(); //cleans the variables
  } catch (error) {
    console.log(error);
  } finally {
    emit("update:open", false);
    $q.loading.hide();
  }
};

const getPsychPlatformsData = async () => {
  try {
    const request = await getPsychometricPlatforms();
    if (request) {
      totalPlatforms.value = request;
    }
  } catch (error) {}
};
</script>

<style scoped>
.q-btn {
  border-radius: 8px;
}
</style>
