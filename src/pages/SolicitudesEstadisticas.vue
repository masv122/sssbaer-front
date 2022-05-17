<template>
  <q-page class="q-pa-sm">
    <div class="row">
      <solicitudes-recientes class="col-md-6 col-12" />
      <totalizacion-de-solicitudes class="col-md-6 col-12" />
    </div>
  </q-page>
</template>

<script>
import SolicitudesRecientes from "components/charts/SolicitudesRecientes.vue";
import TotalizacionDeSolicitudes from "src/components/charts/TotalizacionDeSolicitudes.vue";

export default {
  name: "SolicitudesEstadisticas",
  components: { SolicitudesRecientes, TotalizacionDeSolicitudes },
  setup() {
    return {};
  },
};
</script>

<style scoped></style>
