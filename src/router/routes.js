const routes = [
  {
    path: "",
    component: () => import("layouts/MainLayout"),
    redirect: { name: "ingreso" },
    children: [
      {
        path: "/",
        component: () => import("layouts/IngresoLayout.vue"),
        redirect: { name: "ingreso" },
        children: [
          {
            path: "ingreso",
            name: "ingreso",
            component: () => import("pages/IngresoPage"),
          },
        ],
      },
      {
        path: "/usuario",
        name: "usuario",
        redirect: { name: "solicitudes usuario" },
        component: () => import("layouts/UsuarioLayout.vue"),
        children: [
          {
            path: "dashboard",
            name: "usuario dashboard",
            component: () => import("pages/UsuarioPage.vue"),
            children: [
              {
                name: "solicitudes usuario",
                path: "solicitudes-usuario",
                component: () => import("components/SolicitudesUsuario.vue"),
              },
              {
                path: "crear-solicitud",
                name: "crear solicitud",
                component: () => import("components/FormularioSolicitud.vue"),
              },
            ],
          },
        ],
      },
      {
        path: "/administrador",
        name: "administrador",
        redirect: { name: "solicitudes admi" },
        component: () => import("layouts/AdministradorLayout.vue"),
        children: [
          {
            path: "dashboard",
            name: "administrador dashboard",
            component: () => import("pages/AdmiPage.vue"),
            children: [
              {
                path: "solicitudes",
                name: "solicitudes admi",
                component: () => import("components/SolicitudesAdmi.vue"),
              },
              {
                path: "mis-solicitudes",
                name: "solicitudes realizadas admi",
                component: () =>
                  import("components/SolicitudesRealizadasAdmi.vue"),
              },
              {
                path: "gestion-de-cuentas",
                name: "gestion de cuentas",
                redirect: { name: "crear usuario" },
                component: () => import("components/GestionDeCuentas.vue"),
                children: [
                  {
                    path: "crear-usuario",
                    name: "crear usuario",
                    component: () => import("components/CrearUsuario.vue"),
                  },
                  {
                    path: "gestion-de-usuario",
                    name: "gestion de usuarios",
                    component: () =>
                      import("src/components/GestionDeUsuarios.vue"),
                  },
                ],
              },
            ],
          },
        ],
      },
      {
        path: "supervisor",
        name: "supervisor",
        redirect: { name: "supervisor dashboard" },
        component: () => import("layouts/SupervisorLayout.vue"),
        children: [
          {
            path: "dashboard",
            name: "supervisor dashboard",
            component: () => import("pages/Dashboard.vue"),
          },
          {
            path: "solicitudes",
            name: "estadisticas solicitudes",
            component: () => import("pages/SolicitudesEstadisticas.vue"),
          },
          {
            path: "administradores",
            name: "estadisticas administradores",
            component: () => import("pages/AdministradoresEstadisticas.vue"),
          },
        ],
      },
    ],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: "/:catchAll(.*)*",
    component: () => import("pages/ErrorNotFound.vue"),
  },
];

export default routes;
