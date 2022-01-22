import Vue from 'vue'
import Router from 'vue-router'
import Layout from '@/layout'

Vue.use(Router)

export const constantRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },

  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },

  {
    path: '/',
    component: Layout,
    redirect: '/usersList',
    name: 'Users',
    meta: { title: '用户管理', icon: '' },
    children: [
      {
        path: 'usersList',
        name: 'usersList',
        component: () => import('@/views/users/list/index'),
        meta: { title: '用户列表', icon: '' }
      },
      {
        path: 'modifyPass',
        name: 'modifyPass',
        component: () => import('@/views/users/modify/index'),
        meta: { title: '修改密码', icon: '' }
      }
    ]
  },

  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () =>
  new Router({
    scrollBehavior: () => ({ y: 0 }),
    routes: constantRoutes
  })

const router = createRouter()

export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher
}

export default router
