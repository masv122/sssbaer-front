<template>
  <div class="flex flex-center">
    <div class="q-pa-md shadow-1" style="width: 600px">
      <q-form @submit="onSubmit" @reset="onReset" class="q-gutter-md">
        <div class="text-h5">Formulario de solicitud</div>
        <q-separator inset />
        <q-select
          standout="bg-teal text-white"
          class="q-mb-lg"
          ref="refCoordinacion"
          style="max-width: 300px"
          v-model="coordinacion"
          :options="coordinaciones"
          label="Coordinación"
        />

        <q-select
          standout="bg-teal text-white"
          style="max-width: 300px"
          class="q-mb-lg"
          ref="refProblema"
          v-model="problema"
          :options="tipoDeProblema"
          label="Tipo de problema"
        />

        <q-input
          class="q-mb-lg"
          ref="refComentarioAdicional"
          label="Comentarios adicionales"
          v-model="comentarioAdicional"
          filled
          type="textarea"
        />

        <div>
          <q-btn label="Enviar" type="submit" color="primary" />
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
  </div>
</template>

<script>
import { ref } from "vue";
import { v4 as uuidv4 } from "uuid";
import { useQuasar } from "quasar";
import { useSesion } from "stores/sesion";
import { getDatabase, ref as refdb, set, push } from "firebase/database";

export default {
  setup() {
    const $q = useQuasar();
    const db = getDatabase();
    const sesion = useSesion().sesion;
    const coordinacion = ref(null);
    const problema = ref(null);
    const comentarioAdicional = ref("");
    const refProblema = ref(null);
    const refCoordinacion = ref(null);
    const refComentarioAdicional = ref(null);
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
      refComentarioAdicional,

      onSubmit() {
        refProblema.value.validate();
        refCoordinacion.value.validate();
        refComentarioAdicional.value.validate();
        if (
          refProblema.value.hasError ||
          refCoordinacion.value.hasError ||
          refComentarioAdicional.value.hasError
        ) {
          $q.notify({
            color: "negative",
            message: "Falta informacion",
          });
        } else {
          try {
            const id = uuidv4();
            const postListRef = refdb(db, "solicitudes");
            const newPostRef = push(postListRef);
            set(newPostRef, {
              coordinacion: coordinacion.value,
              problema: problema.value,
              comentarioAdicional: comentarioAdicional.value,
              enProceso: false,
              terminada: false,
              usuario: sesion.uid,
              administrador: "",
            });

            $q.notify({
              color: "positive",
              message: "Solicitud creada",
            });
            resetForm();
          } catch (error) {
            const errorCode = error.code;
            const errorMessage = error.message;
            console.log(error);
            console.log(errorCode);
            console.log(errorMessage);
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
