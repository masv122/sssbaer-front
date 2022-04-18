<template>
  <q-layout view="lHh Lpr lff">
    <MenuUsuario />
    <HeaderUsuario />
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
import { onBeforeMount } from "@vue/runtime-core";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useRouter } from "vue-router";
import { useSesion } from "stores/sesion";
export default {
  components: {
    MenuUsuario,
    HeaderUsuario,
  },
  setup() {
    const auth = getAuth();
    const sesion = useSesion();
    const router = useRouter();
    const authListener = () => {
      onAuthStateChanged(auth, (user) => {
        if (user) {
          sesion.sesion = user;
          router.push({ name: "crear solicitud" });
        } else {
          router.push({ name: "ingreso" });
        }
      });
    };
    onBeforeMount(() => {
      authListener();
    });
    return {};
  },
};
</script>
