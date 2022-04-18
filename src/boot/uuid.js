import { boot } from "quasar/wrappers";
import UUID from "vue-uuid";

export default boot(({ app }) => {
  app.use(UUID);
});
