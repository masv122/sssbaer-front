import { defineStore } from "pinia";
import { Cookies } from "quasar";
import { api } from "src/boot/axios";
import { apiEvents } from "src/boot/pusher";

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
          Accept: "application/json",
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
          const setData = this.setUser();
          return setData || false;
        }
      } catch (error) {
        console.log(error);
        return false;
      }
    },
    async setUser() {
      try {
        const user = await api.get("/user", this.authorizacion);
        apiEvents.setConfig(this.authorizacion);
        if (user.data) this.data.user = user.data;
        return true;
      } catch (error) {
        console.log(error);
        return false;
      }
    },

    async isAuth() {
      if (this.data.token.access_token) {
        try {
          const result = await api.get("/user", this.authorizacion);
          return result.data.message === "Unauthenticated." ? false : true;
        } catch (error) {
          console.log(error);
          return false;
        }
      } else {
        return false;
      }
    },

    async logout() {
      try {
        const response = await api.get("/logout", this.authorizacion);
        Cookies.remove("token");
        if (response.data.res) {
          this.data = {
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
          };
          return true;
        } else return false;
      } catch (error) {
        console.log(error);
        return false;
      }
    },
  },
});
