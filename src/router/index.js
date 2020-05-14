import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/Login.vue'
import Index from '../components/Index.vue'
import Welcome from '../components/Welcome.vue'
import Users from '../views/users/Users.vue'

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
    redirect: '/welcome',
    component: Index,
    meta: {
        title: '首页'
    },
    children: [{
        path: '/welcome',
        component: Welcome,
        name: 'welcome'
    }, {
        path: '/users',
        component: Users,
        name: 'users',
        meta: {
            title: '用户列表'
        }
    }]
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