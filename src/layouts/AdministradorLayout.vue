<template>
  <q-layout view="lHh Lpr fff" class="bg-grey-1">
    <header-admi
      @changeDrawer="drawer = !drawer"
      :nombre="sesion.data.user.name"
    />
    <menu-admi :drawer="drawer" @changeDrawer="drawer = !drawer" />
    <q-page-container class="GPL__page-container">
      <router-view />
      <menu-sticky-admi />
    </q-page-container>
  </q-layout>
</template>

<script>
import { computed, onBeforeMount, onMounted, ref } from "vue";
import { useSesion } from "stores/sesion";
import { useRouter } from "vue-router";
import HeaderAdmi from "src/components/HeaderAdmi.vue";
import MenuAdmi from "src/components/MenuAdmi.vue";
import MenuStickyAdmi from "src/components/MenuStickyAdmi.vue";
export default {
  components: { MenuStickyAdmi, HeaderAdmi, MenuAdmi },
  name: "AdministradorLayout",
  setup() {
    const drawer = ref(false);
    const notificacionSolicitudesAdmi = ref(0);
    const search = ref("");
    const sesion = useSesion();
    const router = useRouter();
    function toggleLeftDrawer() {
      drawer.value = !drawer.value;
    }

    return {
      drawer,
      search,
      sesion,
      notificacionSolicitudesAdmi,
      toggleLeftDrawer,
    };
  },
};
</script>

<style lang="sass">
.GPL
  &__toolbar
    height: 64px
  &__toolbar-input
    width: 35%
  &__drawer-item
    line-height: 24px
    border-radius: 0 24px 24px 0
    margin-right: 12px
    .q-item__section--avatar
      padding-left: 12px
      .q-icon
        color: #5f6368
    .q-item__label:not(.q-item__label--caption)
      color: #3c4043
      letter-spacing: .01785714em
      font-size: .875rem
      font-weight: 500
      line-height: 1.25rem
    &--storage
      border-radius: 0
      margin-right: 0
      padding-top: 24px
      padding-bottom: 24px
  &__side-btn
    &__label
      font-size: 12px
      line-height: 24px
      letter-spacing: .01785714em
      font-weight: 500
  @media (min-width: 1024px)
    &__page-container
      padding-left: 125px
</style>
