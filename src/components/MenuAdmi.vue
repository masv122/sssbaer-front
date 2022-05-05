<template>
  <q-drawer v-model="drawerModel" bordered behavior="mobile">
    <q-scroll-area class="fit">
      <q-toolbar class="GPL__toolbar">
        <q-toolbar-title class="row items-center text-grey-8">
          <span class="q-ml-sm">Menu</span>
        </q-toolbar-title>
      </q-toolbar>
      <q-list padding>
        <q-separator class="q-my-md" />

        <q-item
          clickable
          class="GPL__drawer-item"
          :to="{ name: 'solicitudes admi' }"
        >
          <q-item-section avatar>
            <q-icon name="view_list" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Solicitudes</q-item-label>
          </q-item-section>
        </q-item>

        <q-separator class="q-my-md" />

        <q-item
          clickable
          class="GPL__drawer-item"
          :to="{ name: 'solicitudes realizadas admi' }"
        >
          <q-item-section avatar>
            <q-icon name="checklist" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Atendidas por mi</q-item-label>
          </q-item-section>
        </q-item>

        <q-separator class="q-my-md" />

        <q-item
          clickable
          class="GPL__drawer-item"
          :to="{ name: 'gestion de cuentas' }"
        >
          <q-item-section avatar>
            <q-icon name="manage_accounts" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Gestion de cuentas</q-item-label>
          </q-item-section>
        </q-item>
        <q-separator class="q-my-md" />

        <q-item disable class="GPL__drawer-item">
          <q-item-section>{{ user.name }}</q-item-section>
          <q-item-section avatar>
            <q-icon color="primary" name="person" />
          </q-item-section>
        </q-item>
        <q-item disable class="GPL__drawer-item">
          <q-item-label>Correo: {{ user.email }}</q-item-label>
        </q-item>
        <q-item disable class="GPL__drawer-item">
          <q-item-label>ID: {{ user.id }}</q-item-label>
        </q-item>
      </q-list>
    </q-scroll-area>
  </q-drawer>
</template>

<script>
import { useSesion } from "src/stores/sesion";
import { computed } from "@vue/runtime-core";
export default {
  name: "MenuAdmi",
  emits: ["changeDrawer"],
  props: {
    drawer: {
      type: Boolean,
      default: false,
    },
  },
  setup(props, ctx) {
    const sesion = useSesion();
    const user = computed(() => (sesion.data.user ? sesion.data.user : ""));
    const drawerModel = computed({
      get() {
        return props.drawer;
      },
      set(value) {
        ctx.emit("changeDrawer");
      },
    });
    return {
      user,
      drawerModel,
    };
  },
};
</script>
