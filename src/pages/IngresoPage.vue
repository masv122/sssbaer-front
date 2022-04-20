<template>
  <q-page padding>
    <q-btn
      color="white"
      text-color="black"
      :label="registro ? 'Ingresa' : 'registrate'"
      class="full-width q-mb-md"
      @click="registro = !registro"
    />
    <LoginComp v-if="!registro" />
    <CrearUsuario v-else />
  </q-page>
</template>

<script>
import LoginComp from "components/LoginComp.vue";
import CrearUsuario from "components/CrearUsuario.vue";
import { ref } from "@vue/reactivity";

export default {
  name: "IngresoLayout",
  components: {
    LoginComp,
    CrearUsuario,
  },
  setup() {
    return {
      registro: ref(false),
    };
  },
};
</script>

<style lang="scss" scoped></style>
