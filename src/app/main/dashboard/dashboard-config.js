import Dashboard from "../dashboard";
import { authRoles } from "app/auth";
import FormulaireMedecin from "app/page/Formulaire/FormulaireMedecin";

export const BoardConfig = {
  settings: {
    layout: {
      config: {
        navbar: {
          display: true,
        },
        toolbar: {
          display: true,
        },
        footer: {
          display: false,
        },
        leftSidePanel: {
          display: true,
        },
        rightSidePanel: {
          display: false,
        },
      },
    },
  },
  auth: authRoles.onlyGuest,
  routes: [
    {
      path: "/docteur",
      component: Dashboard,
    },
    {
      path: "/dossier",
      component: FormulaireMedecin,
    },
  ],
};
