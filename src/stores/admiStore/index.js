import { defineStore } from "pinia";
import { api } from "src/boot/axios";
import { useSesion } from "../sesion";
const sesion = useSesion();

export const useAdmiStore = defineStore("admiStore", {
  state: () => ({
    solicitudes: [],
    misSolicitudes: [],
    globalNotis: [],
    notisSinLeer: 0,
    admiNotis: 0,
    usuarios: [],
    solicitudesEnProcesoOCompletadas: [],
  }),
  getters: {
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
    solicitudesCompletadasSupervisor: (state) =>
      state.solicitudesEnProcesoOCompletadas.filter((s) =>
        Boolean(s.terminado)
      ),
    getUserById: (state) => {
      return (userId) => state.usuarios.find((user) => user.id === userId);
    },
  },
  actions: {
    async cargarSolicitudes() {
      try {
        this.solicitudes.length = 0;
        const response = await api.get("/solicitudes", sesion.authorizacion);
        const solicitudesResponse = response.data.solicitudes;
        solicitudesResponse.forEach((solicitud) => {
          if (!solicitud.terminado) this.solicitudes.push(solicitud);
        });
      } catch (error) {
        console.log(error);
      }
    },
    async cargarMisSolicitudes() {
      try {
        this.misSolicitudes.length = 0;
        const response = await api.post(
          "/solicitudes-admi",
          { id: sesion.data.user.id },
          sesion.authorizacion
        );
        const solicitudesResponse = response.data.solicitudes;
        solicitudesResponse.forEach((solicitud) => {
          this.misSolicitudes.push(solicitud);
        });
      } catch (error) {
        console.log(error);
      }
    },
    async cargarTodasLasSolicitudes() {
      try {
        this.solicitudes.length = 0;
        const response = await api.get("/solicitudes", sesion.authorizacion);
        const solicitudesResponse = response.data.solicitudes;
        solicitudesResponse.forEach((solicitud) => {
          this.solicitudes.push(solicitud);
        });
      } catch (error) {
        console.log(error);
      }
    },
    async cargarSolicitudesEnProcesoOCompletadas() {
      try {
        this.solicitudesEnProcesoOCompletadas.length = 0;
        const response = await api.get(
          "/solicitudes-supervisor",
          sesion.authorizacion
        );
        const solicitudesResponse = response.data.solicitudes;
        solicitudesResponse.forEach((solicitud) => {
          this.solicitudesEnProcesoOCompletadas.push(solicitud);
        });
      } catch (error) {
        console.log(error);
      }
    },
    async cargarUsuarios() {
      try {
        this.usuarios.length = 0;
        const response = await api.get("/users", sesion.authorizacion);
        const userData = response.data.users;
        userData.forEach((user) => {
          this.usuarios.push(user);
        });
      } catch (error) {
        console.log(error);
      }
    },

    async cambiarProceso(solicitud) {
      try {
        if (solicitud.enProceso)
          solicitud.idAdministrador = sesion.data.user.id;
        if (!solicitud.terminado && !solicitud.enProceso)
          solicitud.idAdministrador = "";
        await api.put(
          `/solicitudes/${solicitud.id}`,
          solicitud,
          sesion.authorizacion
        );
      } catch (error) {
        console.log(error);
      }
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
