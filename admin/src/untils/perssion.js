import router from '../router'
import store from '../store'
import { Me } from '../api/user'
import axios from 'axios'
router.beforeEach(async (to, from, next) => {
  if (to.name === 'login' || to.name === 'home') {
    next()
  } else {
    const token = store.state.token
    if (!token) {
      next('/login')
    }
    if (!store.state.user) {
        const res = await Me()
        if (res) {
          store.commit('setUser', res)
        }
    }
    next()
  }
})