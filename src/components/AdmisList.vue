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
            <contact-item :name="admi.name" :id="admi.id"></contact-item>
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
            v-for="(favorite, index) in favorites_list"
            :key="index"
            @click="selected_contact = favorite"
          >
            <contact-item
              :avatar="favorite.avatar"
              :name="favorite.name"
              :position="favorite.position"
            ></contact-item>
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
import { ref } from "@vue/reactivity";
import ContactItem from "./ContactItem.vue";
import { useAdmiStore } from "src/stores/admiStore";
import { useQuasar } from "quasar";
import { onMounted } from "@vue/runtime-core";
export default {
  components: { ContactItem },
  name: "AdmisList",
  emits: ["updateSelectedAdmi"],
  setup(props, ctx) {
    const admiStore = useAdmiStore();
    const $q = useQuasar();
    const administradores = admiStore.usuariosAdministradores;
    onMounted(() => {
      if (!$q.screen.lt.sm && Boolean(administradores.length)) {
        ctx.emit("updateSelectedAdmi", administradores[0].id);
      }
    });
    return {
      administradores,
      tab: ref("todos"),
      search: ref(""),
      size: ref({ width: "200px", height: "200px" }),
      selectedAdmi: ref({}),

      favorites_list: [
        {
          name: "Pratik Patel",
          position: "Developer",
          avatar: "https://avatars2.githubusercontent.com/u/34883558?s=400&v=4",
          email: "pratikpatelpp802@gmail.com",
          company_email: "pratikpatelpp802@gmail.com",
          website: "www.test.com",
          phone: "+9910101010",
          secondary_phone: "+9910101010",
          address: "BB 101 Om Sai Residency Palsana",
        },
        {
          name: "Razvan Stoenescu",
          position: "Developer",
          avatar: "https://cdn.quasar.dev/team/razvan_stoenescu.jpeg",
          email: "mailto:razvan@quasar.dev",
          company_email: "mailto:razvan@quasar.dev",
          website: "https://github.com/rstoenescu",
          phone: "+1-004-658-0042",
          secondary_phone: "(331) 009-4655 x3147",
          address: "92290 Lisa Cove",
        },
        {
          name: "Jeff Galbraith",
          position: "Developer",
          avatar: "https://cdn.quasar.dev/team/jeff_galbraith.jpg",
          email: "mailto:jeff@quasar.dev",
          company_email: "mailto:jeff@quasar.dev",
          website: "http://jeffgalbraith.dev/",
          phone: "175.718.4633 x878",
          secondary_phone: "175.718.4633 x878",
          address: "Calgary, Canada",
        },
      ],
    };
  },
};
</script>
