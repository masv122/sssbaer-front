import { Cookies, Notify } from "quasar";
import { boot } from "quasar/wrappers";
import { useSesion } from "src/stores/sesion";
// "async" is optional;
// more info on params: https://v2.quasar.dev/quasar-cli/boot-files
const sesion = useSesion();
export default boot(async ({ app, store, router }) => {
  const token = Cookies.has("token");
  if (token) {
    try {
      const token = Cookies.get("token");
      sesion.data.token = token;
      const result = await sesion.setUser();
      if (!result) {
        router.push({
          name: "ingreso",
        });
      }
    } catch (error) {
      console.log(error);
      Notify.create({
        color: "negative",
        message:
          "Ha ocurrido un error en la autenticacion, revise la consola para mas informacion",
      });
    }
  } else
    router.push({
      name: "ingreso",
    });

  router.beforeEach(async (to, from, next) => {
    try {
      const isAuthenticated = await sesion.isAuth();
      if (to.name !== "ingreso" && !isAuthenticated)
        next({
          name: "ingreso",
        });
      else next();
    } catch (error) {
      console.log(error);
      Notify.create({
        color: "negative",
        message:
          "Ha ocurrido un error en el direccionamiento, revise la consola para mas informacion",
      });
      next({
        name: "ingreso",
      });
    }
  });
});
