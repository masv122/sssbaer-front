import { boot } from "quasar/wrappers";
import { useSesion } from "src/stores/sesion";

const sesion = useSesion();

export default boot(({ urlPath, router, store }) => {});
