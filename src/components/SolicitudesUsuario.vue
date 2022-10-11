<template>
  <q-banner rounded class="bg-grey-3" v-show="sinConfirmar > 0">
    <template v-slot:avatar>
      <q-icon name="contact_support" color="primary" />
    </template>
    Tiene solicitudes sin confirmar, si fue atendido(a) correctamente porfavor
    confirmelas, Esto ayuda a la coordinacion de TIC ha contabilizar mejor su
    trabajo.
  </q-banner>
  <q-table
    title="Mis solicitudes"
    :rows="solicitudes"
    :columns="columns"
    row-key="id"
    grid
    hide-header
  >
    <template v-slot:top>
      <q-toggle
        v-model="sinAtender"
        color="red"
        label="Sin atender"
        @click="
          cargarSolicitudes();
          todas = false;
        "
      />
      <q-toggle
        v-model="enEspera"
        color="red"
        label="En espera"
        @click="
          cargarSolicitudes();
          todas = false;
        "
      />
      <q-toggle
        v-model="completadas"
        color="red"
        label="Completadas"
        @click="
          cargarSolicitudes();
          todas = false;
        "
      />
      <q-toggle
        v-model="todas"
        color="red"
        label="Todas"
        @click="cargarSolicitudes()"
      />
      <q-space />
      <!--       <q-input borderless dense debounce="300" color="primary" v-model="filter">
        <template v-slot:append>
          <q-icon name="search" />
        </template>
      </q-input> -->
    </template>
    <template v-slot:item="props">
      <solicitud-item :data="props" @updateSolicitud="updateSolicitud" />
    </template>
  </q-table>
</template>

<script>
import { computed, onMounted, reactive, ref } from "@vue/runtime-core";
import { useSesion } from "stores/sesion";
import { api } from "src/boot/axios";
import SolicitudItem from "components/SolicitudItem.vue";
import { useQuasar } from "quasar";
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
    const sinAtender = ref(false);
    const enEspera = ref(false);
    const completadas = ref(false);
    const todas = ref(true);
    const $q = useQuasar();
    const usuario = sesion.data.user;
    const solicitudes = reactive([]);
    const sinConfirmar = computed(
      () =>
        solicitudes.filter(
          (s) => Boolean(s.terminado) && !Boolean(s.confirmada)
        ).length
    );
    const cargarSolicitudes = async () => {
      try {
        solicitudes.length = 0;
        const response = await api.post(
          "/solicitudes-usuario",
          {
            id: usuario.id,
          },
          sesion.authorizacion
        );
        const solicitudesResponse = response.data.solicitudes;
        solicitudesResponse.forEach((solicitud) => {
          if (todas.value) solicitudes.push(solicitud);
          else {
            if (
              sinAtender.value &&
              !solicitud.enProceso &&
              !solicitud.terminado
            )
              solicitudes.push(solicitud);
            if (enEspera.value && solicitud.enProceso && !solicitud.terminado)
              solicitudes.push(solicitud);
            if (completadas.value && solicitud.terminado)
              solicitudes.push(solicitud);
          }
        });
      } catch (error) {
        console.log(error);
        $q.notify({
          color: "negative",
          icon: "info",
          message:
            "error al cargar las solicitudes, para mas informacion consulte la consola",
        });
      }
    };
    const updateSolicitud = (solicitud) => {
      const index = solicitudes.findIndex((s) => s.id == solicitud.id);
      solicitudes[index] = solicitud;
    };
    onMounted(async () => {
      cargarSolicitudes();
    });
    return {
      columns,
      solicitudes,
      updateSolicitud,
      cargarSolicitudes,
      sinAtender,
      enEspera,
      completadas,
      todas,
      sinConfirmar,
    };
  },
};
</script>
