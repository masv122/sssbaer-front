<template>
  <div id="chart">
    <apexchart
      type="radar"
      height="350"
      :options="chartOptions"
      :series="series"
    ></apexchart>
  </div>
</template>

<script>
export default {
  name: "TotalizacionDeAsistencia",
  setup() {
    return {
      series: [
        {
          name: "Juan",
          data: [80, 50],
        },
        {
          name: "Pedro",
          data: [20, 30],
        },
        {
          name: "Luis",
          data: [44, 76],
        },
      ],
      chartOptions: {
        chart: {
          height: 350,
          type: "radar",
          dropShadow: {
            enabled: true,
            blur: 1,
            left: 1,
            top: 1,
          },
        },
        title: {
          text: "Radar Chart - Multi Series",
        },
        stroke: {
          width: 2,
        },
        fill: {
          opacity: 0.1,
        },
        markers: {
          size: 0,
        },
        xaxis: {
          categories: ["Sin completar", "Completadas"],
        },
      },
    };
  },
};
</script>
