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
  </q-item>
</template>

<script>
import { defineComponent } from "vue";

export default defineComponent({
  name: "ContactItem",
  props: ["name", "id"],
});
</script>

<style scoped></style>
