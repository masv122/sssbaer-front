<template>
  <q-card-actions>
    <div class="q-ml-xs">
      Solicitud atendida por:
      {{ administrador.data ? " " + administrador.data.nombre : "" }}
    </div>
  </q-card-actions>
</template>

<script>
import { onMounted, reactive, watch } from "@vue/runtime-core";
import { child, get, getDatabase, ref as refdb } from "@firebase/database";
export default {
  name: "AdministradorComp",
  props: {
    id: String,
  },
  setup(props) {
    const administrador = reactive({ data: null });
    onMounted(async () => {
      if (props.id) {
        administrador.data = await buscarAdministrador(props.id);
      }
    });
    watch(
      () => props.id,
      async () => {
        if (props.id) administrador.data = await buscarAdministrador(props.id);
        else administrador.data = null;
      }
    );
    const buscarAdministrador = async (id) => {
      try {
        const resultado = await get(
          child(refdb(getDatabase()), `usuarios/admis/${id}`)
        );
        if (resultado.exists()) {
          return resultado.val();
        } else {
          return "error al buscar";
        }
      } catch (error) {
        console.log(error);
      }
    };
    return {
      administrador,
    };
  },
};
</script>
