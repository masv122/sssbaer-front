<template>
  <q-layout view="lHh Lpr lff">
    <menu-usuario :drawer="drawer" @changeDrawer="drawer = !drawer" />
    <header-usuario @changeDrawer="drawer = !drawer" />
    <q-page-container>
      <q-page padding>
        <router-view />
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script>
import MenuUsuario from "components/MenuUsuario.vue";
import HeaderUsuario from "src/components/HeaderUsuario.vue";
import { onBeforeMount, ref } from "@vue/runtime-core";
import { useRouter } from "vue-router";
import { useSesion } from "stores/sesion";
export default {
  components: {
    MenuUsuario,
    HeaderUsuario,
  },
  setup() {
    const sesion = useSesion();
    const router = useRouter();
    const drawer = ref(false);
    onBeforeMount(async () => {
      try {
      } catch (error) {
        console.log(error);
      }
    });
    return {
      drawer,
    };
  },
};
</script>
