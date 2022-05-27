<template>
  <q-header elevated class="bg-white">
    <img src="~assets/banner_oficial.png" class="banner" />

    <q-toolbar class="bg-white text-negative">
      <q-btn
        v-show="$q.screen.width < 1000"
        @click="$emit('changeDrawer')"
        flat
        round
        dense
        icon="menu"
      />
      <q-icon name="flight_takeoff" size="3em" />
      <q-space />
      <q-btn flat @click="cerrarSesion()" round dense icon="logout" />
    </q-toolbar>
  </q-header>
</template>

<script>
import { useSesion } from "src/stores/sesion";
import { useRouter } from "vue-router";
import { useQuasar } from "quasar";
export default {
  name: "HeaderUsuario",

  setup() {
    const $q = useQuasar();
    const router = useRouter();
    const sesion = useSesion();
    const cerrarSesion = async () => {
      try {
        const response = await sesion.logout();
        if (response) {
          router.push({ name: "ingreso" });
        } else {
          $q.notify({
            color: "negative",
            message:
              "Error al cerrar la sesion, consulte la consola para mas informacion",
          });
        }
      } catch (error) {
        console.log(error);
      } finally {
        router.push({ name: "ingreso" });
      }
    };
    return {
      cerrarSesion,
    };
  },
};
</script>
