<template>
  <q-header elevated class="bg-cyan-8">
    <q-toolbar class="bg-negative">
      <q-icon name="flight_takeoff" size="3em" />
      <q-toolbar-title>{{
        $q.screen.width > 500
          ? "Sistema de solicitud de servicios del BAER"
          : "SSSB"
      }}</q-toolbar-title>
      <q-btn
        v-show="$q.screen.width < 500"
        @click="drawer = !drawer"
        flat
        round
        dense
        icon="menu"
      />
      <q-btn flat @click="cerrarSesion()" round dense icon="logout" />
    </q-toolbar>
  </q-header>
</template>

<script>
import { getAuth, signOut } from "@firebase/auth";
import { useRouter } from "vue-router";
export default {
  name: "HeaderUsuario",

  setup() {
    const router = useRouter();
    const cerrarSesion = async () => {
      try {
        const auth = getAuth();
        await signOut(auth);
        router.push({ name: "ingreso" });
      } catch (error) {
        console.log(error);
      }
    };
    return {
      cerrarSesion,
    };
  },
};
</script>
