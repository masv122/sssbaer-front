<template>
  <q-header elevated class="bg-white text-grey-8" height-hint="64">
    <img src="~assets/banner_oficial.png" class="banner" />

    <q-toolbar class="GPL__toolbar" style="height: 64px">
      <q-btn
        flat
        dense
        round
        @click="$emit('changeDrawer')"
        aria-label="Menu"
        icon="menu"
        class="q-mx-md"
      />
      <q-icon name="flight_takeoff" size="3em" />

      <q-toolbar-title
        v-if="$q.screen.gt.sm"
        shrink
        class="row items-center no-wrap"
      >
        <span class="q-ml-sm">Sistema de solicitud de ayuda del BAER</span>
      </q-toolbar-title>

      <q-space />

      <div class="q-gutter-sm row items-center no-wrap">
        <q-btn round dense flat color="grey-8" icon="person">
          <q-tooltip>{{ nombre }}</q-tooltip>
        </q-btn>
        <q-btn
          round
          dense
          @click="admiStore.globalNotis = 0"
          flat
          color="grey-8"
          icon="notifications"
        >
          <q-badge
            v-show="admiStore.globalNotis > 0"
            color="red"
            text-color="white"
            floating
          >
            {{ admiStore.globalNotis }}
          </q-badge>
          <q-tooltip>{{
            admiStore.globalNotis > 0
              ? "Borrar notificaciones"
              : "Notificaciones"
          }}</q-tooltip>
        </q-btn>
        <q-btn round dense flat color="grey-8" @click="cerrarSesion()">
          <q-icon name="logout" />
          <q-tooltip>Salir</q-tooltip>
        </q-btn>
      </div>
    </q-toolbar>
  </q-header>
</template>

<script>
import { ref } from "@vue/reactivity";
import { useRouter } from "vue-router";
import { useQuasar } from "quasar";
import { useSesion } from "src/stores/sesion";
import { useAdmiStore } from "src/stores/admiStore";
export default {
  name: "HeaderAdmi",
  props: {
    nombre: {
      type: String,
      default: "",
    },
  },
  setup() {
    const sesion = useSesion();
    const $q = useQuasar();
    const router = useRouter();
    const admiStore = useAdmiStore();
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
        $q.notify({
          color: "negative",
          message:
            "Error al cerrar la sesion, consulte la consola para mas informacion",
        });
      }
    };
    return {
      cerrarSesion,
      admiStore,
    };
  },
};
</script>
