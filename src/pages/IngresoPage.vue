<template>
  <q-page
    padding
    class="fit column wrap justify-start items-center content-center bg-blue-grey-1"
  >
    <img
      src="https://pbs.twimg.com/media/B33SGbYIMAAhrVR.png"
      style="width: 200px; height: 100px"
      class="q-mb-lg"
    />
    <login-comp />
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
