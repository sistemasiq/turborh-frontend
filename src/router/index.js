import { createRouter, createWebHistory } from 'vue-router'
import { useLocalStorageStore } from 'src/stores/localStorage'

const authGuard = (to, from, next) => {
  const useLocalStorage = useLocalStorageStore();
  if (!useLocalStorage.load("logged")) {
    next('/login')
  } else {
    next()
  }
}

const router = createRouter({
  mode: 'history',
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      redirect: "/login"
    },
    {
      path: "/login",
      name: "login",
      component: () => import("../views/LoginView.vue")
    },
    {
      path: "/register",
      name: "register",
      component: () => import("../views/user/RegisterView.vue")
    },
    {
      path: "/userHome",
      name: "userHome",
      component: () => import("../views/user/UserHomeView.vue"),
      children: [
        { path: "perfil", component: () => import('../views/user/UserProfileView.vue') },
        { path: "solicitud-1", component: () => import('../views/user/FrontPageView.vue') },
        { path: "solicitud-2", component: () => import('../views/user/PersonalDataView.vue') },
        { path: "solicitud-3", component: () => import('../views/user/PersonalDataTwoView.vue') },
        { path: "solicitud-4", component: () => import('../views/user/DocumentsView.vue') },
        { path: "solicitud-5", component: () => import('../views/user/RecruitingMeansView.vue') },
        { path: "solicitud-6", component: () => import('../views/user/FamilyDataView.vue') },
        { path: "solicitud-7", component: () => import('../views/user/EducationView.vue') },
        { path: "solicitud-8", component: () => import('../views/user/MachineryView.vue') },
        { path: "solicitud-9", component: () => import('../views/user/SkillsView.vue') },
        { path: "solicitud-10", component: () => import('../views/user/LaboralExperienceView.vue') },
        { path: "solicitud-11", component: () => import('../views/user/FamilyReferencesView.vue') },
        { path: "vacantes", component: () => import('../views/user/VacantsJobsView.vue') },
        { path: "sin-vacantes", component: () => import('../views/NoVacanciesView.vue') }
      ],
      //TODO: Add authGuard when finished all the routes in user home
      // beforeEnter: authGuard
    },

    {
      path: "/home",
      name: "home",
      component: () => import("../views/requisition/HomeView.vue"),
      children: [
        { path: "nueva-requisicion-1", component: () => import('../views/requisition/NewRequisitionView.vue') },
        { path: "nueva-requisicion-2", component: () => import('../views/requisition/NewRequisitionTwoView.vue') },
        { path: "historial-requisiciones", component: () => import('../views/requisition/RequisitionHistoryView.vue') },
        { path: "historial-requisiciones-solicitudes", component: () => import('../views/requisition/RequisitionApplicantsView.vue') },
        { path: "catalogo-puestos", component: () => import('../views/requisition/JobCatalog.vue') },
        { path: "edicion-puesto", component: () => import('../views/requisition/JobEditionView.vue') },
        { path: "catalogo-maquinaria", component: () => import('../views/requisition/MachineryCatalogView.vue') },

      ],
      beforeEnter: authGuard
    },
    {
      path: "/nomatches",
      name: "nomatches",
      component: () => import("../views/NoMatchesView.vue")
    },

    {
      path: "/diary",
      name: "diary",
      component: () => import("../views/DiaryView.vue"),
    },

    {
      path: "/agenda",
      name: "agenda",
      component: () => import("../views/AgendaView.vue"),
    },

    {
      path: "/email",
      name: "email",
      component: () => import("../views/EmailDesign.vue"),
    },

    {
      path: "/restore-password",
      name: "restore-password",
      component: () => import("../views/RestorePassword.vue"),
    },

    {
      path: "/change-password",
      name: "change-password",
      component: () => import("../views/ChangePasswordView.vue"),
    },

    {
      path: "/password-restored",
      name: "password-restored",
      component: () => import("../views/PasswordRestoredView.vue"),
    },
  ]
})

export default router;


