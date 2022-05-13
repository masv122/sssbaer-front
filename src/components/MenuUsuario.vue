<template>
  <q-drawer
    v-model="drawerModel"
    show-if-above
    :width="200"
    :breakpoint="650"
    bordered
  >
    <q-scroll-area class="fit">
      <q-toolbar class="GPL__toolbar">
        <q-toolbar-title class="row items-center text-grey-8">
          <span class="q-ml-sm">Asisteme BAER</span>
        </q-toolbar-title>
      </q-toolbar>
      <q-list padding>
        <q-item clickable v-ripple>
          <q-item-section avatar>
            <q-icon name="person" size="1.5em" />
          </q-item-section>
          <q-item-section>
            <q-item-label overline>nombre</q-item-label>
            <q-item-label>{{ usuario.name }}</q-item-label>
          </q-item-section>
        </q-item>
        <q-item clickable v-ripple>
          <q-item-section avatar>
            <q-icon name="email" size="1.5em" />
          </q-item-section>
          <q-item-section>
            <q-item-label overline>correo</q-item-label>
            <q-item-label>{{ usuario.email }}</q-item-label>
          </q-item-section>
        </q-item>
        <q-item
          clickable
          v-ripple
          :to="{ name: 'solicitudes usuario' }"
          active-class="text-negative"
        >
          <q-item-section avatar>
            <q-icon name="list" />
          </q-item-section>

          <q-item-section> Mis solicitudes </q-item-section>
        </q-item>
        <q-item
          clickable
          v-ripple
          :to="{ name: 'crear solicitud' }"
          active-class="text-negative"
        >
          <q-item-section avatar>
            <q-icon name="add" />
          </q-item-section>

          <q-item-section> Crear solicitud </q-item-section>
        </q-item>
      </q-list>
    </q-scroll-area>
  </q-drawer>
</template>

<script>
import { useSesion } from "stores/sesion";
import { computed, watch } from "@vue/runtime-core";
export default {
  name: "MenuUsuario",
  emits: ["changeDrawer"],
  props: {
    drawer: {
      type: Boolean,
      default: false,
    },
  },
  setup(props, ctx) {
    const sesion = useSesion();
    const usuario = sesion.data.user;
    const drawerModel = computed({
      get() {
        return props.drawer;
      },
      set(value) {
        ctx.emit("changeDrawer");
      },
    });
    watch(sesion, (newSesion) => {
      usuario.email = newSesion.data.user.email;
      usuario.name = newSesion.data.user.name;
    });
    return {
      usuario,
      drawerModel,
    };
  },
};
</script>
