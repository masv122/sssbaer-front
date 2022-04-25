import { defineStore } from "pinia";

export const useSesion = defineStore("sesion", {
  state: () => ({
    data: {
      user: {
        displayName: "",
        email: "",
        id: "",
      },
      token: {
        access_token: "",
        token_type: "",
      },
    },
  }),
});
