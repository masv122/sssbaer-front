<template>
  <div class="q-pa-md">
    <q-table
      title="Mis solicitudes"
      :rows="solicitudes"
      :columns="columns"
      row-key="name"
    >
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
            <q-toggle
              v-show="
                (!props.row.enProceso && !props.row.terminada) ||
                (props.row.enProceso && !props.row.terminada)
              "
              v-model="props.row.enProceso"
              icon="alarm"
              @click="cambiarProceso(props.row)"
            />
            <q-toggle
              v-show="props.row.enProceso || props.row.terminada"
              v-model="props.row.terminada"
              checked-icon="check"
              color="green"
              :disable="props.row.terminada"
              unchecked-icon="clear"
              @click="
                props.row.enProceso = !props.row.enProceso;
                cambiarProceso(props.row);
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
import {
  getDatabase,
  ref as refdb,
  onValue,
  orderByChild,
  query,
  equalTo,
  update,
  onChildChanged,
} from "firebase/database";
import { useSesion } from "stores/sesion";
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
    const db = getDatabase();
    const sesion = useSesion().sesion;
    const solicitudes = reactive([]);
    onMounted(() => {
      var redb = query(
        refdb(db, "solicitudes/"),
        orderByChild("administrador"),
        equalTo(sesion.uid)
      );
      onValue(
        redb,
        (snapshot) => {
          snapshot.forEach((childSnapshot) => {
            var solicitud = childSnapshot.val();
            solicitud.key = childSnapshot.key;
            solicitudes.push(solicitud);
          });
        },
        {
          onlyOnce: true,
        }
      );
      onChildChanged(redb, (data) => {
        console.log(data);
        const refSolicitudes = solicitudes;
        const posicion = refSolicitudes.findIndex(
          (soli) => soli.key === data.key
        );
        solicitudes[posicion] = data.val();
      });
    });
    const cambiarProceso = (solicitud) => {
      var redb = refdb(db, "solicitudes/" + solicitud.key);
      if (solicitud.enProceso) solicitud.administrador = sesion.uid;
      if (!solicitud.terminada && !solicitud.enProceso)
        solicitud.administrador = "";
      update(redb, solicitud);
    };
    return {
      columns,
      solicitudes,
      cambiarProceso,
    };
  },
};
</script>
