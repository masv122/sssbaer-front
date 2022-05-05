<template>
  <q-dialog v-model="modoEditar">
    <q-card class="my-card q-pa-md">
      <q-form
        @submit.prevent.stop="onSubmit"
        @reset.prevent.stop="onReset"
        class="q-gutter-md"
      >
        <div class="text-h5">Modificar perfil</div>
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
              (val && val.length > 0) ||
              'Porfavor ingrese el nombre y apellido',
          ]"
        />
        <q-slide-item @left="onLeft" @right="onRight" v-if="!cambiarContraseña">
          <template v-slot:left>
            <q-icon name="done" />
          </template>

          <q-item>
            <q-item-section avatar>
              <q-avatar color="primary" text-color="white" icon="password" />
            </q-item-section>
            <q-item-section>Desliza para cambiar la contraseña</q-item-section>
          </q-item>
        </q-slide-item>

        <div v-else>
          <q-input
            v-model="contraseña"
            filled
            lazy-rules
            ref="refContraseña"
            label="Contraseña *"
            :type="esVisible ? 'password' : 'text'"
            hint="Ingrese la contraseña"
            :rules="[
              (val) =>
                (val && val.length > 0) || 'Porfavor ingrese una contraseña',
            ]"
            class="q-mb-md"
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
              (val) =>
                (val && val.length > 0) || 'Porfavor repita la contraseña',
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
        </div>
        <div>
          <q-btn label="guardar" type="submit" color="positive" icon="save" />
          <q-btn
            label="cancelar"
            type="reset"
            color="negative"
            flat
            icon="cancel"
            class="q-ml-sm"
          />
        </div>
      </q-form>
    </q-card>
  </q-dialog>
</template>

<script>
import { ref } from "@vue/reactivity";
import { computed, watch } from "@vue/runtime-core";
import { api } from "src/boot/axios";
import { useSesion } from "src/stores/sesion";
import { useQuasar } from "quasar";
export default {
  name: "EditarUsuario",
  emits: ["doneEditing"],
  props: {
    usuario: {
      type: Object,
      default() {
        return { id: "", nombre: "", contraseña: "", correo: "" };
      },
    },
    editar: Boolean,
  },
  setup(props, ctx) {
    const $q = useQuasar();
    const sesion = useSesion();
    const cambiarContraseña = ref(false);
    const id = ref(null);
    const nombre = ref(null);
    const contraseña = ref(null);
    const reContraseña = ref(null);
    const correo = ref(null);
    const refNombre = ref(null);
    const esVisible = ref(true);
    const refContraseña = ref(null);
    const refReContraseña = ref(null);
    const refCorreo = ref(null);
    const modoEditar = ref(false);
    const validarContraseña = computed(
      () => contraseña.value === reContraseña.value
    );

    watch(
      () => props.editar,
      () => {
        modoEditar.value = props.editar;
        if (props.editar) cargarPerfil();
      }
    );
    watch(
      () => modoEditar.value,
      () => {
        if (!modoEditar.value) ctx.emit("doneEditing");
      }
    );
    const resetForm = function () {
      nombre.value = "";
      contraseña.value = "";
      reContraseña.value = "";
      correo.value = "";
      esVisible.value = true;
      modoEditar.value = false;
    };

    const onRight = () => {};

    const onLeft = () => {
      cambiarContraseña.value = !cambiarContraseña.value;
    };

    const cargarPerfil = () => {
      nombre.value = props.usuario.name;
      correo.value = props.usuario.email;
      id.value = props.usuario.id;
      cambiarContraseña.value = false;
    };

    const onSubmit = async () => {
      refNombre.value.validate();
      refCorreo.value.validate();
      if (refNombre.value.hasError || refCorreo.value.hasError) {
        $q.notify({
          color: "negative",
          message: "Datos incorrectos",
        });
      } else {
        let usuario = {
          name: nombre.value,
          email: correo.value,
          id: id.value,
        };
        if (contraseña.value) usuario["password"] = contraseña.value;
        try {
          await api.put(`/users/${usuario.id}`, usuario, sesion.authorizacion);
          $q.notify({
            color: "positive",
            message: "Usuario Actualizado",
          });
          resetForm();
        } catch (error) {
          console.log(error);
          $q.notify({
            color: "negative",
            message:
              "Error al actualizar el usuario, mire la consola para mas informacion",
          });
        }
      }
    };

    return {
      id,
      nombre,
      correo,
      contraseña,
      reContraseña,
      refCorreo,
      refNombre,
      refContraseña,
      validarContraseña,
      refReContraseña,
      onLeft,
      resetForm,
      onReset() {
        resetForm();
      },
      cargarPerfil,
      onSubmit,
      onRight,
      cambiarContraseña,
      modoEditar,
      esVisible: ref(false),
    };
  },
};
</script>
