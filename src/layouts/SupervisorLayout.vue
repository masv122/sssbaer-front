<template>
  <q-layout view="lHh Lpr lFf">
    <header-supervisor @changeDrawer="drawer = !drawer" />
    <menu-supervisor :drawer="drawer" @changeDrawer="drawer = !drawer" />
    <q-page-container class="bg-grey-2">
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import Messages from "src/components/NotisComp.vue";

import { onMounted, ref } from "vue";
import { useAdmiStore } from "src/stores/admiStore";
import HeaderSupervisor from "src/components/HeaderSupervisor.vue";
import MenuSupervisor from "src/components/MenuSupervisor.vue";
import { useQuasar } from "quasar";

export default {
  name: "MainLayout",
  components: {
    HeaderSupervisor,
    MenuSupervisor,
  },
  setup() {
    const drawer = ref(false);
    const admiStore = useAdmiStore();
    const $q = useQuasar();
    const iniciarTodaLaData = async () => {
      try {
        await admiStore.cargarUsuarios();
        await admiStore.cargarTodasLasSolicitudes();
        await admiStore.cargarSolicitudesEnProcesoOCompletadas();
      } catch (error) {
        console.log(error);
        $q.notify({
          color: "negative",
          icon: "info",
          message:
            "error al cargar los usuarios/solicitudes, para mas informacion consulte la consola",
        });
      }
    };

    onMounted(() => {
      iniciarTodaLaData();
    });
    return {
      drawer,
    };
  },
};
</script>
