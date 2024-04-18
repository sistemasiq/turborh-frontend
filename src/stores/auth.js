import { ref, computed } from "vue";
import { defineStore } from "pinia";



export const useAuthStore = defineStore("auth", () => {
  const user = ref();
  const logged = ref(false);
  const isLogged = computed(() => logged.value === 1);
  const isAdmin = computed(() => {
    if (user.value) {
      return user.value.role === "l" || user.value.role === "i";
    }
  });

  const isRh = computed(() => {
    return user.value && user.value.role === "r";
  });

  const isIng = computed(() => {
    return user.value && user.value.role === "i";
  });

  const isLic = computed(() => {
    return user.value && user.value.role === "l";
  });

  const isBoss = computed(() => {
    return user.value && user.value.role === "j";
  });

  const hasPermitRequisitionAuthorization = computed(() => {
    return user.value && ["l", "i"].includes(user.value.role);
  });

  const hasPermitRequisitionCreation = computed(() => {
    return user.value && ["r", "l", "i", "j"].includes(user.value.role);
  });

  const getUserPhotoUUID = computed(() => {
    if (user.value) {
      return user.value.photoUUID === "" ||
        user.value.photoUUID === null ||
        user.value.photoUUID === undefined
        ? "default.png"
        : user.value.photoUUID;
    }
  });

  const userId = ref("");
  const userName = ref("");
  const userEmail = ref("");
  const userPhoneNumber = ref("");
  const photoUUID = ref("");
  const verificationCode = ref("");
  const role = ref("");

  return {
    user,
    logged,
    isLogged,
    isAdmin,
    isRh,
    isBoss,
    isIng,
    isLic,
    hasPermitRequisitionAuthorization,
    hasPermitRequisitionCreation,
    getUserPhotoUUID,
    userId,
    userName,
    userEmail,
    userPhoneNumber,
    photoUUID,
    verificationCode,
    role
  };
});
