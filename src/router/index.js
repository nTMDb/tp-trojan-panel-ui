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
          title: 'Dashboard',
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
        component: () => import('@/views/users/profile'),
        meta: {
          title: 'Profile',
          name: 'profile'
        }
      }
    ]
  },

  {
    path: '/node-manage',
    name: 'nodeManage',
    component: Layout,
    redirect: '/node-manage/node-list',
    meta: { title: 'NodeManage', icon: 'node' },
    children: [
      {
        path: 'node-list',
        name: 'nodeList',
        component: () => import('@/views/node/list'),
        meta: {
          title: 'NodeList'
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
    name: 'usersManage',
    component: Layout,
    redirect: '/users-manage/user-list',
    meta: {
      title: 'UsersManage',
      icon: 'user',
      roles: ['sysadmin', 'admin']
    },
    children: [
      {
        path: 'user-list',
        name: 'userList',
        component: () => import('@/views/users/list'),
        meta: {
          title: 'UserList',
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
      title: 'EmailManage',
      icon: 'email',
      roles: ['sysadmin', 'admin']
    },
    children: [
      {
        path: 'email-record',
        name: 'emailRecord',
        component: () => import('@/views/email/record'),
        meta: {
          title: 'EmailRecord',
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
      title: 'System',
      icon: 'system',
      roles: ['sysadmin']
    },
    children: [
      {
        path: 'base-config',
        name: 'baseConfig',
        component: () => import('@/views/system/base'),
        meta: {
          title: 'BaseConfig',
          roles: ['sysadmin']
        }
      },
      {
        path: 'black-list',
        name: 'blackList',
        component: () => import('@/views/system/black'),
        meta: {
          title: 'BlackList',
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
