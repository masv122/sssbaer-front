<template>
  <q-layout view="hHh Lpr fFf" class="bg-negative">
    <q-header elevated class="bg-white text-negative">
      <IngresoHeader />
    </q-header>
    <div class="column justify-end">
      <div class="col self-center q-mt-lg">
        <q-page-container>
          <router-view />
        </q-page-container>
      </div>
    </div>
    <q-footer elevated class="bg-white text-black"> </q-footer>
  </q-layout>
</template>

<script>
import IngresoHeader from "components/IngresoHeader.vue";

export default {
  name: "IngresoLayout",
  components: {
    IngresoHeader,
  },
};
</script>
<style scoped></style>
