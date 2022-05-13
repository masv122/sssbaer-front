<template>
  <q-page class="q-pa-sm">
    <div class="row">
      <historico-solicitudes class="col-md-6 col-12" />
      <totalizacion-de-solicitudes class="col-md-6 col-12" />
    </div>
  </q-page>
</template>

<script>
import HistoricoSolicitudes from "src/components/charts/HistoricoSolicitudes.vue";
import TotalizacionDeSolicitudes from "src/components/charts/TotalizacionDeSolicitudes.vue";

export default {
  name: "SolicitudesEstadisticas",
  components: { HistoricoSolicitudes, TotalizacionDeSolicitudes },
  setup() {
    return {};
  },
};
</script>

<style scoped></style>
