<template>
  <div id="chart">
    <apexchart
      type="polarArea"
      :options="chartOptions"
      :series="series"
    ></apexchart>
  </div>
</template>

<script>
export default {
  // name: 'ComponentName',
  setup() {
    return {
      series: [14, 23, 21, 17, 15, 10, 12, 17, 21],
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
