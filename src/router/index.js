import Vue from 'vue';
import VueRouter from 'vue-router'; //載入 vue-router
import homePage from "@/views/homePage";

Vue.use(VueRouter) //使用 vue-router

export default new VueRouter({
  routes: [
    {
       path:'/', //redirect 是重新定向
       redirect:'/home'
       },
    {
      name: '首頁',  //元件呈現的名稱
      path: '/home', //對應的路徑
      component: homePage  //對應的元件
    },
  ]
})