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
          title: '仪表板',
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
    meta: { title: '节点管理', icon: '' },
    children: [
      {
        path: 'node-list',
        name: 'nodeList',
        component: () => import('@/views/node/list'),
        meta: {
          title: '节点列表',
          icon: ''
        }
      }
    ]
  },

  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },

  { path: '*', redirect: '/404', hidden: true }
]

export const asyncRoutes = [
  {
    path: '/users-manage',
    name: 'UsersManage',
    component: Layout,
    redirect: '/users-manage/user-list',
    meta: { title: '用户管理', icon: '',roles:['sysadmin','admin','user'] },
    children: [
      {
        path: 'user-list',
        name: 'userList',
        component: () => import('@/views/users/list'),
        meta: {
          title: '用户列表',
          icon: '',
          roles: ['sysadmin','admin']
        }
      },
      {
        path: 'modify-pass',
        name: 'modifyPass',
        component: () => import('@/views/users/modify/index'),
        meta: {
          title: '修改密码',
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
    meta: { title: '系统设置', icon: '',roles:['sysadmin','admin'] },
    children: [
      {
        path: 'index',
        name: 'index',
        component: () => import('@/views/system'),
        meta: {
          title: '系统设置',
          icon: ''
        }
      }
    ]
  },
  {
    path: '/about',
    name: 'About',
    component: Layout,
    redirect: '/about/index',
    meta: { title: '关于项目', icon: '',roles:['sysadmin','admin'] },
    hidden: true,
    children: [
      {
        path: 'index',
        name: 'index',
        component: () => import('@/views/about'),
        meta: {
          title: '关于项目',
          icon: ''
        }
      }
    ]
  }
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
