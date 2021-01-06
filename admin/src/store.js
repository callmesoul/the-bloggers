import { createStore } from 'vuex'

// Create a new store instance.
const store = createStore({
  state () {
    return {
      token: localStorage.getItem('token') || null,
      user: null
    }
  },
  mutations: {
    login (state, { jwt, user}) {
      localStorage.setItem('token', jwt)
      state.token = jwt
      state.user = user
    },
    logout (state) {
      localStorage.removeItem('token')
      state.token = null
      state.user = null
    },
    setUser (state, user) {
      state.user = user
    }
  }
})


export default store