import DashboardSAMU from "../dashboard-samu";
import { authRoles } from "app/auth";

export const BoardSamuConfig = {
  settings: {
    layout: {
      config: {
        navbar: {
          display: true
        },
        toolbar: {
          display: true
        },
        footer: {
          display: false
        },
        leftSidePanel: {
          display: true
        },
        rightSidePanel: {
          display: false
        }
      }
    }
  },
  auth: authRoles.samu,
  routes: [
    {
      path: "/samu",
      component: DashboardSAMU
    }
  ]
};
