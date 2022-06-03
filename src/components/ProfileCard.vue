<template>
  <q-dialog v-model="profileCardModel">
    <q-card class="my-card">
      <q-img src="https://pbs.twimg.com/media/B33SGbYIMAAhrVR.png" />

      <q-card-section>
        <q-btn
          fab
          color="negative"
          icon="engineering"
          class="absolute"
          style="top: 0; right: 12px; transform: translateY(-50%)"
        />

        <div class="row no-wrap items-center">
          <div class="col text-h6 ellipsis">{{ sesion.data.user.name }}</div>
          <div
            class="col-auto text-grey text-caption q-pt-md row no-wrap items-center"
          >
            Administrador
          </div>
        </div>
      </q-card-section>

      <q-card-section class="q-pt-none">
        <div v-for="(estadistica, index) in estadisticas" :key="index">
          <q-item>
            <q-item-section top avatar>
              <q-avatar
                :color="estadistica.color"
                text-color="white"
                :icon="estadistica.icon"
              />
            </q-item-section>
            <q-item-section>
              <q-item-label
                :class="`text-h6 text-${estadistica.color} text-bold`"
                >{{ estadistica.valor }}</q-item-label
              >
              <q-item-label caption>{{ estadistica.texto }}</q-item-label>
            </q-item-section>
          </q-item>
        </div>
      </q-card-section>

      <q-separator />

      <!--       <q-card-actions align="right">
        <q-btn v-close-popup flat color="primary" label="Reserve" />
        <q-btn v-close-popup flat color="primary" round icon="event" />
      </q-card-actions> -->
    </q-card>
  </q-dialog>
</template>

<script>
import { computed, onMounted, ref } from "vue";
import { useSesion } from "src/stores/sesion";
import { useAdmiStore } from "src/stores/admiStore";
import { api } from "src/boot/axios";
import { useQuasar } from "quasar";

export default {
  name: "ProfileCard",
  emits: ["changeOpenProfileCard"],
  props: {
    profileCard: {
      type: Boolean,
      default: false,
    },
  },
  setup(props, ctx) {
    const sesion = useSesion();
    const admiStore = useAdmiStore();
    const $q = useQuasar();
    onMounted(async () => {
      try {
        await admiStore.cargarMisSolicitudes();
      } catch (error) {
        console.log(error);
        $q.notify({
          color: "negative",
          message:
            "Error al cargar las solicitudes, consulte la consola para mas informacion",
        });
      }
    });
    const profileCardModel = computed({
      get() {
        return props.profileCard;
      },
      set(val) {
        ctx.emit("changeOpenProfileCard", val);
      },
    });
    return {
      estadisticas: computed(() => [
        {
          color: "primary",
          icon: "hourglass_empty",
          valor: admiStore.misSolicitudes.filter((solicitud) =>
            Boolean(solicitud.enProceso)
          ).length,
          texto: "En Proceso",
        },
        {
          color: "positive",
          icon: "check",
          valor: admiStore.misSolicitudes.filter((solicitud) =>
            Boolean(solicitud.terminado)
          ).length,
          texto: "Completadas",
        },
        {
          color: "positive",
          icon: "verified",
          valor: admiStore.misSolicitudes.filter((solicitud) =>
            Boolean(solicitud.terminada)
          ).length,
          texto: "Confirmadas",
        },
      ]),
      openProfileCard: ref(false),
      sesion,
      lorem:
        "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Natus, ratione eum minus fuga, quasi dicta facilis corporis magnam, suscipit at quo nostrum!",

      stars: ref(3),

      slideVol: ref(39),
      slideAlarm: ref(56),
      slideVibration: ref(63),
      profileCardModel,
    };
  },
};
</script>
