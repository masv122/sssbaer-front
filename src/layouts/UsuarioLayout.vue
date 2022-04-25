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
import { useRouter } from "vue-router";
import { useSesion } from "stores/sesion";
import { api } from "src/boot/axios";
export default {
  components: {
    MenuUsuario,
    HeaderUsuario,
  },
  setup() {
    const sesion = useSesion();
    const router = useRouter();
    onBeforeMount(async () => {
      try {
        const config = {
          headers: {
            Authorization: `Bearer ${sesion.data.token.access_token}`,
          },
        };
        const user = await api.get("/info-user", config);
        sesion.data.user = user.data;
      } catch (error) {
        console.log(error);
      }
    });
    return {};
  },
};
</script>
