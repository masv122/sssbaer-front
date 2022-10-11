<template>
  <img src="~assets/banner_oficial.png" class="banner" />
  <q-layout view="hHh Lpr fFf">
    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import { ref } from "vue";

export default {
  name: "MainLayout",

  setup() {},
};
</script>

<style lang="scss">
.banner {
  height: 50px !important;
  width: 100% !important;
}
</style>
