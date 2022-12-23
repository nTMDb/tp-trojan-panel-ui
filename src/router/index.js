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
    component: Layout,
    redirect: '/dashboard/index',
    children: [
      {
        path: 'index',
        name: 'index',
        component: () => import('@/views/dashboard'),
        meta: {
          title: 'dashboard',
          name: 'dashboard',
          icon: 'dashboard'
        }
      }
    ]
  },

  {
    path: '/profile',
    component: Layout,
    hidden: true,
    redirect: '/profile/index',
    children: [
      {
        path: 'index',
        name: 'index',
        component: () => import('@/views/account/profile'),
        meta: {
          title: 'profile',
          name: 'profile'
        }
      }
    ]
  },

  {
    path: '/server-manage',
    name: 'serverManage',
    component: Layout,
    redirect: '/server-manage/server-list',
    meta: { title: 'serverManage', icon: 'server' },
    children: [
      {
        path: 'server-list',
        name: 'serverList',
        component: () => import('@/views/node-server/list'),
        meta: {
          title: 'serverList'
        }
      }
    ]
  },

  {
    path: '/node-manage',
    name: 'nodeManage',
    component: Layout,
    redirect: '/node-manage/node-list',
    meta: { title: 'nodeManage', icon: 'node' },
    children: [
      {
        path: 'node-list',
        name: 'nodeList',
        component: () => import('@/views/node/list'),
        meta: {
          title: 'nodeList'
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
    path: '/account-manage',
    name: 'accountManage',
    component: Layout,
    redirect: '/account-manage/account-list',
    meta: {
      title: 'accountManage',
      icon: 'account',
      roles: ['sysadmin', 'admin']
    },
    children: [
      {
        path: 'account-list',
        name: 'accountList',
        component: () => import('@/views/account/list'),
        meta: {
          title: 'accountList',
          roles: ['sysadmin', 'admin']
        }
      }
    ]
  },

  {
    path: '/emailManage',
    name: 'emailManage',
    component: Layout,
    redirect: '/emailManage/email-record',
    meta: {
      title: 'emailManage',
      icon: 'email',
      roles: ['sysadmin', 'admin']
    },
    children: [
      {
        path: 'email-record',
        name: 'emailRecord',
        component: () => import('@/views/email/record'),
        meta: {
          title: 'emailRecord',
          roles: ['sysadmin', 'admin']
        }
      }
    ]
  },

  {
    path: '/system',
    name: 'system',
    component: Layout,
    redirect: '/system/base-config',
    meta: {
      title: 'system',
      icon: 'system',
      roles: ['sysadmin']
    },
    children: [
      {
        path: 'base-config',
        name: 'baseConfig',
        component: () => import('@/views/system/base'),
        meta: {
          title: 'baseConfig',
          roles: ['sysadmin']
        }
      },
      {
        path: 'black-list',
        name: 'blackList',
        component: () => import('@/views/system/black'),
        meta: {
          title: 'blackList',
          roles: ['sysadmin']
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
