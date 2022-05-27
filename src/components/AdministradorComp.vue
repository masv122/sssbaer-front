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
import { useQuasar } from "quasar";
export default {
  name: "AdministradorComp",
  props: {
    id: [Number, String],
  },
  setup(props) {
    const administrador = reactive({ data: null });
    const $q = useQuasar();
    const admiStore = useAdmiStore();
    onMounted(async () => {
      if (props.id) {
        try {
          const response = await admiStore.getAdmi(props.id);
          administrador.data = response.data[0];
        } catch (error) {
          console.log(error);
          $q.notify({
            color: "negative",
            message:
              "ha ocurrido un error al buscar el administrador, para mas informacion consulte la consola",
          });
        }
      }
    });
    watch(
      () => props.id,
      async () => {
        try {
          if (props.id) {
            const response = await admiStore.getAdmi(props.id);
            administrador.data = response.data[0];
          } else administrador.data = null;
        } catch (error) {
          console.log(error);
          $q.notify({
            color: "negative",
            message:
              "ha ocurrido un error al buscar el administrador, para mas informacion consulte la consola",
          });
        }
      }
    );
    return {
      administrador,
    };
  },
};
</script>
