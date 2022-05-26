<template>
  <q-table
    title="Mis solicitudes"
    :rows="admiStore.solicitudes"
    :columns="columns"
    row-key="id"
    grid
    hide-header
  >
    <template v-slot:top>
      <q-icon name="view_list" color="negative" size="3em" />

      <q-space />

      <q-btn
        class="glossy"
        round
        color="negative"
        icon="refresh"
        @click="admiStore.cargarSolicitudes()"
      />
    </template>

    <template v-slot:item="props">
      <solicitud-item-admi
        :data="props"
        :supervisor="supervisor"
        @cambiarProceso="cambiarProceso"
        @completarSolicitud="completarSolicitud"
      />
    </template>
  </q-table>
</template>

<script>
import { onMounted } from "@vue/runtime-core";
import { useSesion } from "src/stores/sesion";
import { useAdmiStore } from "src/stores/admiStore";
import { apiEvents } from "src/boot/pusher";
import { useQuasar } from "quasar";
import SolicitudItemAdmi from "./SolicitudItemAdmi.vue";
const columns = [
  { name: "id", label: "ID", field: "id" },
  { name: "coordinacion", label: "Coordinacion", field: "coordinacion" },
  { name: "problema", label: "Tipo de problema", field: "problema" },
  {
    name: "comentarioAdicional",
    label: "Informacion adicional",
    field: "comentarioAdicional",
  },
  {
    name: "name",
    label: "Nombre",
    field: "name",
  },
];

export default {
  components: {
    SolicitudItemAdmi,
  },
  props: {
    supervisor: {
      type: Boolean,
      default: false,
    },
  },
  setup(props) {
    const sesion = useSesion();
    const $q = useQuasar();
    const admiStore = useAdmiStore();
    const cambiarProceso = (solicitud, key) => {
      solicitud.enProceso = !!!solicitud.enProceso;
      if (solicitud.enProceso) admiStore.cambiarProceso(solicitud);
      else
        $q.dialog({
          title: "Has cancelado una solicitud",
          message: "¿Porque cancelaste la solicitud?",
          prompt: {
            model: "",
            isValid: (val) => val.length > 2,
            type: "text",
          },
          cancel: true,
          persistent: true,
        })
          .onOk((data) => {
            solicitud.razonCancelado = data;
            admiStore.cambiarProceso(solicitud);
          })
          .onCancel(() => {
            admiStore.solicitudes[key].enProceso = !!!solicitud.enProceso;
          });
    };
    const completarSolicitud = (solicitud, key) => {
      solicitud.enProceso = !!!solicitud.enProceso;
      solicitud.terminado = !!!solicitud.terminado;
      if (solicitud.terminado)
        $q.dialog({
          title: "Completar solicitud",
          message: "Indica tus observaciones",
          prompt: {
            model: "",
            isValid: (val) => val.length > 2,
            type: "text",
          },
          cancel: true,
          persistent: true,
        })
          .onOk((data) => {
            solicitud.observacionesAlCompletar = data;
            admiStore.cambiarProceso(solicitud);
          })
          .onCancel(() => {
            admiStore.solicitudes[key].enProceso = !!!solicitud.enProceso;
            admiStore.solicitudes[key].terminado = !!!solicitud.terminado;
          });
    };
    onMounted(async () => {
      if (props.supervisor) await admiStore.cargarTodasLasSolicitudes();
      else await admiStore.cargarSolicitudes();
      try {
        apiEvents.Echo.channel("SolicitudEnviada").listen(
          "SolicitudEnviada",
          (e) => {
            admiStore.solicitudes.push(e.solicitud);
            admiStore.globalNotis++;
            $q.notify({
              message: `nueva solicitud con ID: ${e.solicitud.id} recibida.`,
              icon: "announcement",
              position: "top-right",
              color: "teal",
            });
          }
        );
        apiEvents.Echo.channel("EstadoActualizado").listen(
          "EstadoActualizado",
          (e) => {
            const index = admiStore.solicitudes.findIndex(
              (s) => s.id == e.solicitud.id
            );
            admiStore.solicitudes[index] = e.solicitud;
            if (e.solicitud.idAdministrador != sesion.data.user.id) {
              $q.notify({
                color: "info",
                icon: "info",
                message: `Solicitud con ID: ${e.solicitud.id} con problema de ${e.solicitud.problema} ha actualizado su status`,
              });
            }
          }
        );
      } catch (error) {
        console.log(error);
        $q.notify({
          color: "negative",
          icon: "info",
          message: "No se ha podido conectar al servidor de websockets",
        });
      }
    });
    return {
      sesion,
      columns,
      admiStore,
      cambiarProceso,
      completarSolicitud,
    };
  },
};
</script>

<style lang="sass">
.my-card
  width: 100%
  max-width: 350px

.grid-masonry
  flex-direction: column
  height: 500px

  &--2
    > div
      &:nth-child(2n + 1)
        order: 1
      &:nth-child(2n)
        order: 2

    &:before
      content: ''
      flex: 1 0 100% !important
      width: 0 !important
      order: 1
  &--3
    > div
      &:nth-child(3n + 1)
        order: 1
      &:nth-child(3n + 2)
        order: 2
      &:nth-child(3n)
        order: 3

    &:before,
    &:after
      content: ''
      flex: 1 0 100% !important
      width: 0 !important
      order: 2
</style>
