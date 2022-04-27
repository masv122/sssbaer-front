<template>
  <q-card class="login">
    <q-card-section class="q-pt-none">
      <div class="q-pa-md">
        <q-form @submit.prevent.stop="onSubmit" class="q-gutter-md">
          <div class="text-h5 text-negative">Ingresa tus credenciales</div>
          <q-separator />
          <q-input
            filled
            ref="refcorreo"
            v-model="correo"
            label="Correo *"
            hint="Ingrese su correo"
            lazy-rules
            :rules="[
              (val) => (val && val.length > 0) || 'Porfavor ingrese el correo',
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
              (val) =>
                (val && val.length > 0) || 'Porfavor ingrese una contraseña',
            ]"
          >
            <template v-slot:append>
              <q-icon
                :name="esVisible ? 'visibility' : 'visibility_off'"
                class="cursor-pointer"
                @click="esVisible = !esVisible"
              />
            </template>
          </q-input>

          <div>
            <q-btn
              label="Ingresar"
              type="submit"
              class="full-width"
              color="negative"
            />
          </div>
          <q-banner rounded class="bg-grey-3">
            <template v-slot:avatar>
              <q-icon name="contact_support" color="primary" />
            </template>
            Si olvido su contraseña debera ir a la coordinacion de TIC para
            recuperarla
          </q-banner>
        </q-form>
      </div>
    </q-card-section>
  </q-card>
</template>

<script>
import { ref } from "@vue/reactivity";
import { useQuasar } from "quasar";
import { useRouter } from "vue-router";
import { api } from "boot/axios";
import { useSesion } from "src/stores/sesion";

export default {
  name: "LoginComp",
  setup() {
    const $q = useQuasar();
    const correo = ref("");
    const refcorreo = ref("");
    const contraseña = ref("");
    const refContraseña = ref("");
    const esVisible = ref(true);
    const sesion = useSesion();
    const router = useRouter();
    return {
      correo,
      refcorreo,
      contraseña,
      refContraseña,
      esVisible,
      async onSubmit() {
        if (refcorreo.value.hasError || refContraseña.value.hasError) {
          $q.notify({
            color: "negative",
            message: "Complete los datos",
          });
        } else {
          const result = await sesion.login(correo.value, contraseña.value);
          if (result) {
            if (sesion.data.user.admi) {
              router.push({ name: "administrador" });
            } else {
              router.push({ name: "usuario" });
            }
          } else {
            $q.notify({
              type: "warning",
              message: "Usuario/Contraseña invalidas",
            });
          }
        }
      },
    };
  },
};
</script>

<style></style>
