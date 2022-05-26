<template>
  <q-drawer
    v-model="drawerModel"
    show-if-above
    bordered
    class="bg-grey-10 text-white"
  >
    <q-list>
      <q-item
        :to="{ name: 'supervisor dashboard' }"
        active-class="q-item-no-link-highlighting"
      >
        <q-item-section avatar>
          <q-icon name="dashboard" />
        </q-item-section>
        <q-item-section>
          <q-item-label>Dashboard</q-item-label>
        </q-item-section>
      </q-item>
      <q-item-label header class="text-weight-bolder text-white"
        >Estadisticas</q-item-label
      >
      <q-item
        :to="{ name: 'estadisticas solicitudes' }"
        active-class="q-item-no-link-highlighting"
      >
        <q-item-section avatar>
          <q-icon name="receipt" />
        </q-item-section>
        <q-item-section>
          <q-item-label>Solicitudes</q-item-label>
        </q-item-section>
      </q-item>

      <q-item
        :to="{ name: 'estadisticas administradores' }"
        active-class="q-item-no-link-highlighting"
      >
        <q-item-section avatar>
          <q-icon name="engineering" />
        </q-item-section>
        <q-item-section>
          <q-item-label>Administradores</q-item-label>
        </q-item-section>
      </q-item>
    </q-list>
  </q-drawer>
</template>

<script>
import { computed } from "@vue/runtime-core";
export default {
  name: "MenuSupervisor",
  emits: ["changeDrawer"],
  props: {
    drawer: {
      type: Boolean,
      default: false,
    },
  },
  setup(props, ctx) {
    const drawerModel = computed({
      get() {
        return props.drawer;
      },
      set(value) {
        ctx.emit("changeDrawer");
      },
    });
    return { drawerModel };
  },
};
</script>
