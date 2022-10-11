<template>
  <q-layout view="hHh Lpr fFf" class="bg-grey-2">
    <q-page-container>
      <ingreso-page />
    </q-page-container>
  </q-layout>
</template>

<script>
import IngresoPage from "src/pages/IngresoPage.vue";
export default {
  name: "IngresoLayout",
  components: { IngresoPage },
};
</script>
<style scoped></style>
