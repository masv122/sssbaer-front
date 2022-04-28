<template>
  <div class="q-pa-md">
    <q-table
      title="Mis solicitudes"
      :rows="admiStore.misSolicitudes"
      :columns="columns"
      row-key="id"
    >
      <template v-slot:top>
        <q-icon name="checklist" color="primary" size="3em" />

        <q-space />

        <q-btn
          class="glossy"
          round
          color="primary"
          icon="refresh"
          @click="admiStore.cargarSolicitudes()"
        />
      </template>
      <template v-slot:header="props">
        <q-tr :props="props">
          <q-th auto-width />

          <q-th v-for="col in props.cols" :key="col.name" :props="props">
            {{ col.label }}
          </q-th>
        </q-tr>
      </template>

      <template v-slot:body="props">
        <q-tr :props="props">
          <q-td auto-width>
            <q-btn
              round
              color="negative"
              icon="cancel"
              class="q-mr-md"
              v-show="
                (!!!props.row.enProceso && !!!props.row.terminado) ||
                (props.row.enProceso && !!!props.row.terminado)
              "
              @click="
                props.row.enProceso = !!!props.row.enProceso;
                admiStore.cambiarProceso(props.row);
              "
            />
            <q-btn
              round
              color="green"
              icon="check"
              v-show="!!props.row.enProceso || !!props.row.terminado"
              v-model="props.row.terminado"
              checked-icon="check"
              :disable="!!props.row.terminado"
              unchecked-icon="clear"
              @click="
                props.row.enProceso = !!!props.row.enProceso;
                props.row.terminado = !!!props.row.terminado;
                admiStore.cambiarProceso(props.row);
              "
            />
          </q-td>

          <q-td v-for="col in props.cols" :key="col.name" :props="props">
            {{ col.value }}
          </q-td>
        </q-tr>
      </template>
    </q-table>
  </div>
</template>
<script>
import { onMounted, ref, reactive } from "@vue/runtime-core";
import { useSesion } from "stores/sesion";
import { useAdmiStore } from "src/stores/admiStore";
const columns = [
  { name: "coordinacion", label: "Coordinacion", field: "coordinacion" },
  { name: "problema", label: "Tipo de problema", field: "problema" },
  {
    name: "comentarioAdicional",
    label: "Informacion adicional",
    field: "comentarioAdicional",
  },
];

export default {
  setup() {
    const sesion = useSesion();
    const admiStore = useAdmiStore();
    const solicitudes = reactive([]);
    onMounted(() => {});
    return {
      columns,
      solicitudes,
      admiStore,
    };
  },
};
</script>
