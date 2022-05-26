<template>
  <div class="q-pa-md">
    <q-table
      title="Mis solicitudes"
      :rows="admiStore.misSolicitudes"
      :columns="columns"
      row-key="id"
    >
      <template v-slot:top>
        <q-icon name="checklist" color="negative" size="3em" />

        <q-space />

        <q-btn
          class="glossy"
          round
          color="negative"
          icon="refresh"
          @click="cargarMisSolicitudes()"
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
              flat
              color="negative"
              icon="cancel"
              class="q-mr-md"
              v-show="
                (!!!props.row.enProceso && !!!props.row.terminado) ||
                (props.row.enProceso && !!!props.row.terminado)
              "
              @click="cambiarProceso(props.row, props.rowIndex)"
            />
            <q-btn
              flat
              round
              color="green"
              icon="check"
              v-show="!!props.row.enProceso || !!props.row.terminado"
              v-model="props.row.terminado"
              checked-icon="check"
              :disable="!!props.row.terminado"
              unchecked-icon="clear"
              @click="completarSolicitud(props.row, props.rowIndex)"
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
import { onMounted, reactive } from "@vue/runtime-core";
import { useAdmiStore } from "src/stores/admiStore";
import { apiEvents } from "src/boot/pusher";
import { useQuasar } from "quasar";
const columns = [
  { name: "id", label: "ID", field: "id" },
  { name: "nombre", label: "Nombre", field: "nombre" },
  { name: "coordinacion", label: "Coordinacion", field: "coordinacion" },
  { name: "problema", label: "Tipo de problema", field: "problema" },
  {
    name: "comentarioAdicional",
    label: "Informacion adicional",
    field: "comentarioAdicional",
  },
  {
    name: "observacionesAlCompletar",
    label: "Observaciones",
    field: "observacionesAlCompletar",
  },
];

export default {
  setup() {
    const admiStore = useAdmiStore();
    const $q = useQuasar();
    const solicitudes = reactive([]);
    const cambiarProceso = (solicitud, key) => {
      solicitud.enProceso = !!!solicitud.enProceso;
      if (solicitud.enProceso) admiStore.cambiarProceso(solicitud);
      else
        $q.dialog({
          title: "Has cancelado una solicitud",
          message: "¿Porque cancelaste la solicitud?",
          prompt: {
            model: "",
            isValid: (val) => val.length > 2,
            type: "text",
          },
          cancel: true,
          persistent: true,
        })
          .onOk((data) => {
            solicitud.razonCancelado = data;
            admiStore.cambiarProceso(solicitud);
          })
          .onCancel(() => {
            admiStore.misSolicitudes[key].enProceso = !!!solicitud.enProceso;
          });
    };
    const completarSolicitud = (solicitud, key) => {
      solicitud.enProceso = !!!solicitud.enProceso;
      solicitud.terminado = !!!solicitud.terminado;
      if (solicitud.terminado)
        $q.dialog({
          title: "Completar solicitud",
          message: "Indica tus observaciones",
          prompt: {
            model: "",
            isValid: (val) => val.length > 2,
            type: "text",
          },
          cancel: true,
          persistent: true,
        })
          .onOk((data) => {
            solicitud.observacionesAlCompletar = data;
            admiStore.cambiarProceso(solicitud);
          })
          .onCancel(() => {
            admiStore.misSolicitudes[key].enProceso = !!!solicitud.enProceso;
            admiStore.misSolicitudes[key].terminado = !!!solicitud.terminado;
          });
    };
    const cargarMisSolicitudes = async () => {
      try {
        await admiStore.cargarMisSolicitudes();
      } catch (error) {
        console.log(error);
        $q.notify({
          color: "negative",
          icon: "info",
          message:
            "No se ha podido cargar las solocitudes, para mas informacion  revise la consola",
        });
      }
    };
    onMounted(async () => {
      try {
        await cargarMisSolicitudes();
        apiEvents.Echo.channel("EstadoActualizado").listen(
          "EstadoActualizado",
          (e) => {
            const index = admiStore.solicitudes.findIndex(
              (s) => s.id == e.solicitud.id
            );
            admiStore.solicitudes[index] = e.solicitud;
          }
        );
      } catch (error) {
        console.log(error);
        $q.notify({
          color: "negative",
          icon: "info",
          message: "No se ha podido conectar al servidor de websockets",
        });
      }
    });
    return {
      columns,
      solicitudes,
      admiStore,
      cambiarProceso,
      completarSolicitud,
      cargarMisSolicitudes,
    };
  },
};
</script>
