<template>
  <q-card-actions>
    <div class="q-ml-xs">
      Solicitud atendida por:
      {{ administrador.data ? " " + administrador.data.name : "" }}
    </div>
  </q-card-actions>
</template>

<script>
import { onMounted, reactive, watch } from "@vue/runtime-core";
import { useAdmiStore } from "src/stores/admiStore";
export default {
  name: "AdministradorComp",
  props: {
    id: [Number, String],
  },
  setup(props) {
    const administrador = reactive({ data: null });
    const admiStore = useAdmiStore();
    onMounted(async () => {
      if (props.id) {
        const response = await admiStore.getAdmi(props.id);
        administrador.data = response.data[0];
      }
    });
    watch(
      () => props.id,
      async () => {
        if (props.id) {
          const response = await admiStore.getAdmi(props.id);
          administrador.data = response.data[0];
        } else administrador.data = null;
      }
    );
    return {
      administrador,
    };
  },
};
</script>
