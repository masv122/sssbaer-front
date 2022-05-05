<template>
  <q-tabs>
    <q-route-tab
      label="Crear Usuario"
      icon="person_add"
      :to="{ name: 'crear usuario' }"
      exact
    />
    <q-route-tab
      label="Gestionar Usuario"
      icon="manage_accounts"
      :to="{ name: 'gestion de usuarios' }"
      exact
    />
  </q-tabs>
  <router-view />
</template>

<script>
export default {
  name: "GestionDeCuentas",
  setup() {
    return {};
  },
};
</script>
