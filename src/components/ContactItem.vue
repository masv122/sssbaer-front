<template>
  <q-item clickable>
    <q-item-section avatar>
      <q-avatar>
        <q-icon name="engineering" />
      </q-avatar>
    </q-item-section>

    <q-item-section>
      <q-item-label lines="1">{{ name }}</q-item-label>
      <q-item-label caption lines="2">
        <span class="text-weight-bold">ID: {{ id }}</span>
      </q-item-label>
    </q-item-section>
    <q-item-section side top v-show="top !== undefined && top < 2">
      <q-item-label caption>{{
        top !== undefined ? clasificacion[top].label : ""
      }}</q-item-label>
      <q-icon
        name="star"
        :color="top !== undefined ? clasificacion[top].color : ''"
      />
    </q-item-section>
  </q-item>
</template>

<script>
export default {
  name: "ContactItem",
  props: ["name", "id", "top"],
  setup() {
    return {
      clasificacion: [
        {
          color: "yellow",
          label: "Empleado del mes",
        },
        {
          color: "blue-grey-10",
          label: "Sigue intentando bro :(",
        },
        {
          color: "brown-10",
          label: "Para la proxima mano",
        },
      ],
    };
  },
};
</script>

<style scoped></style>
