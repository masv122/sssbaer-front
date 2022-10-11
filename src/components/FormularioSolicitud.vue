<template>
  <div class="flex flex-center">
    <q-card style="width: 500px; height: 420px">
      <q-card-section class="q-pt-none">
        <div class="q-pa-md">
          <q-form @submit="onSubmit" @reset="onReset">
            <div class="text-h5 text-center text-negative q-mb-lg">
              Formulario de solicitud
            </div>
            <q-select
              label-color="negative"
              color="negative"
              ref="refCoordinacion"
              style="max-width: 300px"
              v-model="coordinacion"
              :options="coordinaciones"
              label="Coordinación"
              :rules="[(val) => !!val || '* Seleccione una coordinacion']"
              lazy-rules
            />

            <q-select
              label-color="negative"
              color="negative"
              style="max-width: 300px"
              ref="refProblema"
              v-model="problema"
              :options="tipoDeProblema"
              label="Tipo de problema"
              :rules="[(val) => !!val || '* Seleccione un tipo de problema']"
              lazy-rules
            />

            <q-input
              label-color="negative"
              color="negative"
              class="q-mb-lg"
              label="Comentarios adicionales"
              v-model="comentarioAdicional"
              filled
              type="textarea"
            />

        <div>
          <q-btn
            label="Enviar  "
            :disable="enEspera"
            type="submit"
            color="primary"
          >
            <q-spinner v-show="enEspera" color="danger" size="0.8em" />
          </q-btn>
          <q-btn
            label="Restablecer"
            type="reset"
            color="negative"
            flat
            class="q-ml-sm"
          />
        </div>
      </q-card-section>
    </q-card>
  </div>
</template>

<script>
import { ref } from "vue";
import { useQuasar } from "quasar";
import { useSesion } from "stores/sesion";
import { api } from "src/boot/axios";

export default {
  setup() {
    const $q = useQuasar();
    const sesion = useSesion();
    const coordinacion = ref(null);
    const problema = ref(null);
    const comentarioAdicional = ref("");
    const refProblema = ref(null);
    const refCoordinacion = ref(null);
    const resetForm = function () {
      coordinacion.value = null;
      problema.value = null;
      comentarioAdicional.value = "";
    };
    const enEspera = ref(false);
    return {
      problema,
      coordinacion,
      comentarioAdicional,
      coordinaciones: [
        "OPERACIONES",
        "RECAUDACIÓN Y COBRANZAS",
        "SEGURIDAD AEROPORTUARIA",
        "TECNOLOGIA DE LA INFORMACIÓN",
        "ASESORIA JURIDICA",
        "ATENCION AL CIUDADANO",
        "COMERCIALIZACIÓN",
        "DESTACAMENTO DE BOMBERO AERONAUTICOS",
        "GERENCIA GENERAL",
        "GESTIÓN ADMINISTRATIVA",
        "INFRAESTRUCTURA E INGENIERIA",
        "GESTIÓN COMUNICACIONAL",
        "GESTIÓN HUMANA",
        "OPERACIONES",
        "OPERACIONES (SERVICIO MEDICO)",
        "PLANIFICACIÓN, PRESUPUESTO Y ORGANIZACIÓN",
        "VEHICULO Y LOGISTICA",
        "SUBGERENCIA",
        "SEGURIDAD INTEGRAL",
        "SERVICIOS GENERALES",
      ],
      tipoDeProblema: ["Internet", "Equipo", "Otro"],
      refProblema,
      refCoordinacion,
      enEspera,

      async onSubmit() {
        enEspera.value = true;
        refProblema.value.validate();
        refCoordinacion.value.validate();
        if (refProblema.value.hasError || refCoordinacion.value.hasError) {
          $q.notify({
            color: "negative",
            message: "Falta informacion",
          });
        } else {
          try {
            const solicitud = {
              coordinacion: coordinacion.value,
              problema: problema.value,
              comentarioAdicional: comentarioAdicional.value,
              enProceso: false,
              terminado: false,
              idUsuario: sesion.data.user.id,
              administrador: "",
            };
            const response = await api.post(
              "/solicitudes",
              solicitud,
              sesion.authorizacion
            );
            if (response.data.message === "ok")
              $q.notify({
                color: "positive",
                message: "Solicitud creada",
              });
            else
              $q.notify({
                color: "negative",
                message: "datos invalidos",
              });
            resetForm();
            enEspera.value = false;
          } catch (error) {
            console.log(error.response);
            $q.notify({
              color: "negative",
              message: "Error al crear la solicitud",
            });
            enEspera.value = false;
          }
        }
      },
      onReset() {
        resetForm();
      },
    };
  },
};
</script>
