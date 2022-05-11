import { defineStore } from "pinia";
import { api } from "src/boot/axios";
import { useSesion } from "../sesion";
const sesion = useSesion();

export const useAdmiStore = defineStore("admiStore", {
  state: () => ({
    solicitudes: [],
    globalNotis: 0,
    admiNotis: 0,
  }),
  getters: {
    misSolicitudes: (state) =>
      state.solicitudes.filter(
        (solicitud) => solicitud.idAdministrador == sesion.data.user.id
      ),
  },
  actions: {
    async cargarSolicitudes() {
      this.solicitudes.length = 0;
      const response = await api.get("/solicitudes", sesion.authorizacion);
      const solicitudesResponse = response.data.solicitudes;
      solicitudesResponse.forEach((solicitud) => {
        if (!solicitud.terminado) this.solicitudes.push(solicitud);
      });
    },

    async cambiarProceso(solicitud) {
      if (solicitud.enProceso) solicitud.idAdministrador = sesion.data.user.id;
      if (!solicitud.terminado && !solicitud.enProceso)
        solicitud.idAdministrador = "";
      await api.put(
        `/solicitudes/${solicitud.id}`,
        solicitud,
        sesion.authorizacion
      );
    },

    async getAdmi(id) {
      try {
        return api.get(`/users/${id}`, sesion.authorizacion);
      } catch (error) {
        console.log(error);
        return "error al localizar el administrador";
      }
    },
  },
});
