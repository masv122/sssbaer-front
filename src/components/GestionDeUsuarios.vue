<template>
  <div class="q-pa-md">
    <q-table
      grid
      title="Usuarios"
      :rows="usuarios"
      :columns="columns"
      row-key="name"
      hide-header
    >
      <template v-slot:top-right>
        <!--  <q-select v-model="model" :options="options" label="Filtrar por" /> -->
        <!--         <q-radio
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
        /> -->
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
                @click="cargarPerfil(props.row)"
              />
              <q-btn
                flat
                color="negative"
                size="sm"
                rounded
                icon="cancel"
                @click="cargarPerfil(props.row)"
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
    <editar-usuario
      :editar="modoEditar"
      :usuario="usuario.data"
      @doneEditing="modoEditar = false"
    />
  </div>
</template>

<script>
import { onMounted, reactive, ref, computed } from "vue";
import { useSesion } from "src/stores/sesion";
import { api } from "src/boot/axios";
import { useQuasar } from "quasar";
import EditarUsuario from "components/EditarUsuario.vue";

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
  components: {
    EditarUsuario,
  },
  setup() {
    const modoEditar = ref(false);
    const $q = useQuasar();
    const sesion = useSesion();
    const usuarios = reactive([]);
    const usuario = reactive({ data: null });
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

    const cargarPerfil = (user) => {
      modoEditar.value = true;
      usuario.data = user;
    };
    return {
      columns,
      usuarios,
      usuario,
      cargarData,
      cargarPerfil,
      modoEditar,
      tipo,
      model: ref("Todes"),
      options: ["Usuaries", "Administradores", "Todes"],
    };
  },
};
</script>
