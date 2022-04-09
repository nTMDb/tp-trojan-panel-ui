import Vue from 'vue'
import Router from 'vue-router'
import Layout from '@/layout'

Vue.use(Router)

export const constantRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login/index')
  },

  {
    path: '/register',
    component: () => import('@/views/register/index')
  },

  {
    path: '/',
    redirect: '/dashboard'
  },

  {
    path: '/dashboard',
    component: Layout,
    redirect: '/dashboard/index',
    name: 'Dashboard',
    children: [
      {
        path: 'index',
        name: 'index',
        component: () => import('@/views/dashboard'),
        meta: {
          title: '仪表板',
          icon: '',
          role: 'user'
        }
      }
    ]
  },

  {
    path: '/users-manage',
    component: Layout,
    redirect: '/users-manage/user-list',
    name: 'UsersManage',
    meta: { title: '用户管理', icon: '' },
    children: [
      {
        path: 'user-list',
        name: 'userList',
        component: () => import('@/views/users/list'),
        meta: {
          title: '用户列表',
          icon: '',
          role: 'admin'
        }
      },
      {
        path: 'modify-pass',
        name: 'modifyPass',
        component: () => import('@/views/users/modify/index'),
        meta: {
          title: '修改密码',
          icon: '',
          role: 'user'
        }
      }
    ]
  },

  {
    path: '/node-manage',
    component: Layout,
    redirect: '/node-manage/node-list',
    name: 'NodeManage',
    meta: { title: '节点管理', icon: '' },
    children: [
      {
        path: 'node-list',
        name: 'nodeList',
        component: () => import('@/views/node/list'),
        meta: {
          title: '节点列表',
          icon: '',
          role: 'user'
        }
      }
    ]
  },

  {
    path: '/system',
    component: Layout,
    redirect: '/system/index',
    name: 'System',
    children: [
      {
        path: 'index',
        name: 'index',
        component: () => import('@/views/system'),
        meta: {
          title: '系统设置',
          icon: '',
          role: 'admin'
        }
      }
    ]
  },

  {
    path: '/about',
    component: Layout,
    redirect: '/about/index',
    name: 'About',
    children: [
      {
        path: 'index',
        name: 'index',
        component: () => import('@/views/about'),
        meta: {
          title: '关于项目',
          icon: '',
          role: 'admin'
        }
      }
    ]
  },

  {
    path: '/404',
    component: () => import('@/views/404')
  },

  { path: '*', redirect: '/404' }
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
