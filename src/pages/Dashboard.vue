<template>
  <q-page class="q-pa-sm">
    <card-social icon_position="right" />

    <q-card class="q-mt-sm">
      <q-card-section class="text-h6 q-pb-none">
        <q-item>
          <q-item-section avatar class="">
            <q-icon color="blue" name="fas fa-chart-line" size="44px" />
          </q-item-section>

          <q-item-section>
            <div class="text-h6">Estadisticas de las solicitudes</div>
          </q-item-section>
        </q-item>
      </q-card-section>
      <q-card-section class="row">
        <div class="row">
          <div v-for="(estadistica, index) in estadisticas" :key="index">
            <q-item>
              <q-item-section top avatar>
                <q-avatar
                  :color="estadistica.color"
                  text-color="white"
                  :icon="estadistica.icon"
                />
              </q-item-section>
              <q-item-section>
                <q-item-label
                  :class="`text-h6 text-${estadistica.color} text-bold`"
                  >{{ estadistica.valor }}</q-item-label
                >
                <q-item-label caption>{{ estadistica.texto }}</q-item-label>
              </q-item-section>
            </q-item>
          </div>
        </div>
      </q-card-section>
      <q-card-section>
        <estadisticas-dashboard />
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script>
import CardSocial from "components/CardSocial.vue";
import { useAdmiStore } from "src/stores/admiStore";
import { computed } from "@vue/runtime-core";
import EstadisticasDashboard from "src/components/charts/EstadisticasDashboard.vue";

export default {
  name: "DashboardSupervisor",
  components: {
    CardSocial,
    EstadisticasDashboard,
  },
  setup() {
    const admiStore = useAdmiStore();
    return {
      admiStore,
      estadisticas: computed(() => [
        {
          color: "warning",
          icon: "report_problem",
          valor: admiStore.solicitudesSinAtender.length,
          texto: "Sin atender",
        },
        {
          color: "primary",
          icon: "hourglass_empty",
          valor: admiStore.solicitudesAtendidas.length,
          texto: "En Proceso",
        },
        {
          color: "positive",
          icon: "check",
          valor: admiStore.solicitudesCompletadas.length,
          texto: "Completadas",
        },
        {
          color: "negative",
          icon: "close",
          valor: "sin calcular",
          texto: "Canceladas",
        },
      ]),
    };
  },
};
</script>

<style scoped></style>
