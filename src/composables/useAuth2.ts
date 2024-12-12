// useAuth.js
import { ref, provide, inject } from "vue";

export const useAuth = () => {
  const user = ref(null);
  const setUser = (newUser) => {
    user.value = newUser;
  };

  provide("auth", { user, setUser });
};

export const useAuthContext = () => {
  return inject("auth");
};
