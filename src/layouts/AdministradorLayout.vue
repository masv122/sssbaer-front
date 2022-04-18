<template>
  <q-layout view="lHh Lpr fff" class="bg-grey-1">
    <q-header elevated class="bg-white text-grey-8" height-hint="64">
      <q-toolbar class="GPL__toolbar" style="height: 64px">
        <q-icon name="flight_takeoff" size="3em" />

        <q-toolbar-title
          v-if="$q.screen.gt.sm"
          shrink
          class="row items-center no-wrap"
        >
          <span class="q-ml-sm">Sistema de solicitud de ayuda del BAER</span>
        </q-toolbar-title>

        <q-space />

        <q-input
          class="GPL__toolbar-input"
          dense
          standout="bg-negative"
          v-model="search"
          placeholder="Busqueda"
        >
          <template v-slot:prepend>
            <q-icon v-if="search === ''" name="search" />
            <q-icon
              v-else
              name="clear"
              class="cursor-pointer"
              @click="search = ''"
            />
          </template>
        </q-input>

        <q-space />

        <div class="q-gutter-sm row items-center no-wrap">
          <q-btn round dense flat color="grey-8" icon="person">
            <q-tooltip>{{ nombreAdmi }}</q-tooltip>
          </q-btn>
          <q-btn
            round
            dense
            @click="notificacionSolicitudNueva = 0"
            flat
            color="grey-8"
            icon="notifications"
          >
            <q-badge
              v-show="notificacionSolicitudNueva > 0"
              color="red"
              text-color="white"
              floating
            >
              {{ notificacionSolicitudNueva }}
            </q-badge>
            <q-tooltip>{{
              notificacionSolicitudNueva > 0
                ? "Borrar notificaciones"
                : "Notificaciones"
            }}</q-tooltip>
          </q-btn>
          <q-btn round dense flat color="grey-8" @click="cerrarSesion()">
            <q-icon name="logout" />
            <q-tooltip>Salir</q-tooltip>
          </q-btn>
        </div>
      </q-toolbar>
    </q-header>
    <q-page-container class="GPL__page-container">
      <router-view />

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
        </div>
      </q-page-sticky>
    </q-page-container>
  </q-layout>
</template>

<script>
import { computed, onBeforeMount, onMounted, ref } from "vue";
import { useSesion } from "stores/sesion";
import { useRouter } from "vue-router";
import { getAuth, onAuthStateChanged, signOut } from "@firebase/auth";
import {
  getDatabase,
  ref as refdb,
  onValue,
  query,
  orderByChild,
  equalTo,
} from "firebase/database";
export default {
  name: "GooglePhotosLayout",
  setup() {
    const db = getDatabase();
    const redb = refdb(db, "solicitudes/");

    const leftDrawerOpen = ref(false);
    const notificacionSolicitudNueva = ref(-1);
    const notificacionSolicitudesAdmi = ref(0);
    const search = ref("");
    const auth = getAuth();
    const sesion = useSesion();
    const router = useRouter();
    function toggleLeftDrawer() {
      leftDrawerOpen.value = !leftDrawerOpen.value;
    }
    const nombreAdmi = computed(() =>
      sesion.sesion ? sesion.sesion.displayName : ""
    );
    const authListener = () => {
      onAuthStateChanged(auth, (user) => {
        if (user) {
          sesion.sesion = user;
          router.push({ name: "solicitudes admi" });
        } else {
          router.push({ name: "ingreso" });
        }
      });
    };
    const cerrarSesion = async () => {
      try {
        const auth = getAuth();
        await signOut(auth);
        router.push({ name: "ingreso" });
      } catch (error) {
        console.log(error);
      }
    };
    onBeforeMount(() => {
      authListener();
    });
    onMounted(() => {
      onValue(redb, () => {
        notificacionSolicitudNueva.value++;
      });
      const redb2 = query(
        redb,
        orderByChild("administrador"),
        equalTo(sesion.sesion.uid)
      );
      onValue(redb2, () => {
        notificacionSolicitudesAdmi.value++;
      });
    });
    return {
      nombreAdmi,
      leftDrawerOpen,
      cerrarSesion,
      search,
      notificacionSolicitudNueva,
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
