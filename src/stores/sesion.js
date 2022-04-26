import { defineStore } from "pinia";

export const useSesion = defineStore("sesion", {
  state: () => ({
    data: {
      user: {
        name: "",
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
