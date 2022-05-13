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
        <apexchart
          type="bar"
          height="350"
          :options="chartOptions"
          :series="series"
        ></apexchart>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script>
import CardSocial from "src/components/cards/CardSocial.vue";
import { useAdmiStore } from "src/stores/admiStore";
import { computed, onMounted, reactive, watch } from "@vue/runtime-core";

export default {
  name: "DashboardSupervisor",
  components: {
    CardSocial,
  },
  setup() {
    const admiStore = useAdmiStore();
    const iniciarTodaLaData = async () => {
      await admiStore.cargarUsuarios();
      await admiStore.cargarTodasLasSolicitudes();
    };

    onMounted(() => {
      iniciarTodaLaData();
    });
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
      series: [
        {
          name: "Net Profit",
          data: [44, 55, 57, 56, 61, 58, 63, 60, 66],
        },
        {
          name: "Revenue",
          data: [76, 85, 101, 98, 87, 105, 91, 114, 94],
        },
        {
          name: "Free Cash Flow",
          data: [35, 41, 36, 26, 45, 48, 52, 53, 41],
        },
      ],
      chartOptions: {
        chart: {
          type: "bar",
          height: 350,
        },
        plotOptions: {
          bar: {
            horizontal: false,
            columnWidth: "55%",
            endingShape: "rounded",
          },
        },
        dataLabels: {
          enabled: false,
        },
        stroke: {
          show: true,
          width: 2,
          colors: ["transparent"],
        },
        xaxis: {
          categories: [
            "Feb",
            "Mar",
            "Apr",
            "May",
            "Jun",
            "Jul",
            "Aug",
            "Sep",
            "Oct",
          ],
        },
        yaxis: {
          title: {
            text: "$ (thousands)",
          },
        },
        fill: {
          opacity: 1,
        },
        tooltip: {
          y: {
            formatter: function (val) {
              return "$ " + val + " thousands";
            },
          },
        },
      },
    };
  },
};
</script>

<style scoped></style>
