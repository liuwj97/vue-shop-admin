import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/Login.vue'
import Index from '../components/Index.vue'

Vue.use(VueRouter)

const routes = [{
    path: '/',
    redirect: '/login'
}, {
    path: '/login',
    name: 'login',
    component: Login
}, {
    path: '/index',
    name: 'index',
    component: Index
}]

const router = new VueRouter({
    routes
})
router.beforeEach((to, from, next) => {
    if (to.path !== '/login') {
        const token = sessionStorage.getItem('token')
        if (!token) return next('/login')
        return next()

    }
    next()
})

export default router