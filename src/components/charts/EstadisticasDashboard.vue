<template>
  <div>
    <apexchart
      type="bar"
      height="350"
      :options="chartOptions"
      :series="series"
    ></apexchart>
  </div>
</template>

<script>
import { reactive } from "@vue/reactivity";
import { watch } from "@vue/runtime-core";
import { useAdmiStore } from "src/stores/admiStore";
export default {
  name: "EstadisticasDashboard",
  mounted() {
    this.$nextTick(() => {
      window.dispatchEvent(new Event("resize"));
    });
  },
  setup() {
    const admiStore = useAdmiStore();
    const chartOptions = reactive({
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
        categories: [],
      },
      yaxis: {
        title: {
          text: "Historico",
        },
      },
      fill: {
        opacity: 1,
      },
      tooltip: {
        y: {
          formatter: function (val) {
            return val + " solicitudes";
          },
        },
      },
    });
    const series = reactive([
      {
        name: "Sin atender",
        data: [],
      },
      {
        name: "En Proceso",
        data: [],
      },
      {
        name: "Completadas",
        data: [],
      },
    ]);
    watch(
      () => admiStore.solicitudes.length,
      () => {
        const solicitudesPorMeses = filtradoPorMes(admiStore.solicitudes);
        solicitudesPorMeses.forEach((s) => {
          series.forEach((se) => {
            if (se.name === "Sin atender")
              series[0].data.push(
                admiStore.solicitudesSinAtender.filter(
                  (ssa) =>
                    new Date(ssa.created_at).toLocaleString("default", {
                      month: "long",
                    }) === s.mes
                ).length
              );
            else if (se.name === "En Proceso")
              series[1].data.push(
                admiStore.solicitudesAtendidas.filter(
                  (ssa) =>
                    new Date(ssa.created_at).toLocaleString("default", {
                      month: "long",
                    }) === s.mes
                ).length
              );
            else
              series[2].data.push(
                admiStore.solicitudesCompletadas.filter(
                  (ssa) =>
                    new Date(ssa.created_at).toLocaleString("default", {
                      month: "long",
                    }) === s.mes
                ).length
              );
          });
          chartOptions.xaxis.categories.push(s.mes);
        });
      }
    );
    const filtradoPorMes = (array) => {
      let arrayFiltrado = [];
      array.reduce((previus, actual) => {
        // Creamos la posición del array para cada mes
        let mes = new Date(actual.created_at).toLocaleString("default", {
          month: "long",
        });
        if (!previus[mes]) {
          previus[mes] = { mes: mes, solicitudes: [] };
          arrayFiltrado.push(previus[mes]);
        }
        if (mes === previus[mes].mes) previus[mes].solicitudes.push(actual);

        return previus;
      }, {});
      return arrayFiltrado;
    };
    return {
      chartOptions,
      series,
    };
  },
};
</script>
