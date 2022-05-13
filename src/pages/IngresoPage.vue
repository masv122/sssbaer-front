<template>
  <q-page padding class="row justify-around q-pt-xl">
    <login-comp />
    <img
      src="https://pbs.twimg.com/media/B33SGbYIMAAhrVR.png"
      style="width: 500px; height: 300px"
      v-if="$q.screen.gt.sm"
    />
  </q-page>
</template>

<script>
import LoginComp from "components/LoginComp.vue";

export default {
  name: "IngresoLayout",
  components: {
    LoginComp,
  },
  setup() {
    return {};
  },
};
</script>

<style lang="scss" scoped></style>
