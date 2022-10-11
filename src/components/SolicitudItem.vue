<template>
  <div
    class="q-pa-xs col-xs-12 col-sm-6 col-md-4 col-lg-3 grid-style-transition"
  >
    <q-card>
      <q-card-section class="row justify-between">
        <q-breadcrumbs class="text-grey">
          <template v-slot:separator>
            <q-icon size="1.5em" name="chevron_right" color="primary" />
          </template>
          <q-breadcrumbs-el
            icon="hourglass_empty"
            :class="data.row.enProceso ? 'text-blue' : ''"
          />
          <q-breadcrumbs-el
            icon="check_circle"
            :class="data.row.terminado ? 'text-green' : ''"
          />
          <q-breadcrumbs-el icon="verified" />
        </q-breadcrumbs>
        <q-badge color="blue"> ID: {{ data.row.id }} </q-badge>
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
    </q-card>
  </div>
</template>

<script>
import { onMounted } from "@vue/runtime-core";
import { apiEvents } from "src/boot/pusher";
import AdministradorComp from "components/AdministradorComp.vue";
export default {
  components: { AdministradorComp },
  name: "SolicitudItem",
  props: {
    data: Object,
  },
  setup(props) {
    onMounted(() => {
      apiEvents.Echo.private(`solicitud.${props.data.row.id}`).listen(
        "SolicitudUsuarioActualizada",
        (e) => {
          console.log(e);
        }
      );
    });
    return {};
  },
};
</script>