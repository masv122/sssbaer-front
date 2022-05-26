<template>
  <q-header elevated class="bg-grey-10">
    <q-toolbar>
      <q-btn
        flat
        dense
        round
        @click="$emit('changeDrawer')"
        icon="menu"
        aria-label="Menu"
      />
      <q-toolbar-title> ¡Bienvenido Supervisor! </q-toolbar-title>
      <q-space />
      <div class="q-gutter-sm row items-center no-wrap">
        <q-btn round dense flat color="white" icon="notifications">
          <q-badge color="red" text-color="white" floating> 5 </q-badge>
          <q-menu>
            <q-list style="min-width: 100px">
              <messages></messages>
              <q-card class="text-center no-shadow no-border">
                <q-btn
                  label="View All"
                  style="max-width: 120px !important"
                  flat
                  dense
                  class="text-indigo-8"
                ></q-btn>
              </q-card>
            </q-list>
          </q-menu>
        </q-btn>
        <q-btn round flat>
          <q-avatar size="26px">
            <q-icon name="admin_panel_settings" />
          </q-avatar>
        </q-btn>
        <q-btn round dense flat @click="cerrarSesion()">
          <q-icon name="logout" />
          <q-tooltip>Salir</q-tooltip>
        </q-btn>
      </div>
    </q-toolbar>
  </q-header>
</template>

<script>
import Messages from "components/MessagesComp.vue";
import { useSesion } from "src/stores/sesion";
import { useRouter } from "vue-router";
export default {
  name: "HeaderSupervisor",
  components: {
    Messages,
  },

  setup() {
    const sesion = useSesion();
    const router = useRouter();
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
