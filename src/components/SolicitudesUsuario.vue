<template>
  <q-table
    title="Mis solicitudes"
    :rows="solicitudes"
    :columns="columns"
    row-key="enProceso"
    grid
    hide-header
  >
    <template v-slot:item="props">
      <solicitud-item :data="props" @updateSolicitud="updateSolicitud" />
    </template>
  </q-table>
</template>

<script>
import { onMounted, reactive } from "@vue/runtime-core";
import { useSesion } from "stores/sesion";
import { api } from "src/boot/axios";
import SolicitudItem from "components/SolicitudItem.vue";
const columns = [
  { name: "coordinacion", label: "Coordinacion", field: "name" },
  { name: "problema", label: "Tipo de problema", field: "problema" },
  {
    name: "comentarioAdicional",
    label: "Informacion adicional",
    field: "comentarioAdicional",
  },
];

export default {
  components: {
    SolicitudItem,
  },
  name: "SolicitudesUsuario",
  setup() {
    const sesion = useSesion();
    const usuario = sesion.data.user;
    const solicitudes = reactive([]);
    const updateSolicitud = (solicitud) => {
      const index = solicitudes.findIndex((s) => s.id == solicitud.id);
      solicitudes[index] = solicitud;
    };
    onMounted(async () => {
      const response = await api.post(
        "/solicitudes-usuario",
        {
          id: usuario.id,
        },
        sesion.authorizacion
      );
      const solicitudesResponse = response.data.solicitudes;
      solicitudesResponse.forEach((solicitud) => {
        solicitudes.push(solicitud);
      });
    });
    return {
      columns,
      solicitudes,
      updateSolicitud,
    };
  },
};
</script>
