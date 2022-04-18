<template>
  <q-drawer v-model="drawer" show-if-above :width="300" :breakpoint="400">
    <q-scroll-area
      style="
        height: calc(100% - 150px);
        margin-top: 150px;
        border-right: 1px solid #ddd;
      "
    >
      <q-list padding>
        <q-item clickable v-ripple :to="{ name: 'crear solicitud' }">
          <q-item-section avatar>
            <q-icon name="add" />
          </q-item-section>

          <q-item-section> Crear solicitud </q-item-section>
        </q-item>

        <q-item clickable v-ripple :to="{ name: 'solicitudes usuario' }">
          <q-item-section avatar>
            <q-icon name="list" />
          </q-item-section>

          <q-item-section> Mis solicitudes </q-item-section>
        </q-item>
      </q-list>
    </q-scroll-area>

    <q-img
      class="absolute-top"
      src="https://pbs.twimg.com/media/B33SGbYIMAAhrVR.png"
      :ratio="16 / 9"
      style="height: 150px"
    >
      <div class="absolute-bottom bg-transparent text-black">
        <q-avatar size="56px" class="q-mb-sm">
          <q-icon name="person" size="1.5em"
        /></q-avatar>
        <div class="text-weight-bold text-h6">{{ sesion.displayName }}</div>
        <div>{{ sesion.email }}</div>
      </div>
    </q-img>
  </q-drawer>
</template>

<script>
import { useSesion } from "stores/sesion";
export default {
  name: "MenuUsuario",
  setup() {
    const sesion = useSesion().sesion;
    return {
      sesion,
    };
  },
};
</script>
