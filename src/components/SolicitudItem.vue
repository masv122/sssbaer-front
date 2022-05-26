<template>
  <div
    class="q-pa-xs col-xs-12 col-sm-6 col-md-4 col-lg-3 grid-style-transition"
  >
    <q-card>
      <q-card-section class="row justify-between">
        <q-breadcrumbs class="text-grey">
          <template v-slot:separator>
            <q-icon size="1.5em" name="chevron_right" color="negative" />
          </template>
          <q-breadcrumbs-el
            icon="hourglass_empty"
            :class="data.row.enProceso ? 'text-negative' : ''"
          />
          <q-breadcrumbs-el
            icon="check_circle"
            :class="
              data.row.terminado && !data.row.confirmada ? 'text-green' : ''
            "
          />
          <q-breadcrumbs-el
            icon="verified"
            :class="data.row.confirmada ? 'text-green' : ''"
          />
        </q-breadcrumbs>
        <q-btn
          color="green"
          label="Confrimar"
          v-show="data.row.terminado && !data.row.confirmada"
          checked-icon="check"
          @click="confirmarSolicitud(data.row)"
        />
        <q-badge color="negative"> ID: {{ data.row.id }} </q-badge>
      </q-card-section>
      <q-separator />
      <q-list dense>
        <q-item v-for="col in data.cols" :key="col.name">
          <q-item-section>
            <q-item-label>{{ col.label }}</q-item-label>
          </q-item-section>
          <q-item-section side>
            <q-item-label caption>{{ col.value }}</q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
      <q-separator />
      <administrador-comp
        :id="data.row.idAdministrador"
        v-show="data.row.enProceso || data.row.terminado"
      />
      <q-card-actions
        v-show="data.row.razonCancelado && !data.row.idAdministrador"
      >
        <div class="q-ml-xs">
          La solicitud ha sido cancelada, Razon:
          {{ data.row.razonCancelado }}
        </div>
      </q-card-actions>
    </q-card>
  </div>
</template>

<script>
import { onMounted } from "@vue/runtime-core";
import { apiEvents } from "src/boot/pusher";
import AdministradorComp from "components/AdministradorComp.vue";
import { useQuasar } from "quasar";
import { api } from "src/boot/axios";
import { useSesion } from "src/stores/sesion";
export default {
  components: { AdministradorComp },
  name: "SolicitudItem",
  props: {
    data: Object,
  },
  emits: ["updateSolicitud"],
  setup(props, ctx) {
    const $q = useQuasar();
    const sesion = useSesion();
    onMounted(() => {
      try {
        apiEvents.Echo.private(`solicitudes.${props.data.row.id}`).listen(
          "SolicitudUsuarioActualizada",
          (e) => {
            ctx.emit("updateSolicitud", e.solicitud);
            if (!e.solicitud.confirmada)
              $q.notify({
                color: "info",
                icon: "info",
                message: `Solicitud con ID: ${e.solicitud.id} con problema de ${e.solicitud.problema} ha actualizado su status`,
                position: "top-right",
              });
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
    const confirmarSolicitud = async (solicitud) => {
      try {
        solicitud.confirmada = true;
        const response = await api.put(
          `/solicitudes/${solicitud.id}`,
          solicitud,
          sesion.authorizacion
        );
        if (response.data.message === "Update successfully")
          $q.notify({
            type: "positive",
            message: `Solicitud con ID: ${response.data.solicitud.id} marcada como confirmada`,
          });
      } catch (error) {
        console.log(error);
        $q.notify({
          type: "negative",
          message:
            "Error al confirmar la solicitud, revise la consola para mas informacion",
        });
      }
    };
    return { confirmarSolicitud };
  },
};
</script>
