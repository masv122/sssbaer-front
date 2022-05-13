<template>
  <div class="flex flex-center">
    <q-card class="bg-blue-grey-1" style="width: 600px; height: 420px">
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
              <q-btn label="Enviar" type="submit" color="negative" />
              <q-btn
                label="Restablecer"
                type="reset"
                color="negative"
                flat
                class="q-ml-sm"
              />
            </div>
          </q-form>
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
    return {
      problema,
      coordinacion,
      comentarioAdicional,
      coordinaciones: [
        "Gerencia",
        "RRHH",
        "Contabilidad",
        "Recaudacion",
        "Planificacion y Presupuesto",
      ],
      tipoDeProblema: ["Internet", "Equipo", "Otro"],
      refProblema,
      refCoordinacion,

      async onSubmit() {
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
          } catch (error) {
            console.log(error.response);
            $q.notify({
              color: "negative",
              message: "Error al crear la solicitud",
            });
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
