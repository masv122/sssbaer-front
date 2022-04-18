<template>
  <q-page>
    <router-view />
  </q-page>
</template>

<script>
import { defineComponent } from "vue";
import FormularioSolicitud from "components/FormularioSolicitud.vue";
import SolicitudesUsuario from "components/SolicitudesUsuario.vue";

export default defineComponent({
  name: "IndexPage",
  data() {
    return {};
  },
  components: {
    /*     FormularioSolicitud,
    SolicitudesUsuario, */
  },
});
</script>
