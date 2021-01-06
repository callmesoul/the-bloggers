<template>
	<el-container class="base-layout">
		<el-header class="flex header flex-align-center">
      <div class="logo flex1"><a href="/admin">The Bloggers</a></div>
      <el-dropdown>
        <span class="el-dropdown-link">
          <el-avatar v-if="$store.state.user"> {{$store.state.user.email}} </el-avatar>
        </span>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item @click="logout">退出</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </el-header>
		<el-container>
			<el-menu
					:uniqueOpened="true"
					default-active="2"
					class="menu"
					@open="handleOpen"
					@close="handleClose"
					background-color="#000000"
					text-color="#fff"
          active-text-color="#ffd04b"
          router
				>
					
					<el-menu-item :index="route.path" v-for="route in routers">
						<i :class="'el-icon-' + route.meta.icon"></i>
						<template #title >{{ route.meta.title }}</template>
					</el-menu-item>
				</el-menu>
			<el-container>
				<el-main><router-view /></el-main>
				<el-footer>Footer</el-footer>
			</el-container>
		</el-container>
	</el-container>
</template>

<script>
export default {
	name: 'BaseLayout',
	props: {
		msg: String,
	},
	data() {
		return {
      routers: []
    }
	},
  created() {
    const allRouters = this.$router.getRoutes()
    this.routers = allRouters.find(item => item.name === 'admin').children
    console.log(this.routers.children)
  },
  methods: {
    logout () {
      this.$store.commit('logout')
      this.$router.push('/login')
    }
  }
};
</script>

<style lang="scss" scoped>
.base-layout {
  height: 100%;
  .header{
    background: #000000;
    color: #ffffff;
    .logo{
      text-align: left;
      line-height: 60px;
      font-size: 30px;
      font-weight: bold;
      a{
        color: #ffffff;
        text-decoration: none;
      }
    }
  }
  .menu{
    width: 200px;
    text-align: left;
    
  }
  footer{
    line-height: 30px;
    height: 30px !important;
    color: #999999;
  }
}
</style>
