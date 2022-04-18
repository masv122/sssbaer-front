import { defineStore } from "pinia";

export const useSesion = defineStore("sesion", {
  state: () => ({
    sesion: {
      displayName: "",
      email: "",
      uid: "",
    },
  }),
});
