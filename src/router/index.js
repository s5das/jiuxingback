import { createRouter,createWebHistory } from "vue-router";

export default createRouter({
    history:createWebHistory(),
    routes:[
        {
            path:'/',
            component:() => import('@/pages/login.vue')
        },
        {
            path:'/mainpage',
            component:() => import('@/pages/mainPage.vue')
        }
    ]
})