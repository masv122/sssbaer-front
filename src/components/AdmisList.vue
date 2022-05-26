<template>
  <q-card flat bordered>
    <q-tab-panels v-model="tab" animated class="bg-white">
      <q-tab-panel
        name="todos"
        class="q-pa-none full-height"
        :style="{ height: size['height'] - 80 + 'px !important' }"
      >
        <q-list class="">
          <q-item-label class="text-center q-pa-sm">
            <q-input dense rounded outlined v-model="search">
              <template v-slot:append>
                <q-icon name="search" />
              </template>
            </q-input>
          </q-item-label>
          <q-item-label header class="text-center"
            >{{ administradores.length }} ADMINISTRADORES</q-item-label
          >

          <span
            v-for="admi in administradores"
            :key="admi.id"
            @click="$emit('updateSelectedAdmi', admi.id)"
          >
            <admi-item :name="admi.name" :id="admi.id" />
          </span>
        </q-list>
      </q-tab-panel>

      <q-tab-panel
        name="tops"
        class="q-pa-none"
        :style="{ height: size['height'] - 80 + 'px !important' }"
      >
        <q-list class="">
          <q-item-label class="text-center q-pa-sm">
            <q-input dense rounded outlined v-model="search">
              <template v-slot:append>
                <q-icon name="search" />
              </template>
            </q-input>
          </q-item-label>
          <q-item-label header class="text-center"
            >TOP TRABAJADORES</q-item-label
          >

          <span
            v-for="(admi, index) in topAdmis"
            :key="admi.id"
            @click="$emit('updateSelectedAdmi', admi.id)"
          >
            <admi-item :name="admi.name" :id="admi.id" :top="index" />
          </span>
        </q-list>
      </q-tab-panel>
    </q-tab-panels>

    <q-tabs v-model="tab" dense class="bg-grey-3" align="justify">
      <q-tab name="todos" icon="person" label="Todos"></q-tab>
      <q-tab name="tops" icon="star" label="Tops"></q-tab>
    </q-tabs>
  </q-card>
</template>

<script>
import { reactive, ref } from "@vue/reactivity";
import AdmiItem from "components/AdmiItem.vue";
import { useAdmiStore } from "src/stores/admiStore";
import { useQuasar } from "quasar";
import { onMounted } from "@vue/runtime-core";
import { api } from "src/boot/axios";
import { useSesion } from "src/stores/sesion";
export default {
  components: { AdmiItem },
  name: "AdmisList",
  emits: ["updateSelectedAdmi"],
  setup(props, ctx) {
    const admiStore = useAdmiStore();
    const $q = useQuasar();
    const topAdmis = reactive([]);
    const sesion = useSesion();
    const administradores = admiStore.usuariosAdministradores;
    onMounted(async () => {
      if (!$q.screen.lt.sm && Boolean(administradores.length)) {
        ctx.emit("updateSelectedAdmi", administradores[0].id);
      }
      try {
        const response = await api.get("top-admis", sesion.authorizacion);
        const tops = response.data.users;
        topAdmis.length = 0;
        tops.forEach((u) => {
          topAdmis.push(u);
        });
      } catch (error) {
        console.log(error);
      }
    });
    return {
      administradores,
      tab: ref("todos"),
      search: ref(""),
      size: ref({ width: "200px", height: "200px" }),
      selectedAdmi: ref({}),
      topAdmis,
    };
  },
};
</script>
