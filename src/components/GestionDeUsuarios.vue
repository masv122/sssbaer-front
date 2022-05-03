<template>
  <div class="q-pa-md">
    <q-table
      grid
      grid-header
      title="Usuarios"
      :rows="usuarios"
      :columns="columns"
      row-key="name"
      hide-header
    >
      <template v-slot:top-right>
        <q-radio
          v-model="tipo"
          @click="cargarData"
          :val="0"
          label="Trabajadores"
        />
        <q-radio
          v-model="tipo"
          @click="cargarData"
          :val="1"
          label="Administradores"
        />
        <q-input borderless dense debounce="300" placeholder="Buscar">
          <template v-slot:append>
            <q-icon name="search" />
          </template>
        </q-input>
      </template>
      <template v-slot:item="props">
        <div
          class="q-pa-xs col-xs-12 col-sm-6 col-md-4 col-lg-3 grid-style-transition"
          :style="props.selected ? 'transform: scale(0.95);' : ''"
        >
          <q-card :class="props.selected ? 'bg-grey-2' : ''">
            <q-card-actions align="right">
              <q-btn
                flat
                color="primary"
                size="sm"
                rounded
                icon="edit"
                @click="
                  cargarPerfil(props.row);
                  modoEditar = true;
                "
              />
              <q-btn
                flat
                color="negative"
                size="sm"
                rounded
                icon="cancel"
                @click="
                  cargarPerfil(props.row);
                  modoEditar = true;
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
          </q-card>
        </div>
      </template>
    </q-table>
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
          <q-slide-item
            @left="onLeft"
            @right="onRight"
            v-if="!cambiarContraseña"
          >
            <template v-slot:left>
              <q-icon name="done" />
            </template>

            <q-item>
              <q-item-section avatar>
                <q-avatar color="primary" text-color="white" icon="password" />
              </q-item-section>
              <q-item-section
                >Desliza para cambiar la contraseña</q-item-section
              >
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
  </div>
</template>

<script>
import { onMounted, reactive, ref, computed } from "vue";
import { useSesion } from "src/stores/sesion";
import { api } from "src/boot/axios";
import { useQuasar } from "quasar";

const columns = [
  { name: "email", label: "correo", field: "email" },
  { name: "name", label: "nombre", field: "name" },
  {
    name: "admi",
    label: "Tipo",
    field: (row) => (Boolean(row.admi) ? "Administrador" : "Usuario"),
  },
];

export default {
  name: "GestionDeUsuarios",
  setup() {
    const cambiarContraseña = ref(false);
    const $q = useQuasar();
    const sesion = useSesion();
    const usuarios = reactive([]);
    const id = ref(null);
    const modoEditar = ref(false);
    const nombre = ref(null);
    const contraseña = ref(null);
    const reContraseña = ref(null);
    const correo = ref(null);
    const tipoDeCuenta = ref(1);
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
    const tipo = ref(0);

    onMounted(() => {
      cargarData();
    });

    const cargarData = async () => {
      try {
        const response = await api.get("/users", sesion.authorizacion);
        if (response.data.users)
          response.data.users.forEach((u) => {
            usuarios.push(u);
          });
      } catch (error) {
        console.log(error);
        $q.notify({
          color: "negative",
          message:
            "Error al cargar los usuarios, consulte la consola para mas informacion",
        });
      }
    };
    const onLeft = () => {
      cambiarContraseña.value = !cambiarContraseña.value;
    };
    const resetForm = function () {
      nombre.value = "";
      contraseña.value = "";
      reContraseña.value = "";
      correo.value = "";
      esVisible.value = true;
      tipoDeCuenta.value = false;
      modoEditar.value = false;
    };
    const onRight = () => {};
    const cargarPerfil = (perfil) => {
      nombre.value = perfil.name;
      correo.value = perfil.email;
      id.value = perfil.id;
      cambiarContraseña.value = false;
    };
    return {
      columns,
      tipo,
      id,
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
      usuarios,
      cargarData,
      cargarPerfil,
      onLeft,
      resetForm,
      onReset() {
        resetForm();
      },
      async onSubmit() {
        refNombre.value.validate();
        refCorreo.value.validate();
        if (refNombre.value.hasError || refCorreo.value.hasError) {
          $q.notify({
            color: "negative",
            message: "Datos incorrectos",
          });
        } else {
          const usuario = {
            name: nombre.value,
            email: correo.value,
            id: id.value,
          };
          try {
            await api.put(
              `/users/${usuario.id}`,
              usuario,
              sesion.authorizacion
            );
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
      },
      onRight,
      cambiarContraseña,
      modoEditar,
    };
  },
};
</script>
