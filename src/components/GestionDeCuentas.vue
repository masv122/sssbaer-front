<template>
  <q-tabs>
    <q-route-tab
      label="Crear Usuario"
      icon="person_add"
      :to="{ name: 'crear usuario' }"
      exact
    />
    <!--     <q-route-tab
      label="Gestionar Usuario"
      icon="manage_accounts"
      :to="{ name: 'gestion de usuarios' }"
      exact
    /> -->
  </q-tabs>
  <div class="flex flex-center">
    <router-view />
  </div>
</template>

<script>
export default {
  // name: 'ComponentName',
  setup() {
    return {};
  },
};
</script>
