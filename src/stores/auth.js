import { ref, computed } from "vue";
import { defineStore } from "pinia";

export const useAuthStore = defineStore("auth", () => {
  const user = ref();
  const logged = ref(false);
  const isLogged = computed(() => logged.value === 1);

  const isAdmin = computed(() => {
    if(user.value){
      return user.value.role === "l"  || user.value.role === "i"
    }
  })
  
  const isRh = computed(() => {
    if(user.value){
      return user.value.role === "r" ? true : false;
    }
  });

  const isBoss = computed(() => {
    if(user.value){
      return user.value.role === "a"
    }
  })

  
  return { user, logged, isLogged, isAdmin, isRh, isBoss};
});
