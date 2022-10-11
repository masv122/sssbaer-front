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
import { onMounted } from "@vue/runtime-core";
export default {
  name: "AsistenciasCompletadasEfectivamente",
  mounted() {
    this.$nextTick(() => {
      window.dispatchEvent(new Event("resize"));
    });
  },
  setup() {
    const admiStore = useAdmiStore();
    const series = reactive([]);
    const dias = reactive([]);
    onMounted(() => {
      let diasRaw = [];
      const admis = agrupadoPorAdministradores(
        admiStore.solicitudesCompletadasSupervisor
      );
      admis.forEach((a) => {
        series.push({
          name: a.id,
          data: [],
        });
        let solicitudes = a.solicitudes;
        a.solicitudes = filtradoPorDia(solicitudes);
        a.solicitudes.forEach((as) => diasRaw.push(as.day));
      });
      diasRaw
        .filter((item, index) => {
          return diasRaw.indexOf(item) === index;
        })
        .forEach((d) => dias.push(d));
      series.forEach((s) => {
        dias.forEach((d) => {
          s.data.push(
            admiStore.solicitudesCompletadasSupervisor.filter(
              (scs) =>
                new Date(scs.created_at).toLocaleString("default", {
                  day: "2-digit",
                  month: "short",
                }) === d && scs.idAdministrador == s.name
            ).length
          );
        });
        const nombre = admiStore.usuarios.filter((u) => s.name == u.id)[0].name;
        s.name = nombre;
      });
    });
    const agrupadoPorAdministradores = (array) => {
      let arrayFiltrado = [];
      array.reduce((previus, actual) => {
        let admi = actual.admiID;
        if (!previus[admi]) {
          previus[admi] = {
            id: actual.admiID,
            nombre: actual.admiName,
            solicitudes: [],
          };
          arrayFiltrado.push(previus[admi]);
        }
        if (admi === previus[admi].id) previus[admi].solicitudes.push(actual);

        return previus;
      }, {});
      return arrayFiltrado;
    };
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
      chartOptions: {
        chart: {
          type: "bar",
          height: 350,
          stacked: true,
          stackType: "100%",
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
        xaxis: {
          categories: dias,
        },
        fill: {
          opacity: 1,
        },
        legend: {
          position: "right",
          offsetX: 0,
          offsetY: 50,
        },
      },
    };
  },
};
</script>
