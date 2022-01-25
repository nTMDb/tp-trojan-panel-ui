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
    redirect: '/users-manage'
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
        meta: { title: '用户列表', icon: '' }
      },
      {
        path: 'modify-pass',
        name: 'modifyPass',
        component: () => import('@/views/users/modify/index'),
        meta: { title: '修改密码', icon: '' }
      }
    ]
  },

  {
    path: '/pkg-manage',
    component: Layout,
    redirect: '/pkg-manage/my-pkg',
    name: 'PkgManage',
    meta: { title: '套餐管理', icon: '' },
    children: [
      {
        path: 'my-pkg',
        name: 'myPkg',
        component: () => import('@/views/pkg/my'),
        meta: { title: '我的套餐', icon: '' }
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
        meta: { title: '节点列表', icon: '' }
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
