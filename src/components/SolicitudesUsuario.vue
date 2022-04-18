<template>
  <q-table
    title="Mis solicitudes"
    :rows="solicitudes"
    :columns="columns"
    row-key="enProceso"
    grid
    hide-header
  >
    <template v-slot:item="props">
      <div
        class="q-pa-xs col-xs-12 col-sm-6 col-md-4 col-lg-3 grid-style-transition"
        :style="props.selected ? 'transform: scale(0.95);' : ''"
      >
        <q-card :class="props.selected ? 'bg-grey-2' : ''">
          <q-card-section>
            <q-breadcrumbs class="text-grey">
              <template v-slot:separator>
                <q-icon size="1.5em" name="chevron_right" color="primary" />
              </template>
              <q-breadcrumbs-el
                icon="hourglass_empty"
                :class="props.row.enProceso ? 'text-blue' : ''"
              />
              <q-breadcrumbs-el
                icon="check_circle"
                :class="props.row.terminada ? 'text-green' : ''"
              />
              <q-breadcrumbs-el icon="verified" />
            </q-breadcrumbs>
          </q-card-section>
          <q-separator />
          <q-list dense>
            <q-item v-for="col in props.cols" :key="col.name">
              <q-item-section>
                <q-item-label>{{ col.label }}</q-item-label>
              </q-item-section>
              <q-item-section side>
                <q-item-label caption>{{ col.value }}</q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
          <q-separator />
          <administrador-comp
            :id="props.row.administrador"
            v-show="props.row.enProceso || props.row.terminada"
          />
        </q-card>
      </div>
    </template>
  </q-table>
</template>

<script>
import { onMounted, ref, computed, watch, reactive } from "@vue/runtime-core";
import { useQuasar } from "quasar";
import {
  getDatabase,
  ref as refdb,
  onValue,
  orderByChild,
  query,
  equalTo,
  onChildChanged,
} from "firebase/database";
import { useSesion } from "stores/sesion";
import AdministradorComp from "components/AdministradorComp.vue";
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
  components: {
    AdministradorComp,
  },
  setup() {
    const db = getDatabase();
    const $q = useQuasar();
    const sesion = useSesion().sesion;
    const solicitudes = reactive([]);
    onMounted(() => {
      var redb = query(
        refdb(db, "solicitudes/"),
        orderByChild("usuario"),
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
        const refSolicitudes = solicitudes;
        const posicion = refSolicitudes.findIndex(
          (soli) => soli.key === data.key
        );
        solicitudes[posicion] = data.val();
      });
    });
    return {
      columns,
      solicitudes,
    };
  },
};
</script>
