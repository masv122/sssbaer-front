<template>
  <q-header elevated class="bg-white" height-hint="64">
    <img src="~assets/banner_oficial.png" class="banner" />

    <q-toolbar class="bg-white text-negative" style="height: 64px">
      <q-btn
        flat
        dense
        round
        @click="$emit('changeDrawer')"
        aria-label="Menu"
        icon="menu"
        class="q-mx-md"
      />
      <q-icon name="flight_takeoff" size="3em" />

      <q-toolbar-title
        v-if="$q.screen.gt.sm"
        shrink
        class="row items-center no-wrap"
      >
        <span class="q-ml-sm">Asisteme BAER</span>
      </q-toolbar-title>

      <q-space />

      <div class="q-gutter-sm row items-center no-wrap">
        <q-btn
          round
          dense
          flat
          icon="person"
          @click="$emit('changeOpenProfileCard')"
        >
          <q-tooltip>{{ nombre }}</q-tooltip>
        </q-btn>
        <q-btn round dense flat icon="notifications" @click="readNotis">
          <q-badge
            color="red"
            text-color="white"
            floating
            v-show="admiStore.notisSinLeer > 0"
          >
            {{ admiStore.notisSinLeer }}
          </q-badge>
          <q-menu>
            <q-list style="min-width: 100px">
              <notis-comp />
              <q-card class="text-center no-shadow no-border">
                <q-btn
                  label="limpiar"
                  style="max-width: 120px !important"
                  flat
                  dense
                  class="text-indigo-8"
                  v-if="admiStore.globalNotis.length > 0"
                  @click="deleteNotis"
                />
                <q-banner v-else rounded class="bg-grey-3">
                  No hay notificaciones
                </q-banner>
              </q-card>
            </q-list>
          </q-menu>
        </q-btn>
        <q-btn round dense flat @click="cerrarSesion()">
          <q-icon name="logout" />
          <q-tooltip>Salir</q-tooltip>
        </q-btn>
      </div>
    </q-toolbar>
  </q-header>
</template>

<script>
import { useRouter } from "vue-router";
import { useQuasar } from "quasar";
import { useSesion } from "src/stores/sesion";
import { useAdmiStore } from "src/stores/admiStore";
import NotisComp from "./NotisComp.vue";
import { onMounted } from "@vue/runtime-core";
import { apiEvents } from "src/boot/pusher";
import { api } from "src/boot/axios";
export default {
  components: { NotisComp },
  name: "HeaderAdmi",
  props: {
    nombre: {
      type: String,
      default: "",
    },
  },
  setup() {
    const sesion = useSesion();
    const $q = useQuasar();
    const router = useRouter();
    const admiStore = useAdmiStore();
    const cerrarSesion = async () => {
      try {
        const response = await sesion.logout();
        if (response) {
          router.push({ name: "ingreso" });
        } else {
          $q.notify({
            color: "negative",
            message:
              "Error al cerrar la sesion, consulte la consola para mas informacion",
          });
        }
      } catch (error) {
        console.log(error);
        $q.notify({
          color: "negative",
          message:
            "Error al cerrar la sesion, consulte la consola para mas informacion",
        });
      } finally {
        router.push({ name: "ingreso" });
      }
    };
    const addNoti = (noti) => {
      admiStore.globalNotis.unshift(noti);
    };
    const readNotis = async () => {
      try {
        const response = await api.get("read-notis", sesion.authorizacion);
        if (response.data.success) {
          admiStore.notisSinLeer = 0;
        } else {
          $q.notify({
            color: "negative",
            message:
              "Error al leer las notificaciones, consulte la consola para mas informacion",
          });
        }
      } catch (error) {
        console.log(error);
        $q.notify({
          color: "negative",
          message:
            "Error al leer las notificaciones, consulte la consola para mas informacion",
        });
      }
    };
    const deleteNotis = async () => {
      try {
        const response = await api.get("/delete-notis", sesion.authorizacion);
        if (response.data.success) {
          admiStore.globalNotis.length = 0;
        } else {
          $q.notify({
            color: "negative",
            message:
              "Error al eliminar las notificaciones, consulte la consola para mas informacion",
          });
        }
      } catch (error) {
        console.log(error);
        $q.notify({
          color: "negative",
          message:
            "Error al eliminar las notificaciones, consulte la consola para mas informacion",
        });
      }
    };
    onMounted(async () => {
      try {
        apiEvents.Echo.channel("SolicitudEnviada").listen(
          "SolicitudEnviada",
          (e) => {
            addNoti(e);
            console.log(e);
            e.solicitud.name = e.user.name;
            admiStore.solicitudes.push(e.solicitud);
            $q.notify({
              message: `${e.user.name} ha enviado una nueva solicitud.`,
              icon: "announcement",
              position: "top-right",
              color: "positive",
            });
          }
        );
        apiEvents.Echo.channel("EstadoActualizado").listen(
          "EstadoActualizado",
          (e) => {
            const index = admiStore.solicitudes.findIndex(
              (s) => s.id == e.solicitud.id
            );
            admiStore.solicitudes[index] = e.solicitud;
            if (e.solicitud.idAdministrador != sesion.data.user.id) {
              $q.notify({
                color: "info",
                icon: "info",
                position: "top-right",
                message: `${e.user.name} ha ${e.tipo} una solicitud.`,
              });
            }
          }
        );
        apiEvents.Echo.private(
          "App.Models.User." + sesion.data.user.id
        ).notification((notification) => {
          addNoti({ data: notification });
          admiStore.notisSinLeer++;
        });
        const response = await api.get("/notis", sesion.authorizacion);
        const notis = response.data;
        if (notis.length > 0) {
          notis.forEach((noti) => {
            if (!noti.read_at) admiStore.notisSinLeer++;
            addNoti(noti);
          });
        }
      } catch (error) {
        console.log(error);
        $q.notify({
          color: "negative",
          icon: "info",
          message:
            "No se ha podido conectar al servidor de websockets, consulte la consola para mas informacion",
        });
      }
    });
    return {
      cerrarSesion,
      admiStore,
      readNotis,
      deleteNotis,
    };
  },
};
</script>
