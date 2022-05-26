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
import Messages from "components/MessagesComp.vue";

import { onMounted, ref } from "vue";
import { useAdmiStore } from "src/stores/admiStore";
import HeaderSupervisor from "src/components/HeaderSupervisor.vue";
import MenuSupervisor from "src/components/MenuSupervisor.vue";

export default {
  name: "MainLayout",
  components: {
    HeaderSupervisor,
    MenuSupervisor,
  },
  setup() {
    const drawer = ref(false);
    const admiStore = useAdmiStore();
    const iniciarTodaLaData = async () => {
      await admiStore.cargarUsuarios();
      await admiStore.cargarTodasLasSolicitudes();
      await admiStore.cargarSolicitudesEnProcesoOCompletadas();
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
