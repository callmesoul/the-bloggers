<template>
  <div class="login flex flex-align-center flex-pack-center">
    <el-card class="login-warp">
      <template #header>
        <div class="clearfix">
          <span>{{type === 0 ? '登录' : '注册'}}</span>
          <el-button style="float: right; padding: 3px 0" type="text" @click="changeType">{{type === 1 ? '登录' : '注册'}}</el-button>
        </div>
      </template>
      <el-form :model="loginForm" :rules="loginRules" ref="loginForm" label-width="100px" class="demo-loginForm" v-if="type === 0">
        <el-form-item label="邮箱" prop="identifier">
          <el-input v-model="loginForm.identifier"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="loginForm.password" type="password"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="login('loginForm')">{{type === 0 ? '登录' : '注册'}}</el-button>
        </el-form-item>
      </el-form>
      <el-form :model="registerForm" :rules="registerRules" ref="registerForm" label-width="100px" class="demo-loginForm" v-else>
        <el-form-item label="用户名" prop="username">
          <el-input v-model="registerForm.username"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="registerForm.email"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="registerForm.password" type="password"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="register('registerForm')">{{type === 0 ? '登录' : '注册'}}</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
  import { Login, Register } from '../api/user' 
  export default {
    name: 'Login',
    props: {
      msg: String
    },
    data() {
      return {
        type: 0, // 0 登陆 1 注册
        loginForm: {
          password: '',
          identifier: ''
        },
        registerForm: {
          password: '',
          email: '',
          username: ''
        },
        loginRules: {
          identifier: [
            { required: true, message: '请输入邮箱地址', trigger: 'blur' },
            { type: 'email', message: '邮箱格式有误', trigger: 'blur' }
          ],
          password: [
            { required: true, message: '请填写密码', trigger: 'blur' }
          ]
        },
        registerRules: {
          email: [
            { required: true, message: '请输入邮箱地址', trigger: 'blur' },
            { type: 'email', message: '邮箱格式有误', trigger: 'blur' }
          ],
          password: [
            { required: true, message: '请填写密码', trigger: 'blur' }
          ],
          username: [
            { required: true, message: '请填写用户名', trigger: 'blur' }
          ]
        }
      }
    },
    methods: {
      login (formName) {
        this.$refs[formName].validate(async (valid) => {
          if (valid) {
            const res = await Login(this.loginForm)
            if (res) {
              this.$store.commit('login', res)
              this.$router.replace('/admin')
            }
          } else {
            return false;
          }
        })
      },
      register (formName) {
        this.$refs[formName].validate(async (valid) => {
          if (valid) {
            const res = await Register(this.registerForm)
            if (res) {
              this.$store.commit('login', res)
              this.$router.replace('/admin')
            }
          } else {
            return false;
          }
        })
      },
      changeType () {
        if (this.type) {
          this.type = 0
        } else{
          this.type = 1
        }
      }
    }
  }
</script>

<style scoped lang="scss">
.login{
  height: 100%;
  .login-warp{
    width: 90%;
    max-width: 400px;
    text-align: left;
  }
}
</style>
  