<template>
  <div class="index">index</div>
</template>

<script>
  import { Login } from '../api/user' 
  export default {
    name: 'Login',
    props: {
      msg: String
    },
    data() {
      return {
        count: 0
      }
    },
    created () {
      console.log(Login())
      console.log('created')
    }
  }
</script>
  