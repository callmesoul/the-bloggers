<template>
  <div class="home">
    <div class="header">
      <h1>The Bloggers</h1>
      <h4><b>博客者联盟</b>，简称<b>‘博联’</b>，哈哈笑死我了</h4>
      <i>
        友情链接的升级版!
        <br />
        通过调用api的形式，智能匹配联盟内所有博客关联的文章进行推荐
      </i>
    </div>
    <div class="power">
      <h2>优势：</h2>
      <ol>
        <li><b>关联性强</b>-根据当前文章标题内容等智能匹配关联文章（前期加入的网站较少，匹配会少，没有匹配的情况下按热度推荐），摆脱可用性较小的友情链接</li>
        <li><b>可定制性强</b>-api接口形式调用，样式随你写</li>
        <li><b>兼容性强</b>-api接口形式调用，不限博客框架能调用api接口行；通过RSS抓取文章，按照样本生成RSS即可</li>
      </ol>
    </div>
    <div class="notice">
      <h2>使用：</h2>
      <ol>
        <li>点下面的“立刻加入”按钮，注册登陆</li>
        <li>然后选网站 -> 添加: 输入网站博客的RSS地址，提交</li>
        <li>
          在自己博客文章页里调用关联api,并获取匹配关联的文章<br />
          url: http://localhost:1337/articles/recommend
          method: post
          body: {
            title: "文章标题必填",
            guid: "文章唯一标识必填",
            limit: 12,  // 获取文章关联条数 默认12
          }
        </li>
        <li>等待审核即可</li>
      </ol>
    </div>
    <div class="notice">
      <h2>审核通过条件：</h2>
      <ol>
        <li>原创（必须）</li>
        <li>可良好阅读(界面上保证基本的可阅读行和排版)</li>
      </ol>
    </div>
    <div>
      <el-button type="primary" @click="toWebsite">立即加入<b>The bloggers</b></el-button>
      <a href="https://github.com/callmesoul/the-bloggers/issues" target="_blank">反馈建议或bug</a>
    </div>

    <div class="rule">
      <h2>匹配规则：</h2>
      <ol>
        <li>关键词（文章标题提取（最多5个） + rss的category字段）</li>
        <li>短句（从文章内容提取 5个）</li>
        <li>通过关键词匹配 + 短句匹配</li>
      </ol>
    </div>

    <div class="attach">
      <h2>注意事项：</h2>
      <ol>
        <li>审核通过后，若网站15日内未调用过匹配接口，则网站（网站文章）将会暂时下架（将不会被匹配）</li>
      </ol>
    </div>

    <div class="users">
      <h2>联盟成员:</h2>
      <ul>
        <li v-for="website in websites">
          <p><a :href="website.link" target="_blank">{{ website.name }}</a></p>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
  import { Login } from '../api/user'
  import { Find } from '../api/website'
  export default {
    name: 'Home',
    props: {
      msg: String
    },
    data() {
      return {
        count: 0,
        websites: []
      }
    },
    async created () {
      this.websites = await Find({ all: true})
    },
    methods: {
      toWebsite () {
        this.$router.push('/admin/website')
      }
    }
  }
</script>

<style lang="scss">
  .home{
    text-align: left;
    width: 800px;
    margin: 0 auto;
    .header{
      text-align: center;
    }
  }
</style>
  