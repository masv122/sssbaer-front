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

          <q-toggle
            color="negative"
            v-model="admi"
            label="¿Eres Administrador?"
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
import { getAuth, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { getDatabase, ref as fireref, child, get } from "firebase/database";
import { useRouter } from "vue-router";

export default {
  name: "LoginComp",
  setup() {
    const $q = useQuasar();
    const dbRef = fireref(getDatabase());
    const auth = getAuth();
    const correo = ref("");
    const refcorreo = ref("");
    const contraseña = ref("");
    const refContraseña = ref("");
    const esVisible = ref(true);
    const admi = ref(false);
    const router = useRouter();
    return {
      correo,
      refcorreo,
      contraseña,
      refContraseña,
      esVisible,
      admi,
      async onSubmit() {
        refcorreo.value.validate();
        refContraseña.value.validate();
        if (refcorreo.value.hasError || refContraseña.value.hasError) {
          $q.notify({
            color: "negative",
            message: "Complete los datos",
          });
        } else {
          try {
            const userCredential = await signInWithEmailAndPassword(
              auth,
              correo.value,
              contraseña.value
            );
            const user = userCredential.user;
            const resultado = await get(
              child(
                dbRef,
                `usuarios/${admi.value ? "admis" : "trabajadores"}/${user.uid}`
              )
            );
            if (resultado.exists()) {
              if (admi.value) router.push({ name: "administrador" });
              else router.push({ name: "usuario" });
            } else {
              const auth = getAuth();
              await signOut(auth);
              $q.notify({
                color: "negative",
                message: "Usuario no encontrado",
              });
            }
          } catch (error) {
            const errorCode = error.code;
            const errorMessage = error.message;
            if (errorCode === "auth/invalid-email")
              $q.notify({
                color: "negative",
                message: "Correo invalido",
              });
            console.log(error);
            console.log(errorCode);
            console.log(errorMessage);
          }
        }
      },
    };
  },
};
</script>

<style></style>
