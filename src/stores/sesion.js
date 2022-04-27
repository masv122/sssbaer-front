import { defineStore } from "pinia";
import { api } from "src/boot/axios";

export const useSesion = defineStore("sesion", {
  state: () => ({
    data: {
      user: {
        name: "",
        email: "",
        id: "",
        admi: null,
      },
      token: {
        access_token: "",
        token_type: "",
      },
    },
  }),
  getters: {
    authorizacion(state) {
      return {
        headers: {
          Authorization: `Bearer ${state.data.token.access_token}`,
        },
      };
    },
  },
  actions: {
    async login(email, contraseña) {
      try {
        const userCredential = await api.post("/login", {
          email: email,
          password: contraseña,
        });
        if (userCredential.status === 200) {
          this.data.token = userCredential.data;
          const config = {
            headers: {
              Authorization: `Bearer ${this.data.token.access_token}`,
            },
          };
          const user = await api.get("/info-user", config);
          if (user.data) this.data.user = user.data;
          return true;
        }
      } catch (error) {
        console.log(error);
        return false;
      }
    },
  },
});
