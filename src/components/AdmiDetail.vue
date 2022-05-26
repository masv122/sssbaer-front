<template>
  <q-card
    flat
    bordered
    :style="{ height: size['height'] - 24 + 'px !important' }"
  >
    <q-toolbar class="text-black">
      <q-btn round flat class="q-pa-sm">
        <q-avatar size="80px">
          <q-icon name="engineering" />
        </q-avatar>
      </q-btn>

      <q-item class="q-subtitle-1 q-pl-md">
        <q-item-section>
          <q-item-label lines="1">{{ admi ? admi.name : "" }}</q-item-label>
          <q-item-label caption lines="2">
            <span class="text-weight-bold">ID: {{ admi ? admi.id : "" }}</span>
          </q-item-label>
        </q-item-section>
      </q-item>

      <q-space />
    </q-toolbar>
    <q-separator></q-separator>

    <div v-for="(stat, statIndex) in admiStats.stats" :key="statIndex">
      <admi-detail-item
        :icon="stat.icon"
        :text_color="stat.text_color"
        :value="stat.field"
        :label="stat.label"
      />

      <q-separator
        inset="item"
        v-if="statIndex != admiStats.stats.length - 1"
      ></q-separator>
    </div>
  </q-card>
</template>

<script>
import { reactive, ref } from "@vue/reactivity";
import AdmiDetailItem from "./AdmiDetailItem.vue";
import { computed, watch } from "@vue/runtime-core";
import { useAdmiStore } from "src/stores/admiStore";
import { api } from "src/boot/axios";
import { useSesion } from "src/stores/sesion";
export default {
  components: { AdmiDetailItem },
  name: "AdmiDetail",
  props: { id: { type: Number, default: null } },
  setup(props) {
    const admiStore = useAdmiStore();
    const sesion = useSesion();
    const admi = computed(() =>
      props.id ? admiStore.getUserById(props.id) : { name: "", id: "" }
    );
    watch(admi, async (newVal) => {
      try {
        const response = await api.post(
          "/solicitudes-admi",
          { id: newVal.id },
          sesion.authorizacion
        );
        const solicitudes = response.data.solicitudes;
        const mes = new Date(Date.now()).toLocaleString("default", {
          month: "short",
          year: "2-digit",
        });
        const solicitudesDeEsteMes = solicitudes.filter(
          (s) =>
            new Date(s.created_at).toLocaleString("default", {
              month: "short",
              year: "2-digit",
            }) === mes
        );
        let totales = { aceptadasTotales: [], completadasTotales: [] };
        let totalesDeEsteMes = { aceptadasTotales: [], completadasTotales: [] };

        solicitudes.forEach((s) => {
          if (Boolean(s.enProceso) && !Boolean(s.terminado)) {
            totales.aceptadasTotales.push(s);
          }
          if (!Boolean(s.enProceso) && Boolean(s.terminado))
            totales.completadasTotales.push(s);
        });
        solicitudesDeEsteMes.forEach((s) => {
          if (Boolean(s.enProceso) && !Boolean(s.terminado)) {
            totalesDeEsteMes.aceptadasTotales.push(s);
          }
          if (!Boolean(s.enProceso) && Boolean(s.terminado))
            totalesDeEsteMes.completadasTotales.push(s);
        });
        admiStats.stats = [
          {
            icon: "stacked_bar_chart",
            label: "",
            field: "Historico",
            text_color: "black",
          },
          {
            icon: "hourglass_empty",
            label: "Solicitudes aceptadas",
            field: totales.aceptadasTotales.length,
            text_color: "blue",
          },
          {
            icon: "done",
            label: "Solicitudes completadas",
            field: totales.completadasTotales.length,
            text_color: "positive",
          },
          {
            icon: "event",
            label: "",
            field: "Ultimo mes",
            text_color: "black",
          },
          {
            icon: "hourglass_empty",
            label: "Solicitudes aceptadas",
            field: totalesDeEsteMes.aceptadasTotales.length,
            text_color: "blue",
          },
          {
            icon: "done",
            label: "Solicitudes completadas",
            field: totalesDeEsteMes.completadasTotales.length,
            text_color: "positive",
          },
        ];
      } catch (error) {
        console.log(error);
      }
    });
    const admiStats = reactive({
      stats: [
        {
          icon: "stacked_bar_chart",
          label: "",
          field: "Historico",
          text_color: "black",
        },
        {
          icon: "hourglass_empty",
          label: "Solicitudes aceptadas",
          field: "0",
          text_color: "blue",
        },
        {
          icon: "done",
          label: "Solicitudes completadas",
          field: "0",
          text_color: "positive",
        },
        {
          icon: "event",
          label: "",
          field: "Ultimo mes",
          text_color: "black",
        },
        {
          icon: "hourglass_empty",
          label: "Solicitudes aceptadas",
          field: "0",
          text_color: "blue",
        },
        {
          icon: "done",
          label: "Solicitudes completadas",
          field: "0",
          text_color: "positive",
        },
      ],
    });
    return {
      admi,
      size: ref({ width: "200px", height: "200px" }),
      selectedAdmi: reactive({}),
      admiStats,
    };
  },
};
</script>
