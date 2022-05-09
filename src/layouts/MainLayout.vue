<template>
  <img src="~assets/banner_oficial.png" class="banner" />

  <q-layout view="hHh Lpr fFf">
    <!-- Be sure to play with the Layout demo on docs -->
    <q-page-container>
      <!-- This is where pages get injected -->
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import { ref } from "vue";

export default {
  // name: 'LayoutName',

  setup() {},
};
</script>

<style lang="scss">
.banner {
  height: 50px !important;
  width: 100% !important;
}
</style>
