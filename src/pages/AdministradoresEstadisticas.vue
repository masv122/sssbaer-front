<template>
  <q-page class="q-pa-sm bg-white">
    <asistencias-completadas-efectivamente />

    <div class="row">
      <admis-list
        @updateSelectedAdmi="(e) => (id = e)"
        class="col-lg-4 col-md-4 col-sm-12 col-xs-12"
      />
      <admi-detail :id="id" class="col-lg-8 col-md-8 col-sm-12 col-xs-12" />
    </div>
  </q-page>
</template>

<script>
import AsistenciasCompletadasEfectivamente from "components/charts/AsistenciasCompletadasEfectivamente.vue";
import AdmisList from "components/AdmisList.vue";
import AdmiDetail from "components/AdmiDetail.vue";
import { ref } from "@vue/reactivity";
import { watch } from "@vue/runtime-core";

export default {
  name: "AdministradoresSumario",
  components: {
    AsistenciasCompletadasEfectivamente,
    AdmisList,
    AdmiDetail,
  },
  setup() {
    const id = ref(null);
    const admiSelected = ref(null);
    return {
      id,
      admiSelected,
    };
  },
};
</script>

<style scoped></style>
