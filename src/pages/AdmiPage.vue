<template>
  <q-page padding>
    <router-view />
    <!-- <SolicitudesAdmi /> -->
  </q-page>
</template>

<script>
import SolicitudesAdmi from "components/SolicitudesAdmi.vue";
export default {
  name: "AdmiPage",
  components: {
    // SolicitudesAdmi,
  },
};
</script>
