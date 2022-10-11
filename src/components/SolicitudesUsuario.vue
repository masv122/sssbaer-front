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
      <solicitud-item :data="props" />
    </template>
  </q-table>
</template>

<script>
import { onMounted, reactive } from "@vue/runtime-core";
import { useSesion } from "stores/sesion";
import { api } from "src/boot/axios";
import SolicitudItem from "components/SolicitudItem.vue";
import { apiEvents } from "src/boot/pusher";
const columns = [
  { name: "fecha", label: "Fecha", field: "created_at" },
  { name: "coordinacion", label: "Coordinacion", field: "coordinacion" },
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
    onMounted(async () => {
      console.log(apiEvents.Echo);
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
    };
  },
};
</script>
