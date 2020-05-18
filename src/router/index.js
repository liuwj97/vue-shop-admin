import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/Login.vue'
import Index from '../components/Index.vue'
import Welcome from '../components/Welcome.vue'
import Users from '../views/users/Users.vue'
import Powers from '../views/power/Powers.vue'
import Roles from '../views/power/Roles.vue'
import Goods from '../views/goods/Goods.vue'

Vue.use(VueRouter)

// 路由规则
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
    }, {
        path: '/rights',
        component: Powers,
        name: 'powers',
        meta: {
            title: '权限列表'
        }
    }, {
        path: '/roles',
        component: Roles,
        name: 'roles',
        meta: {
            title: '角色列表'
        }
    }, {
        path: '/goods',
        component: Goods,
        name: 'goods',
        meta: {
            title: '商品列表'
        }
    }]
}]

// 创建路由实列对象
const router = new VueRouter({
    // 设置路由规则
    routes
});
// 路由导航守卫
router.beforeEach((to, from, next) => {
    to.params.activeMebuIndex = to.path;
    console.log(to)
    console.log(from)
    if (to.path !== '/login') {
        // 跳转地址不是登录页则需要验证token
        const token = sessionStorage.getItem('token')
            // token验证不通过则强制跳转登录页
        if (!token) return next('/login')
            // 验证通过则放行
        return next()

    }
    // 跳转地址是登录页则直接放行
    next()
})

export default router