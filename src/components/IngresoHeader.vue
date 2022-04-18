<template>
  <div>
    <q-toolbar>
      <q-icon name="flight_takeoff" size="3em" />

      <q-toolbar-title
        v-if="$q.screen.gt.sm"
        shrink
        class="row items-center no-wrap"
      >
        <span class="q-ml-sm">Sistema de solicitud de ayuda del BAER</span>
      </q-toolbar-title>
    </q-toolbar>
  </div>
</template>

<script>
export default {
  name: "IngresoHeader",
};
</script>

<style lang="scss" scoped></style>
