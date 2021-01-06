<template>
	<div class="website">
		<div class="page-header flex flex-align-center">
			<div class="page-title">{{ $route.meta.title }}</div>
			<div class="page-screen flex1"></div>
			<div class="page-operate">
			</div>
		</div>
		<el-table :data="articles" stripe style="width: 100%">
			<el-table-column prop="title" label="标题" >
				<template #default="scope">
					<el-link :href="scope.row.link" target="_blank">{{scope.row.title}}</el-link>
				</template>
			</el-table-column>
			<el-table-column prop="guid" label="guid" width="300"></el-table-column>
			<el-table-column prop="link" label="封面" width="180">
				<template #default="scope">
					<img :src="scope.row.cover" style="width: 150px;" />
				</template>
			</el-table-column>
			<el-table-column prop="website.name" label="网站" width="180"> </el-table-column>
			<el-table-column prop="count" label="匹配次数" width="100"></el-table-column>
			<el-table-column prop="created_at" label="加入时间" width="180">
			</el-table-column>
			<!-- <el-table-column label="操作" width="120">
				<template #default="scope">
					<el-button
						type="primary"
						icon="el-icon-edit"
						circle
						@click="editItem(scope.row)"
					></el-button>
					<el-button
						type="danger"
						icon="el-icon-delete"
						circle
						@click="deleteItem(scope.row)"
					></el-button>
				</template>
			</el-table-column> -->
		</el-table>
	</div>

	<el-dialog
		:title="form.id ? '修改' : '新增'"
		v-model="dialogVisible"
		width="30%"
		:before-close="handleClose"
	>
  <el-form ref="form" :model="form" :rules="rules" label-width="120px">
    <el-form-item label="网站Rss地址" prop="rssUrl">
      <el-input v-model="form.rssUrl"></el-input>
    </el-form-item>
  </el-form>
		<template #footer>
			<span class="dialog-footer">
				<el-button @click="dialogVisible = false">取 消</el-button>
				<el-button type="primary" @click="submit('form')">提交</el-button
				>
			</span>
		</template>
	</el-dialog>
</template>

<script>
import { Find, Create, Update, Delete } from '../api/article';
export default {
	name: 'Article',
	data() {
		return {
      articles: [],
      dialogVisible: false,
      form: {
          rssUrl: '',
      },
      rules: {
        rssUrl:[
          { required: true, message: 'rss地址不能为空', trigger: 'blur' },
          { type: 'url', message: 'rss地址格式有误', trigger: 'blur' }
        ]
      }
		};
	},
	created() {
		this.getArticles()
	},
	methods: {
		async getArticles() {
			const res = await Find({ _sort: 'created_at:desc'})
			if (res) {
				this.articles = res;
			}
    },
    async submit (formName) {
      const valid = await this.$refs[formName].validate()
      if (!valid) {
        return
      }
      let res
      if (this.form.id) {
        // update
        res = await Update({ id: this.form.id, rssUrl: this.form.rssUrl })
      } else {
        // create
        res = await Create({ rssUrl: this.form.rssUrl })
      }
      if (res) {
        this.getArticles()
        this.dialogVisible = false
        ElMessage.success('提交成功');
      }
		},
		addItem () {
			this.dialogVisible = true
			this.$nextTick(() => {
				if (this.form.id) {
					delete this.form.id
				}
				this.$refs.form.resetFields()
			})
		},
		editItem (item) {
			this.dialogVisible = true
			this.$nextTick(() => {
				this.form.id = item.id
				this.form.rssUrl = item.rssUrl
			})
		},
		deleteItem (item) {
			this.$confirm(`此操作将永久删除${item.name}, 是否继续?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async () => {
					const res = await Delete({ id: item.id })
					if (res) {
						this.getArticles()
						ElMessage.success('删除成功');
					}
        })
		}
	}
};
</script>
