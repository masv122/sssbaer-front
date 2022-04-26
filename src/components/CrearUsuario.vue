<template>
  <div class="q-pa-md shadow-1 bg-white" style="width: 600px">
    <q-form
      @submit.prevent.stop="onSubmit"
      @reset.prevent.stop="onReset"
      class="q-gutter-md"
    >
      <div class="text-h5">Complete los datos</div>
      <q-separator inset />

      <q-input
        v-model="correo"
        label="Correo"
        ref="refCorreo"
        filled
        lazy-rules
        type="email"
        :rules="[
          (val) => (val && val.length > 0) || 'Porfavor ingrese el correo',
        ]"
        hint="Email"
      />
      <q-input
        filled
        v-model="nombre"
        ref="refNombre"
        label="Nombre completo *"
        hint="Nombre y apellido"
        lazy-rules
        :rules="[
          (val) =>
            (val && val.length > 0) || 'Porfavor ingrese el nombre y apellido',
        ]"
      />
      <q-input
        v-model="contraseña"
        filled
        lazy-rules
        ref="refContraseña"
        label="Contraseña *"
        :type="esVisible ? 'password' : 'text'"
        hint="Ingrese la contraseña"
        :rules="[
          (val) => (val && val.length > 0) || 'Porfavor ingrese una contraseña',
        ]"
      >
        <template v-slot:append>
          <q-icon
            :name="esVisible ? 'visibility_off' : 'visibility'"
            class="cursor-pointer"
            @click="esVisible = !esVisible"
          />
        </template>
      </q-input>

      <q-input
        v-model="reContraseña"
        filled
        ref="refReContraseña"
        :error="!validarContraseña"
        lazy-rules
        label="Repita la Contraseña *"
        :type="esVisible ? 'password' : 'text'"
        hint="Debe coincidir con la contraseña"
        :rules="[
          (val) => (val && val.length > 0) || 'Porfavor repita la contraseña',
        ]"
      >
        <template v-slot:append>
          <q-icon
            :name="esVisible ? 'visibility_off' : 'visibility'"
            class="cursor-pointer"
            @click="esVisible = !esVisible"
          />
        </template>
      </q-input>
      <div class="q-pa-md">
        <div class="q-gutter-sm">
          <q-radio
            ref="refTipoDeCuenta"
            v-model="tipoDeCuenta"
            :val="false"
            label="Usuario"
          />
          <q-radio
            ref="refTipoDeCuenta"
            v-model="tipoDeCuenta"
            :val="true"
            label="Administrador"
          />
        </div>
      </div>
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
</template>

<script>
import { ref } from "@vue/reactivity";
import { useQuasar } from "quasar";
import { computed } from "@vue/runtime-core";
import { api } from "src/boot/axios";

export default {
  name: "CrearUsuario",
  setup() {
    const $q = useQuasar();
    const nombre = ref(null);
    const contraseña = ref(null);
    const reContraseña = ref(null);
    const correo = ref(null);
    const tipoDeCuenta = ref(false);
    const refUsuario = ref(null);
    const refNombre = ref(null);
    const esVisible = ref(true);
    const refContraseña = ref(null);
    const refReContraseña = ref(null);
    const refTipoDeCuenta = ref(null);
    const validarContraseña = computed(
      () => contraseña.value === reContraseña.value
    );
    const refCorreo = ref(null);
    const resetForm = function () {
      nombre.value = "";
      contraseña.value = "";
      reContraseña.value = "";
      correo.value = "";
      esVisible.value = true;
      tipoDeCuenta.value = false;
    };
    return {
      nombre,
      contraseña,
      reContraseña,
      correo,
      tipoDeCuenta,
      refUsuario,
      refNombre,
      refContraseña,
      refReContraseña,
      refCorreo,
      refTipoDeCuenta,
      validarContraseña,
      esVisible,
      onReset() {
        resetForm();
      },
      async onSubmit() {
        refNombre.value.validate();
        refContraseña.value.validate();
        refReContraseña.value.validate();
        refCorreo.value.validate();
        if (
          refNombre.value.hasError ||
          refContraseña.value.hasError ||
          refReContraseña.value.hasError ||
          refTipoDeCuenta.value.hasError ||
          refCorreo.value.hasError
        ) {
          $q.notify({
            color: "negative",
            message: "Las contraseñas deben coincidir",
          });
        } else {
          const usuario = {
            name: nombre.value,
            email: correo.value,
            password: contraseña.value,
            admi: tipoDeCuenta.value,
          };
          console.log(usuario);
          try {
            await api.post("/register", usuario);
            $q.notify({
              color: "positive",
              message: "Usuario Creado",
            });
            resetForm();
          } catch (error) {
            console.log(error.response.data);
            $q.notify({
              color: "negative",
              message:
                "Error al crear el usuario, mire la consola para mas informacion",
            });
          }
        }
      },
    };
  },
};
</script>
