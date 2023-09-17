const pages = [
  {
    name: "主页",
    path: "home",
    icon: "home",
    component: () => import("./home"),
    default: true,
  },
  {
    name: "热榜",
    path: "hot",
    icon: "local_fire_department",
    component: () => import("./hot"),
  },
  {
    name: "关注",
    path: "follow",
    icon: "person_add",
    component: () => import("./follow"),
  },
  {
    name: "我的",
    path: "me",
    icon: "account_circle",
    component: () => import("./me"),
  },
];

export default pages;
