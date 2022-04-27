<template>
  <q-table
    title="Mis solicitudes"
    :rows="solicitudes"
    :columns="columns"
    row-key="id"
    grid
    hide-header
  >
    <template v-slot:item="props">
      <div
        class="q-pa-xs col-xs-12 col-sm-6 col-md-4 col-lg-3 grid-style-transition"
        :style="props.selected ? 'transform: scale(0.95);' : ''"
      >
        <q-card :class="props.selected ? 'bg-grey-2' : ''">
          <q-card-section
            v-if="
              props.row.idAdministrador !== sesion.data.user.id &&
              props.row.idAdministrador
            "
          >
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
              s-el icon="verified" />
            </q-breadcrumbs>
          </q-card-section>
          <q-card-actions align="right" v-else>
            <q-btn
              :outline="!!props.row.enProceso"
              :color="props.row.enProceso ? 'negative' : 'primary'"
              :label="props.row.enProceso ? 'rechazar' : 'Aceptar'"
              v-show="
                (!props.row.enProceso && !props.row.terminada) ||
                (props.row.enProceso && !props.row.terminada)
              "
              @click="
                props.row.enProceso = !props.row.enProceso;
                cambiarProceso(props.row);
              "
            />
            <q-btn
              color="green"
              label="Completar"
              v-show="props.row.enProceso || props.row.terminada"
              v-model="props.row.terminada"
              checked-icon="check"
              :disable="props.row.terminada"
              unchecked-icon="clear"
              @click="
                props.row.enProceso = !props.row.enProceso;
                props.row.terminada = !props.row.terminada;
                cambiarProceso(props.row);
              "
            />
          </q-card-actions>
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
            v-show="props.row.enProceso"
          />
        </q-card>
      </div>
    </template>
  </q-table>
</template>

<script>
import { onMounted, reactive } from "@vue/runtime-core";
import { useSesion } from "src/stores/sesion";
import AdministradorComp from "components/AdministradorComp.vue";
import { api } from "src/boot/axios";
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
    const solicitudes = reactive([]);
    const sesion = useSesion();
    onMounted(async () => {
      const response = await api.get("/solicitudes", sesion.authorizacion);
      const solicitudesResponse = response.data.solicitudes;
      solicitudesResponse.forEach((solicitud) => {
        solicitudes.push(solicitud);
      });
    });

    const cambiarProceso = async (solicitud) => {
      if (solicitud.enProceso) solicitud.idAdministrador = sesion.data.user.id;
      if (!solicitud.terminada && !solicitud.enProceso)
        solicitud.idAdministrador = "";
      console.log(solicitud);
      const resultado = await api.patch(
        `/solicitudes/${solicitud.id}`,
        solicitud,
        sesion.authorizacion
      );
      console.log(resultado);
    };
    return {
      sesion,
      columns,
      cambiarProceso,
      solicitudes,
    };
  },
};
</script>

<style lang="sass">
.my-card
  width: 100%
  max-width: 350px

.grid-masonry
  flex-direction: column
  height: 500px

  &--2
    > div
      &:nth-child(2n + 1)
        order: 1
      &:nth-child(2n)
        order: 2

    &:before
      content: ''
      flex: 1 0 100% !important
      width: 0 !important
      order: 1
  &--3
    > div
      &:nth-child(3n + 1)
        order: 1
      &:nth-child(3n + 2)
        order: 2
      &:nth-child(3n)
        order: 3

    &:before,
    &:after
      content: ''
      flex: 1 0 100% !important
      width: 0 !important
      order: 2
</style>
