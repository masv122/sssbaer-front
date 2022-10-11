<template>
  <div>
    <q-item
      style="max-width: 420px"
      v-for="(notis, key) in admiStore.globalNotis"
      :key="key"
      clickable
      v-ripple
    >
      <q-item-section avatar>
        <q-avatar>
          <q-icon :name="Boolean(notis.data.admi) ? 'engineering' : 'person'" />
        </q-avatar>
      </q-item-section>

      <q-item-section>
        <q-item-label>{{ notis.data.name }}</q-item-label>
        <q-item-label caption lines="1">{{ notis.data.text }}</q-item-label>
      </q-item-section>

      <q-item-section side>
        {{ notis.data.hora }}
      </q-item-section>
    </q-item>
  </div>
</template>

<script>
import { useAdmiStore } from "src/stores/admiStore";
import { defineComponent } from "vue";

export default defineComponent({
  name: "NotisComp",
  setup() {
    const admiStore = useAdmiStore();
    return {
      admiStore,
    };
  },
});
</script>

<style scoped></style>
