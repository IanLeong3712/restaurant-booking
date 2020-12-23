const routes = [
  {
    path: "/",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      {
        name: "BookingTime",
        path: "",
        component: () => import("pages/booking")
      },
      {
        name: "BookingDetail",
        path: "detail",
        props: true,
        component: () => import("pages/booking/detail")
      },
      {
        name: "BookingOver",
        path: "thanks",
        props: true,
        component: () => import("pages/booking/finish")
      }
    ]
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: "*",
    component: () => import("pages/Error404.vue")
  }
];

export default routes;
