import { defineStore } from "pinia";
import { api } from "src/boot/axios";
import { useSesion } from "../sesion";
const sesion = useSesion();

export const useAdmiStore = defineStore("admiStore", {
  state: () => ({
    solicitudes: [],
    globalNotis: 0,
    admiNotis: 0,
    usuarios: [],
  }),
  getters: {
    misSolicitudes: (state) =>
      state.solicitudes.filter(
        (solicitud) => solicitud.idAdministrador == sesion.data.user.id
      ),
    usuariosTrabajadores: (state) =>
      state.usuarios.filter((user) => user.admi === 0),
    usuariosAdministradores: (state) =>
      state.usuarios.filter((user) => user.admi === 1),
    solicitudesSinAtender: (state) =>
      state.solicitudes.filter((s) => !s.enProceso && !s.terminado),
    solicitudesAtendidas: (state) =>
      state.solicitudes.filter((s) => s.enProceso && !s.terminado),
    solicitudesCompletadas: (state) =>
      state.solicitudes.filter((s) => !s.enProceso && s.terminado),
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
    async cargarTodasLasSolicitudes() {
      this.solicitudes.length = 0;
      const response = await api.get("/solicitudes");
      const solicitudesResponse = response.data.solicitudes;
      solicitudesResponse.forEach((solicitud) => {
        this.solicitudes.push(solicitud);
      });
    },
    async cargarUsuarios() {
      this.usuarios.length = 0;
      const response = await api.get("/users", sesion.authorizacion);
      const userData = response.data.users;
      userData.forEach((user) => {
        this.usuarios.push(user);
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
