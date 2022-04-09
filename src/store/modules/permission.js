import store from '@/store'

function hasPermission(roles, route) {
  if (route.meta && route.meta.role) {
    return store.getters.roleNames.includes(route.meta.role)
  } else {
    return true
  }
}

export function filterRoutes(roleNames, routes) {
  const res = []

  routes.forEach((route) => {
    const tmp = { ...route }
    if (hasPermission(roleNames, tmp)) {
      if (tmp.children) {
        tmp.children = filterRoutes(roleNames, tmp.children)
      }
      res.push(tmp)
    }
  })

  return res
}
