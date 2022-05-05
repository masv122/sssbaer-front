<template>
  <q-page-sticky v-if="$q.screen.gt.sm" expand position="left">
    <div class="fit q-pt-xl q-px-sm column">
      <q-btn
        round
        flat
        color="grey-8"
        stack
        no-caps
        size="26px"
        class="GPL__side-btn"
        :to="{ name: 'solicitudes admi' }"
      >
        <q-icon size="22px" name="view_list" />
        <div class="GPL__side-btn__label">Solicitudes</div>
      </q-btn>

      <q-btn
        round
        flat
        color="grey-8"
        stack
        no-caps
        size="26px"
        class="GPL__side-btn"
        :to="{ name: 'solicitudes realizadas admi' }"
      >
        <q-icon size="22px" name="checklist" />
        <div class="GPL__side-btn__label">Atendidas por mi</div>
        <q-badge
          floating
          color="red"
          text-color="white"
          style="top: 8px; right: 16px"
          @click="notificacionSolicitudesAdmi = 0"
        >
          {{ notificacionSolicitudesAdmi }}
        </q-badge>
      </q-btn>

      <q-btn
        round
        flat
        color="grey-8"
        stack
        no-caps
        size="26px"
        class="GPL__side-btn"
        :to="{ name: 'gestion de cuentas' }"
      >
        <q-icon size="22px" name="manage_accounts" />
        <div class="GPL__side-btn__label">Gestion de cuentas</div>
      </q-btn>
    </div> </q-page-sticky
  >>
</template>

<script>
export default {
  name: "MenuStickyAdmi",
  setup() {
    return {};
  },
};
</script>
