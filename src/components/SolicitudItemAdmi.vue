<template>
  <div
    class="q-pa-xs col-xs-12 col-sm-6 col-md-4 col-lg-3 grid-style-transition"
  >
    <q-card>
      <q-card-section
        v-if="
          (!!data.row.idAdministrador &&
            data.row.idAdministrador != sesion.data.user.id) ||
          supervisor
        "
      >
        <q-breadcrumbs class="text-grey">
          <template v-slot:separator>
            <q-icon size="1.5em" name="chevron_right" color="negative" />
          </template>
          <q-breadcrumbs-el
            icon="hourglass_empty"
            :class="!!data.row.enProceso ? 'text-negative' : ''"
          />
          <q-breadcrumbs-el
            icon="check_circle"
            :class="!!data.row.terminado ? 'text-negative' : ''"
          />
          <q-breadcrumbs-el icon="verified" />
        </q-breadcrumbs>
      </q-card-section>
      <q-card-actions align="right" v-else>
        <q-btn
          :outline="!!data.row.enProceso"
          :color="!!data.row.enProceso ? 'negative' : 'primary'"
          :label="!!data.row.enProceso ? 'rechazar' : 'Aceptar'"
          v-show="
            (!!!data.row.enProceso && !!!data.row.terminado) ||
            (data.row.enProceso && !!!data.row.terminado)
          "
          @click="$emit('cambiarProceso', data.row, data.rowIndex)"
        />
        <q-btn
          color="green"
          label="Completar"
          v-show="!!data.row.enProceso || !!data.row.terminado"
          checked-icon="check"
          :disable="!!data.row.terminado"
          unchecked-icon="clear"
          @click="$emit('completarSolicitud', data.row, data.rowIndex)"
        />
      </q-card-actions>
      <q-separator />
      <q-list dense>
        <q-item v-for="col in data.cols" :key="col.name">
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
        :id="data.row.idAdministrador"
        v-show="!!data.row.enProceso"
      />
    </q-card>
  </div>
</template>

<script>
import AdministradorComp from "components/AdministradorComp.vue";
import { useSesion } from "src/stores/sesion";
export default {
  components: { AdministradorComp },
  name: "SolicitudItemAdmi",
  props: {
    data: Object,
    supervisor: {
      type: Boolean,
      default: false,
    },
  },
  setup() {
    const sesion = useSesion();
    return { sesion };
  },
};
</script>
