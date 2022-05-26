<template>
  <q-card flat bordered style="width: 400px; height: 420px">
    <q-card-section class="q-pt-none">
      <div class="q-pa-md">
        <q-form @submit.prevent.stop="onSubmit" class="q-gutter-sm">
          <div class="text-h5 text-center text-negative q-mb-lg">Ingreso</div>
          <q-input
            color="negative"
            ref="refcorreo"
            v-model="correo"
            label="Correo"
            lazy-rules
            :rules="[
              (val) => (val && val.length > 0) || 'Porfavor ingrese el correo',
            ]"
          />

          <q-input
            color="negative"
            v-model="contraseña"
            lazy-rules
            ref="refContraseña"
            label="Contraseña"
            :type="esVisible ? 'password' : 'text'"
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

          <q-checkbox
            color="negative"
            v-model="recordar"
            label="Recordar sesion"
            checked-icon="task_alt"
            unchecked-icon="highlight_off"
          />

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
    const recordar = ref(false);
    return {
      correo,
      refcorreo,
      contraseña,
      refContraseña,
      esVisible,
      recordar,
      async onSubmit() {
        try {
          if (refcorreo.value.hasError || refContraseña.value.hasError) {
            $q.notify({
              color: "negative",
              message: "Complete los datos",
            });
          } else {
            const result = await sesion.login(correo.value, contraseña.value);
            if (result) {
              if (recordar.value)
                $q.cookies.set("token", sesion.data.token, {
                  sameSite: "Lax",
                });
              else $q.cookies.remove("token");
              if (
                !Boolean(sesion.data.user.admi) &&
                !Boolean(sesion.data.user.supervisor)
              )
                router.push({ name: "usuario" });
              else if (Boolean(sesion.data.user.admi))
                router.push({ name: "administrador" });
              else if (Boolean(sesion.data.user.supervisor))
                router.push({ name: "supervisor" });
            } else
              $q.notify({
                type: "warning",
                message: "Usuario/Contraseña invalidas",
              });
          }
        } catch (error) {
          console.log(error);
        }
      },
    };
  },
};
</script>

<style></style>
