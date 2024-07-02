import { createRouter, createWebHashHistory } from 'vue-router'
import { useLocalStorageStore } from '/src/stores/localStorage'


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
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      redirect: "/login"
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'notFound',
      component: () => import ('/src/views/NotFoundView.vue')
    },
    {
      path: "/login",
      name: "login",
      component: () => import('/src/views/LoginView.vue')
    },
    {
      path: "/register",
      name: "register",
      component: () => import("/src/views/user/RegisterView.vue")
    },
    {
      path: "/userHome",
      name: "userHome",
      component: () => import("/src/views/user/UserHomeView.vue"),
      children: [
        { path: "perfil", component: () => import('/src/views/user/UserProfileView.vue') },
        { path: "solicitud-1", component: () => import('/src/views/user/FrontPageView.vue') },
        { path: "solicitud-2", component: () => import('/src/views/user/PersonalDataView.vue') },
        { path: "solicitud-3", component: () => import('/src/views/user/PersonalDataTwoView.vue') },
        { path: "solicitud-4", component: () => import('/src/views/user/DocumentsView.vue') },
        { path: "solicitud-5", component: () => import('/src/views/user/RecruitingMeansView.vue') },
        { path: "solicitud-6", component: () => import('/src/views/user/FamilyDataView.vue') },
        { path: "solicitud-7", component: () => import('/src/views/user/EducationView.vue') },
        { path: "solicitud-8", component: () => import('/src/views/user/MachineryView.vue') },
        { path: "solicitud-9", component: () => import('/src/views/user/SkillsView.vue') },
        { path: "solicitud-10", component: () => import('/src/views/user/LaboralExperienceView.vue') },
        { path: "solicitud-11", component: () => import('/src/views/user/FamilyReferencesView.vue') },
        { path: "solicitud-12", component: () => import('/src/views/user/PrivacyAdviceView.vue') },
        { path: "vacantes", component: () => import('/src/views/user/VacantsJobsView.vue') },
        { path: "sin-vacantes", component: () => import('/src/views/NoVacanciesView.vue') }
      ],
      beforeEnter: authGuard

    },

    {
      path: "/home",
      name: "home",
      component: () => import("/src/views/requisition/HomeView.vue"),
      children: [
        { path: "nueva-requisicion-1", component: () => import('/src/views/requisition/NewRequisitionView.vue') },
        { path: "nueva-requisicion-2", component: () => import('/src/views/requisition/NewRequisitionTwoView.vue') },
        { path: "catalogo-maquinaria", component: () => import('/src/views/requisition/MachineryCatalogView.vue') },
        { path: "historial-solicitudes", component: () => import('/src/views/UserApplicationsHistoryView.vue') },
        { path: "historial-requisiciones", component: () => import('/src/views/requisition/RequisitionHistoryView.vue') },
        { path: "historial-requisiciones-solicitudes", component: () => import('/src/views/requisition/RequisitionApplicantsView.vue') },
        { path: "candidatos-seleccionados", component: () => import('/src/views/requisition/SelectedCandidatesView.vue') },
        { path: "catalogo-puestos", component: () => import('/src/views/requisition/JobCatalog.vue') },
        { path: "edicion-puesto", component: () => import('/src/views/requisition/JobEditionView.vue') },
        { path: "catalogo-maquinaria", component: () => import('/src/views/requisition/MachineryCatalogView.vue') },

      ],
      beforeEnter: authGuard
    },
    {
      path: "/nomatches",
      name: "nomatches",
      component: () => import("/src/views/NoMatchesView.vue"),
      beforeEnter: authGuard
    },

    {
      path: "/agenda",
      name: "agenda",
      component: () => import("/src/views/AgendaView.vue"),
      beforeEnter: authGuard

    },

    {
      path: "/email",
      name: "email",
      component: () => import("/src/views/EmailDesign.vue"),
      beforeEnter: authGuard
    },

    {
      path: "/restore-password/search-account",
      name: "search-account",
      component: () => import("/src/views/SearchAccountView.vue"),
    },

    {
      path: "/restore-password/send-verification",
      name: "send-verification",
      component: () => import("/src/views/SendVerificationCodeView.vue"),
    },

    {
      path: "/restore-password/verification",
      name: "verification",
      component: () => import("/src/views/VerificationCodeView.vue"),
    },

    {
      path: "/restore-password/change-password",
      name: "change-password",
      component: () => import("/src/views/ChangePasswordView.vue"),
    },

    {
      path: "/restore-password/password-restored",
      name: "password-restored",
      component: () => import("/src/views/PasswordRestoredView.vue"),
    },

    {
      path: "/privacy-advice",
      name: "privacy-advice",
      component: () => import("/src/views/user/PrivacyAdviceView.vue"),
    },
  ]
})

export default router;


