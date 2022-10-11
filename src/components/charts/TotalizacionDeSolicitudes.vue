<template>
  <div id="chart">
    <apexchart
      type="polarArea"
      :options="chartOptions"
      :series="series"
    ></apexchart>
    {{ series }}
  </div>
</template>

<script>
import { computed } from "@vue/runtime-core";
import { useAdmiStore } from "src/stores/admiStore";
export default {
  name: "TotalizacionDeSolicitudes",
  mounted() {
    this.$nextTick(() => {
      window.dispatchEvent(new Event("resize"));
    });
  },
  setup() {
    const admiStore = useAdmiStore();
    const series = computed(() => [
      admiStore.solicitudesSinAtender.length,
      admiStore.solicitudesAtendidas.length,
      admiStore.solicitudesCompletadas.length,
    ]);
    return {
      series,
      chartOptions: {
        chart: {
          type: "polarArea",
        },
        stroke: {
          colors: ["#fff"],
        },
        fill: {
          opacity: 0.8,
        },
        tooltip: {
          y: {
            formatter: function (val) {
              return val + " solicitudes";
            },
          },
        },
        responsive: [
          {
            breakpoint: 480,
            options: {
              chart: {
                width: 200,
              },
              legend: {
                position: "bottom",
              },
            },
          },
        ],
      },
    };
  },
};
</script>
