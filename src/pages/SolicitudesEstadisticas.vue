<template>
  <q-page class="q-pa-sm">
    <solicitudes-recientes />
    <!-- <totalizacion-de-solicitudes /> -->
    <solicitudes-admi :supervisor="true" />
  </q-page>
</template>

<script>
import SolicitudesRecientes from "components/charts/SolicitudesRecientes.vue";
import TotalizacionDeSolicitudes from "src/components/charts/TotalizacionDeSolicitudes.vue";
import SolicitudesAdmi from "src/components/SolicitudesAdmi.vue";

export default {
  name: "SolicitudesEstadisticas",
  components: {
    SolicitudesRecientes,
    /* TotalizacionDeSolicitudes, */
    SolicitudesAdmi,
  },
  setup() {
    return {};
  },
};
</script>

<style scoped></style>
