<template>
  <div id="chart">
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
import { useAdmiStore } from "src/stores/admiStore";
import { onMounted, watch } from "@vue/runtime-core";
export default {
  name: "SolicitudesRecientes",
  setup() {
    const admiStore = useAdmiStore();
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
    const chartOptions = reactive({
      chart: {
        type: "bar",
        height: 350,
        stacked: true,
        toolbar: {
          show: true,
        },
        zoom: {
          enabled: true,
        },
      },
      responsive: [
        {
          breakpoint: 480,
          options: {
            legend: {
              position: "bottom",
              offsetX: -10,
              offsetY: 0,
            },
          },
        },
      ],
      plotOptions: {
        bar: {
          horizontal: false,
          borderRadius: 10,
        },
      },
      xaxis: {
        categories: [],
      },
      legend: {
        position: "right",
        offsetY: 40,
      },
      fill: {
        opacity: 1,
      },
    });
    watch(
      () => admiStore.solicitudes.length,
      () => {
        const solicitudesPorDia = filtradoPorDia(admiStore.solicitudes);
        console.log(solicitudesPorDia);
        solicitudesPorDia.forEach((s) => {
          series.forEach((se) => {
            if (se.name === "Sin atender")
              series[0].data.push(
                admiStore.solicitudesSinAtender.filter(
                  (ssa) =>
                    new Date(ssa.created_at).toLocaleString("default", {
                      day: "2-digit",
                      month: "short",
                    }) === s.day
                ).length
              );
            else if (se.name === "En Proceso")
              series[1].data.push(
                admiStore.solicitudesAtendidas.filter(
                  (ssa) =>
                    new Date(ssa.created_at).toLocaleString("default", {
                      day: "2-digit",
                      month: "short",
                    }) === s.day
                ).length
              );
            else
              series[2].data.push(
                admiStore.solicitudesCompletadas.filter(
                  (ssa) =>
                    new Date(ssa.created_at).toLocaleString("default", {
                      day: "2-digit",
                      month: "short",
                    }) === s.day
                ).length
              );
          });
          chartOptions.xaxis.categories.push(s.day);
        });
      }
    );
    const filtradoPorDia = (array) => {
      let arrayFiltrado = [];
      array.reduce((previus, actual) => {
        let day = new Date(actual.created_at).toLocaleString("default", {
          day: "2-digit",
          month: "short",
        });
        if (!previus[day]) {
          previus[day] = { day: day, solicitudes: [] };
          arrayFiltrado.push(previus[day]);
        }
        if (day === previus[day].day) previus[day].solicitudes.push(actual);

        return previus;
      }, {});

      return arrayFiltrado;
    };
    return {
      series,
      chartOptions,
    };
  },
};
</script>
