import Vue from 'vue'
import Router from 'vue-router'
import Layout from '@/layout'

Vue.use(Router)

export const constantRoutes = [
  {
    path: '/redirect',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '/redirect/:path(.*)',
        component: () => import('@/views/redirect/index')
      }
    ]
  },

  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },

  {
    path: '/register',
    component: () => import('@/views/register/index'),
    hidden: true
  },

  {
    path: '/',
    redirect: '/dashboard',
    hidden: true
  },

  {
    path: '/dashboard',
    name: 'Dashboard',
    component: Layout,
    redirect: '/dashboard/index',
    children: [
      {
        path: 'index',
        name: 'index',
        component: () => import('@/views/dashboard'),
        meta: {
          title: 'dashboard',
          icon: ''
        }
      }
    ]
  },

  {
    path: '/node-manage',
    name: 'NodeManage',
    component: Layout,
    redirect: '/node-manage/node-list',
    meta: { title: 'nodeManage', icon: '' },
    children: [
      {
        path: 'node-list',
        name: 'nodeList',
        component: () => import('@/views/node/list'),
        meta: {
          title: 'nodeList',
          icon: ''
        }
      }
    ]
  },

  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  }
]

export const asyncRoutes = [
  {
    path: '/users-manage',
    name: 'UsersManage',
    component: Layout,
    redirect: '/users-manage/user-list',
    meta: {
      title: 'usersManage',
      icon: '',
      roles: ['sysadmin', 'admin', 'user']
    },
    children: [
      {
        path: 'user-list',
        name: 'userList',
        component: () => import('@/views/users/list'),
        meta: {
          title: 'userList',
          icon: '',
          roles: ['sysadmin', 'admin']
        }
      },
      {
        path: 'modify-pass',
        name: 'modifyPass',
        component: () => import('@/views/users/modify/index'),
        meta: {
          title: 'modifyPass',
          icon: ''
        }
      }
    ]
  },
  {
    path: '/system',
    name: 'System',
    component: Layout,
    redirect: '/system/index',
    meta: { roles: ['sysadmin', 'admin'] },
    children: [
      {
        path: 'index',
        name: 'index',
        component: () => import('@/views/system'),
        meta: {
          title: 'system',
          icon: ''
        }
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
